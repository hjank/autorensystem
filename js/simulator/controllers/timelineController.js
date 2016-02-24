/**
 * Created by Helena on 29.12.2015.
 *
 */

/**
 * Initialize timeline
 */
function initTimeline(simulation) {

    simulation.initTimeline(numberOfSteps);
    simulation.renderTimeline();
}




/*********** view **********/


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

    var _getColumnOptions = function (contextInfo) {
        var timelineColumnOptions = $("<div>").addClass("timeline-column-options")
            .append($("<span>").addClass("btn btn-sm fui-eye-blocked")).attr("title", "alle Werte ausblenden")
            .append($("<span>").addClass("btn btn-sm fui-trash")).attr("title", "alle Werte löschen");

        if (contextInfo.getMultiplicity())
            timelineColumnOptions
                .append($("<span>").addClass("btn btn-sm fui-plus")).attr("title", "neue Spalte einfügen")
    };


    $(".timeline-header")
        .append($("<th>")
            .html(formatUnitIcons(contextInfo))
            .append($("<div>").addClass("timeline-header-options")
                .text("...").hide()
                .tooltip(getTopTooltipOptions("Optionen für " + translate_contextInformation(contextInfo.getID())))
                .popover({
                    container: "body",
                    content: _getColumnOptions(contextInfo),
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


function highlightSelectedStep(timeline) {

    $("#timelineTable tbody tr.timeline-step").each(function(step){
        if (step == timeline.getSelectedStep())
            $(this).addClass("selected-step");
        else $(this).removeClass("selected-step");
    });
}


function activateTimelineTooltips () {

    // activate timeline info tooltip
    $("#timelineInfo").tooltip({
        container: "body",
        placement: "auto left"
    });

    // re-initialize all tooltips with given options (if any) or default
    $("#timelineContainer *").each(function (index, element) {
        var tooltip = $(element).data("bs.tooltip");
        $(element).tooltip(tooltip ? tooltip.options : {container: "body"});
    });
}



function getColumnCells(colIndex) {
    var cells = $();
    $(".timeline-step").each(function (index, step) {
        cells = cells.add($(step).children(".timeline-cell").eq(colIndex))
    });
    return cells;
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