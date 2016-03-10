/**
 * Created by Helena on 29.12.2015.
 *
 */



/*********** view **********/


function removeTimelineTableMarkup() {
    unmarkAllCells();
    removeAllEventPopovers();
    freeAllCells();
    clearTable();
}

function activateTimelineTable(simulation) {
    highlightCurrentSituation(simulation);
    activateTimelineTooltips();
}


function clearTable() {
    $("#timelineTable thead").empty();
    $("#timelineTable tbody").empty();
}

function createHeader() {
    $("#timelineTable thead")
        .append($("<tr>").addClass("timeline-header")
            .append($("<th>").addClass("timeline-step-label")));
}

function createSteps(steps) {
    var timelineBodyElement = $("#timelineTable > tbody");

    var _getStepOptionsContent = function () {

        var timelineStepOptionsContent = $("<div>").addClass("popover-step-options")
            .append($("<span>").addClass("btn btn-sm fui-check").tooltip(getInteractionTooltipOptions("Kopierte Situation einfügen")).hide())
            .append($("<span>").addClass("btn btn-sm fui-cross").tooltip(getInteractionTooltipOptions("Kopieren abbrechen")).hide())
            .append($("<span>").addClass("btn-separator").text("|").hide())
            .append($("<span>").addClass("btn btn-sm fui-plus").tooltip(getInteractionTooltipOptions("Neue Situation einfügen")))
            .append($("<span>").addClass("btn btn-sm fui-copy").tooltip(getInteractionTooltipOptions("Situation kopieren")))
            .append($("<span>").addClass("btn btn-sm fui-trash").tooltip(getInteractionTooltipOptions("Situation löschen")));

        return timelineStepOptionsContent;
    };

    for (var i = 1; i <= steps; i++)
        $(timelineBodyElement)
            .append($("<tr>").addClass("timeline-step")
                .append($("<td>").addClass("timeline-step-label")
                    .html(i.toString())
                    .attr("title", "Situation " + i.toString())
                )
                .popover({
                    container: "body",
                    content: _getStepOptionsContent(),
                    html: true,
                    placement: "top",
                    trigger: "manual"
                })
            );
}

function createColumn(contextInfo) {

    var _getColumnOptionsContent = function (contextInfo) {

        var timelineColumnOptionsContent = $("<div>").addClass("popover-column-options")
            .append($("<span>").addClass("btn btn-sm fui-eye-blocked").tooltip(getInteractionTooltipOptions(infotexts.ignoreAll)))
            .append($("<span>").addClass("btn btn-sm fui-trash").tooltip(getInteractionTooltipOptions("Alle dieser Werte löschen")));

        if (!expectsLearningUnit(contextInfo) && contextInfo.hasMultiplicity())
            timelineColumnOptionsContent
                .append($("<span>").addClass("btn btn-sm fui-plus").tooltip(getInteractionTooltipOptions("Neue Spalte einfügen")));

        return timelineColumnOptionsContent;
    };


    $(".timeline-header")
        .append($("<th>")
            .html(formatUnitIcons(contextInfo))
            //.append($("<div>").addClass("timeline-header-options")
            //    .text("...").hide()
            //    .tooltip(getTopTooltipOptions("Optionen für " + translate_contextInformation(contextInfo.getID())))
            //    .popover("destroy")
                .popover({
                    container: "body",
                    content: _getColumnOptionsContent(contextInfo),
                    html: true,
                    placement: "bottom"
                })
            //)
        );

    // add one column for each context item
    $(".timeline-step").each(function() {
        $(this)
            .append( $("<td>").addClass("timeline-cell")
                .attr("contextClass", contextInfo.getClasses()[0])
                .tooltip(getContextTooltipOptions(getContextUnknownTooltipTitle(contextInfo)))
            );
    });
}


function highlightCurrentSituation(simulation) {

    var selectedStep = simulation.getTimeline().getSelectedStep();
    var isSimulating = simulation.getStatus() != STOPPED;

    // highlight selected step if simulation is running or paused
    if (isSimulating) highlightStep(selectedStep);
    else removeStepHighlighting();

    var selectedStepElement = $(".selected-step");

    // add line indicator (little arrow)
    selectedStepElement.addClass("simulated-situation");

    // scroll selected step into view during simulation
    var timelineWindow = $("#timelineTableWindow");
    if (isSimulating && getBottom(selectedStepElement) >= getBottom(timelineWindow) ) {
        var timelineScrollTop = $(timelineWindow).scrollTop();
        var scrollTopDelta = timelineScrollTop + getTop(selectedStepElement) - getTop(timelineWindow);

        // scroll the timeline so that selected step remains visible
        $(timelineWindow).animate({scrollTop: scrollTopDelta}, 500);
    }
}


