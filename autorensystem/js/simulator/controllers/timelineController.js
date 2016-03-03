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
    // set event handlers for generated cells
    setTimelineMouseEventHandlers(simulation);
    highlightSelectedStep(simulation);
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

    for (var i = 1; i <= steps; i++)
        $(timelineBodyElement)
            .append($("<tr>").addClass("timeline-step")
                .append($("<td>").addClass("timeline-step-label")
                    .html(i.toString())
                    .attr("title", "Situation " + i.toString())
            ));
}

function createColumn(contextInfo) {

    var _getColumnOptionsContent = function (contextInfo) {

        var timelineColumnOptionsContent = $("<div>").addClass("popover-column-options")
            .append($("<span>").addClass("btn btn-sm fui-eye-blocked").tooltip(getTopTooltipOptions(infotexts.ignoreAll)))
            .append($("<span>").addClass("btn btn-sm fui-trash").tooltip(getTopTooltipOptions("Alle dieser Werte löschen")));

        if (!expectsLearningUnit(contextInfo) && contextInfo.hasMultiplicity())
            timelineColumnOptionsContent
                .append($("<span>").addClass("btn btn-sm fui-plus").tooltip(getTopTooltipOptions("Neue Spalte einfügen")));

        return timelineColumnOptionsContent;
    };


    $(".timeline-header")
        .append($("<th>")
            .html(formatUnitIcons(contextInfo))
            .append($("<div>").addClass("timeline-header-options")
                .text("...").hide()
                .tooltip(getTopTooltipOptions("Optionen für " + translate_contextInformation(contextInfo.getID())))
                .popover("destroy")
                .popover({
                    container: "body",
                    content: _getColumnOptionsContent(contextInfo),
                    html: true,
                    placement: "bottom"
                })
            )
        );

    // add one column for each context item
    $(".timeline-step").each(function() {
        $(this)
            .append( $("<td>").addClass("timeline-cell")
                .attr("contextClass", contextInfo.getClasses()[0])
                .tooltip(getTopTooltipOptions(translate_contextInformation(contextInfo.getID()) + " hat keinen Wert"))
        );
    });
}


function highlightSelectedStep(simulation) {
    var selectedStep = simulation.getTimeline().getSelectedStep();
    var isSimulating = simulation.getStatus() != STOPPED;

    // highlight selected step if simulation is running or paused

    $("#timelineTable tbody tr.timeline-step").each(function(step){
        if (isSimulating && step == selectedStep)
            $(this).addClass("selected-step");
        else $(this).removeClass("selected-step");
    });

    // scroll selected step into view

    var selectedStepElement = $(".selected-step");
    var timelineWindow = $("#timelineTableWindow");

    if (isSimulating && getBottom(selectedStepElement) >= getBottom(timelineWindow) ) {
        var timelineScrollTop = $(timelineWindow).scrollTop();
        var scrollTopDelta = timelineScrollTop + getTop(selectedStepElement) - getTop(timelineWindow);

        // scroll the timeline so that selected step remains visible
        $(timelineWindow).animate({scrollTop: scrollTopDelta}, 500);
    }
}


function activateTimelineTooltips () {

    // activate timeline info tooltip
    $("#timelineInfo")
        .tooltip({
            container: "body",
            placement: "auto left"
        })
        .popover("destroy")
        .popover({
            container: "body",
            content: infotexts.timeline,
            html: true,
            placement: "left"
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
        .removeClass(".timeline-cell-occupied");
}



function hideAllTooltips() {
    $(".tooltip").tooltip("hide");
}

function hideAllPopovers() {
    // triggers "hide.bs.popover" event --> see handling: createNewPopover() in eventPopoverController.js
    $(".popover").popover("hide");
}


function removeAllCellTooltips () {
    $(".timeline-cell").find("*").addBack().tooltip("destroy");
}

function getTopTooltipOptions (title) {
    return {
        animation: false,
        container: "body",
        html: true,
        placement: "auto top",
        title: title
    };
}