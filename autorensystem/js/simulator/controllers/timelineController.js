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


function resizePanelToTableWidth() {
    var tableElement = $("#timelineTable");
    $(tableElement).closest(".properties").width($(tableElement).width());
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
                    .tooltip({
                        container: "body",
                        html: true,
                        placement: "left"
                    })
                    .popover({
                        container: "body",
                        content: getStepOptionsContent,
                        delay: { show: 100, hide: 300 },
                        html: true,
                        placement: "right",
                        template: '<div class="popover" role="tooltip">' +
                        '<div class="arrow"></div>' +
                        '<div class="popover-content"></div></div>',
                        trigger: "manual"
                    })
                )
            );
}

function createColumn(contextInfo) {

    var isFLU = isFinishedLearningUnit(contextInfo);

    var _getColumnOptionsContent = function (contextInfo) {

        var timelineColumnOptionsContent = $("<div>").addClass("popover-column-options")
            .append($("<span>").addClass("btn btn-sm fui-eye-blocked").attr("title", infoTexts.ignoreAll))
            .append($("<span>").addClass("btn btn-sm fui-trash").attr("title", "Alle dieser Werte löschen"));

        if (!isFLU && (contextInfo.hasMultiplicity() || contextInfo.getParameters().length > 0))
            timelineColumnOptionsContent
                .append($("<span>").addClass("btn btn-sm fui-plus").attr("title", "Neue Spalte einfügen"))
                .append($("<span>").addClass("btn btn-sm fui-minus").attr("title", "Spalte löschen"));

        return timelineColumnOptionsContent;
    };

    var html = formatUnitIcons(contextInfo);

    var headerElement = $(".timeline-header");
    $(headerElement)
        .append($("<th>")
            .html(html)
            .attr("title", contextInfo.getTranslatedID())
            .tooltip({
                container: "body",
                placement: "top"
            })
            .popover({
                container: "body",
                content: _getColumnOptionsContent(contextInfo),
                delay: { show: 100, hide: 300 },
                html: true,
                placement: "bottom",
                template: '<div class="popover" role="tooltip">' +
                //'<div class="arrow popover-column"></div>' +   // doesn't look pretty --> bootstrap's mistake
                '<div class="popover-content"></div></div>'
            })
        );


    if (isFLU)
        $(headerElement).append( $("<td>").addClass("timeline-cell-buffer") );


    // add one column for each context item
    $(".timeline-step").each(function() {
        $(this)
            .append( $("<td>").addClass("timeline-cell")
                .attr("contextClass", contextInfo.getClasses()[0])
                .tooltip(getContextTooltipOptions(getContextUnknownTooltipTitle(contextInfo)))
            );
        if (isFLU)
            $(this).append( $("<td>").addClass("timeline-cell-buffer") );
    });
}



function highlightCurrentSituation(simulation) {

    var timeline = simulation.getTimeline();

    var selectedStep = timeline.getSelectedStep();
    var isSimulating = simulation.getStatus() != STOPPED;

    // highlight selected step if simulation is running or paused
    if (isSimulating)
        highlightStep(selectedStep);
    else
        removeStepHighlighting();

    if (selectedStep == timeline.getNumberOfSituations()) return;

    var selectedStepElement = $(".selected-step");

    // add line indicator (little arrow)
    markSelectedStepAsSimulated();

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
    $("tr.timeline-step").each(function(step){
        if (step == stepIndex)
            $(this).addClass("selected-step");
        else $(this).removeClass("selected-step");
    });
}

function removeStepHighlighting() {
    $(".selected-step").removeClass("selected-step");
    removeStepSimulationMarkup();
}

function markSelectedStepAsSimulated() {
    removeStepSimulationMarkup();
    $(".selected-step").addClass("simulated-situation");
}

function removeStepSimulationMarkup() {
    $(".simulated-situation").removeClass("simulated-situation");
}


function getColumnCells(colIndex) {
    var cells = $();
    $(".timeline-step").each(function (index, step) {
        cells = cells.add($(step).children(".timeline-cell").eq(colIndex))
    });
    return cells;
}



/*** tiny little helper functions ***/

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
    $(".finished-units").removeClass("finished-units");
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

/**
 * Re-initializes all tooltips with given options (if any exist).
 */
function activateTimelineTooltips () {
    $(".timeline-cell").each(function (index, element) {
        var tooltip = $(element).data("bs.tooltip");
        if (tooltip)
            $(element).tooltip(tooltip.options);
    });
}

function getContextUnknownTooltipTitle(contextInfo) {
    // "Nutzer hat noch keine Lerneinheit abgeschlossen"
    return (isFinishedLearningUnit(contextInfo) ? infoTexts.noFLU :
        // "<CONTEXT NAME> ist unbekannt"
        contextInfo.getTranslatedID() + infoTexts.unknownValue);
}

function getContextTooltipOptions (title) {
    return {
        animation: true,
        container: "body",
        html: true,
        placement: "auto top",
        title: title
    };
}



// inspired by: http://stackoverflow.com/questions/15989591/how-can-i-keep-bootstrap-popover-alive-while-the-popover-is-being-hovered
function handlePopoverElementMouseenter(e) {
    var element = $(e.target).closest("th, td");
    $(element).popover("show");

    $(".popover").on("mouseleave", function () {
        $(element).popover("hide");
    });
}
function handlePopoverElementMouseleave(e) {
    var element = $(e.target).closest("th, td");

    setTimeout(function () {
        if (!$(".popover:hover").length) {
            $(element).popover("hide");
        }
    }, 300);
}