function highlightStep(stepIndex) {

    $("#timelineTable tbody tr.timeline-step").each(function(step){
        if (step == stepIndex)
            $(this).addClass("selected-step");
        else $(this).removeClass("selected-step");
    });
}

function markStep(stepIndex) {

    $("#timelineTable tbody tr.timeline-step").each(function(step){
        if (step == stepIndex)
            $(this).addClass("marked-step");
        else $(this).removeClass("marked-step");
    });
}

function removeStepHighlighting() {
    $(".selected-step").removeClass("selected-step");
}

function removeStepMarking() {
    $(".marked-step").removeClass("marked-step");
}

function activateTimelineTooltips () {

    // activate timeline info tooltip
    $("#timelineInfo")
        .tooltip({
            container: "body",
            placement: "left"
        })
        .popover("destroy")
        .popover({
            container: "body",
            content: infotexts.timeline,
            html: true,
            placement: "left"
        })
        .off("shown.bs.popover").on("shown.bs.popover", function (e) {
            $(e.target).tooltip("destroy");

            var popoverElement = $(e.target).data("bs.popover").$tip;
            replaceActionVerbInTitle(popoverElement);
            addCloseXToPopoverTitle(popoverElement);
        })
        .off("hide.bs.popover").on("hide.bs.popover", function (e) {
            $(e.target).tooltip({
                container: "body",
                placement: "left"
            });
        });

    // re-initialize all tooltips with given options (if any) or default
    $("#timelineContainer *").each(function (index, element) {
        var tooltip = $(element).data("bs.tooltip");
        $(element).tooltip(tooltip ? tooltip.options : {container: "body"});
    });
}




function hideContextEvents(contextEvents) {
    contextEvents.forEach(function (contextEvent) {
        contextEvent.setVisibility(false);

        $(getContextEventCells(contextEvent)).addClass("timeline-cell-invisible");
    });
}

function showContextEvents(contextEvents) {
    contextEvents.forEach(function (contextEvent) {
        contextEvent.setVisibility(true);

        $(getContextEventCells(contextEvent)).removeClass("timeline-cell-invisible");
    });
}



function getColumnCells(colIndex) {
    var cells = $();
    $(".timeline-step").each(function (index, step) {
        cells = cells.add($(step).children(".timeline-cell").eq(colIndex))
    });
    return cells;
}



/*** tiny little helper (i.e. readability improvement) functions ***/
function getTop (cell) {
    return $(cell).offset().top - parseInt($(cell).css("border-top-width"));
}
function getBottom (cell) {
    return $(cell).offset().top + $(cell).height() + parseInt($(cell).css("border-bottom-width"));
}
function getLeft (cell) {
    return $(cell).offset().left - parseInt($(cell).css("border-left-width"));
}
function getRight (cell) {
    return $(cell).offset().left + $(cell).width() + parseInt($(cell).css("border-right-width"));
}


function getColIDOfCell(cell) {
    return $(cell).parent().children(".timeline-cell").index(cell);
}

function getRowIDOfCell(cell) {
    return $(cell).parent().index();
}

function getCellAt(row, col) {
    return $(".timeline-step").eq(row).children(".timeline-cell").eq(col);
}



function unmarkAllCells() {
    $(".timeline-cell-marked").removeClass("timeline-cell-marked");
}

function freeAllCells() {
    $(".timeline-cell-occupied").empty()
        .removeClass("timeline-cell-occupied");
}



function hideAllTooltips() {
    $(".tooltip").tooltip("hide");
}

function hideAllTimelineToolTips() {
    $("#timelineTable").find("*").tooltip("hide");
}

function hideAllPopovers() {
    // triggers "hide.bs.popover" event --> see handling: createNewPopover() in eventPopoverController.js
    $(".popover").popover("hide");
}


function removeAllCellTooltips () {
    $(".timeline-cell").find("*").addBack().tooltip("destroy");
}


function getContextUnknownTooltipTitle(contextInfo) {
    // "Nutzer hat noch keine Lerneinheit abgeschlossen"
    return (expectsLearningUnit(contextInfo) ? infotexts.noFLU :
        // "<CONTEXT NAME> ist unbekannt"
        translate_contextInformation(contextInfo.getID()) + infotexts.unknownValue);
}

function getContextTooltipOptions (title) {
    return {
        animation: false,
        container: "body",
        html: true,
        placement: "auto top",
        title: title
    };
}

function getInteractionTooltipOptions (title) {
    return {
        animation: true,
        container: "body",
        html: true,
        placement: "auto top",
        title: title
    };
}