/**
 * Created by Helena on 29.12.2015.
 *
 * Adding of events inspired by:
 * http://stackoverflow.com/questions/10591747/making-a-google-calendar-like-dragging-interface
 *
 */

var numberOfSteps = 100;
var down, dragging, moving; // Boolean: mouse down?, mouse down and moving?
var xOnMousedown, yOnMousedown; // click coordinates (in px)
var xFirstCellLeft, yFirstCellTop; //  coordinates of clicked cell (in px)
var horizontalBorderPx = 2; // a marked cell's top and bottom border sum in px
var verticalBorderPx = 4;  // a marked cell's left and right border sum in px


/**
 * Initialize timeline
 */
function initTimeline(simulation) {

    simulation.initTimeline(numberOfSteps);

    simulation.renderTimeline();

    // set event handlers for these generated cells
    setCellEventHandlers(simulation);
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
                    .attr("title", "Schritt " + i.toString())
            ));
}

function createColumn(contextInfo) {

    $(".timeline-header").append($("<th>")
        .html(formatUnitIcons(contextInfo))
        .tooltip({
            animation: false,
            container: "#tab5",
            placement: "auto left",
            viewport: "#timelineContainer"
        }));

    // add one column for each context item
    $(".timeline-step").each(function() {
        $(this).append($("<td>")
                .addClass("timeline-cell")
                .attr("contextClass", contextInfo.getClasses()[0])
                .tooltip({
                    animation: false,
                    container: "#tab5",
                    placement: "auto top",
                    title: translate_contextInformation(contextInfo.getID()) + " hat keinen Wert",
                    viewport: "#timelineContainer"
                })
        );
    });
}


function highlightSelectedStep(selectedStep) {
    $("#timelineTable tbody tr.timeline-step").each(function(step){
        if (step == selectedStep)
            $(this).addClass("selected-step");
        else $(this).removeClass("selected-step");
    });
}


/********** event handling **********/


/** *
 * Sets handlers for mouse events on table cells and on document, consequently
 */
function setCellEventHandlers(simulation) {

    $(document).on("mousedown", ".timeline-cell", simulation, _handleMousedown);
    $(document).on("mousemove", _handleMousemove);
    $(document).on("mouseup", null, simulation, _handleMouseup);
}


/**
 * Triggered if the user clicks on a cell: sets down to true and records click coordinates.
 *
 * @param event
 * @private
 */
function _handleMousedown(event) {
    hideAllPopovers(event.data.getTimeline());

    if ($(event.target).hasClass("timeline-cell-occupied")) return;

    down = true;

    yOnMousedown = event.pageY;
    xOnMousedown = event.pageX;
    xFirstCellLeft = $(this).offset().left;
    yFirstCellTop = $(this).offset().top;

}

/**
 * If a cell has been clicked, all cells where the mouse is dragged over will be marked.
 *
 * @param event The mousemove event. Not restricted to cells because cursor may leave the table.
 * @private
 */
function _handleMousemove(event) {
    event.preventDefault();

    if (down) {
        dragging = true;
        _mark(event);
    }
}

/**
 * When down stops: create a new DIV where cells have been marked and attach context CRUD functionality.
 *
 * @param event The mouseup event. Can occur anywhere in the document.
 * @private
 */
function _handleMouseup(event) {

    // if the mouse has been down on an empty cell
    if (down) {

        // if a single cell was clicked, without dragging, mark it (for subsequent access)
        if (!dragging)
            _mark(event);

        createNewContextEvent(event.data);
    }

    down = false;
    dragging = false;
}


/**
 * Goes through all cells and marks those that were selected, restricted to the column clicked.
 *
 * @param event The mousemove or mouseup event (only triggered after mousedown on a cell).
 * @private
 */
function _mark(event) {

    $(".timeline-cell").each(function () {
        var top = $(this).offset().top;
        var bottom = top + $(this).height()+horizontalBorderPx;
        var left = $(this).offset().left;
        var right = left + $(this).width()+verticalBorderPx;

        if( bottom > yOnMousedown && event.pageY >= top && xOnMousedown >= left && xOnMousedown < right) {
            $(this).addClass( "timeline-cell-marked" );
        }
        else
            $(this).removeClass( "timeline-cell-marked" );
    });
}


function getColIDOfCell(cell) {
    return $(cell).parent().children(".timeline-cell").index(cell);
}

function getRowIDOfCell(cell) {
    return $(cell).parent().index();
}


function addOccupiedMarkup (cells) {
    $(cells).addClass("timeline-cell-occupied");

    var firstCell = $(cells).first().css("border-top", "1px solid");

    /* var quickEdit = $("<a>").attr("href","#").addClass("fui-gear")
     .on("click", function(event) {event.stopPropagation();});
     firstCell.append(quickEdit);
     quickEdit.popover({
     content: createContextEventCopyDOM,
     placement: "auto top",
     selector: firstCell,
     viewport: "#timelineTable"
     });*/

    $(cells).last().css("border-bottom", "1px solid")
        .append($("<div>").addClass("occupied-resize-handle"));
}


function unmarkAllCells() {
    $(".timeline-cell-marked").removeClass("timeline-cell-marked");
}

function freeAllCells() {
    $(".timeline-cell-occupied").removeClass(".timeline-cell-occupied");
}


function hideAllPopovers(timeline) {

    // triggers "hide.bs.popover" event handled by removing all markup
    $(".popover").hide();

    // remove all non-confirmed events
    removeTemporaryEvents(timeline);
}


function removeTemporaryEvents(timeline) {

    // remove all non-confirmed events
    var markedCells = $(".timeline-cell-marked");
    if ($(markedCells).length != 0) {
        var startCell = $(markedCells).first();

        var contextEvent = timeline.getEventAt(getRowIDOfCell(startCell), getColIDOfCell(startCell));
        timeline.removeEvent(contextEvent);

        $(markedCells).popover("destroy");
    }
}


function removeAllPopovers(timeline) {

    hideAllPopovers(timeline);

    $(".timeline-cell-occupied").popover("destroy");

    freeAllCells();
}