/**
 * Created by Helena on 23.02.2016.
 */



/********** event handling **********/


var mousedownOnEmptyCell, dragging, resizing, moving; // Boolean interaction state indicators
var clickedCell; // needed for both creating and resizing events
var firstCell; // needed for resizing and moving
var originalEventCells, clickedCellIndex; // needed for moving
var nextOccupiedCellTop = 0; // y coordinate of next occupied cell (no-drop area)




/**
 * Triggered if the user clicks on a cell: sets down to true and records click coordinates.
 *
 * @param e
 *
 */
function handleMousedown(e) {

    var timeline = e.data.getTimeline();

    hideAllPopovers();

    // delegate target is an occupied cell
    if ($(this).hasClass("timeline-cell-occupied")) {

        var contextEvent = timeline.getEventAt(getRowIDOfCell(this), getColIDOfCell(this));
        originalEventCells = getContextEventCells(contextEvent);
        firstCell = $(originalEventCells).first();
        if (expectsLearningUnit(contextEvent.getContextInfo()))
            originalEventCells = firstCell;


        // resizing a scheduled context event
        if ($(e.target).hasClass("occupied-resize-handle")) {
            resizing = true;
        }

        // moving a scheduled context event
        else if ($(e.target).is(this)) {
            moving = true;
            clickedCellIndex = $(originalEventCells).index(this);

            $(this).css("cursor", "move");
        }
    }

    // marking cells to add a new context event to schedule
    else if ($(e.target).hasClass("timeline-cell"))
        mousedownOnEmptyCell = true;

    // no other interaction anticipated --> nothing to do here, return
    else return;


    // clicked ".timeline-cell": marking -> start; resizing -> end; moving -> any in-between
    clickedCell = this;
    nextOccupiedCellTop = 0;


    // prevent tooltips from getting in the way
    if (resizing || moving)
        removeAllCellTooltips();
}



/**
 * If a cell has been clicked, all cells where the mouse is dragged over will be marked.
 *
 * @param e The mousemove event. Not restricted to cells because cursor may leave the table.
 *
 */
function handleMousemove(e) {

    // handle only marking, resizing, moving
    if (!(mousedownOnEmptyCell || resizing || moving)) return;


    /*** else: ***/

    // prevent marking of label cells
    e.preventDefault();

    dragging = true;


    /*** get reference coordinates ***/

    var referenceY;
    if (mousedownOnEmptyCell)
        referenceY = getTop(clickedCell);
    else if (resizing)
        referenceY = getTop(firstCell);

    // get currently targeted cell
    var targetedCell = $(e.target).closest(".timeline-cell");
    var targetIsNoCell = ($(targetedCell).length == 0);


    // detect any collision for moving entire event via drag and drop
    var dropAllowed = true;
    if (moving) {
        // only try drag and drop if mouse is over timeline cell
        if (!targetIsNoCell) {
            var rowIndex = getRowIDOfCell(targetedCell);
            var colIndex = getColIDOfCell(targetedCell);

            var eventCells = $();
            for (var i = 0; i < $(originalEventCells).length && dropAllowed; i++) {
                var newRowIndex = rowIndex + i - clickedCellIndex;
                var eventCell = getCellAt(newRowIndex, colIndex);
                eventCells = eventCells.add(eventCell);

                dropAllowed = (newRowIndex >= 0 &&
                ($(originalEventCells).index(eventCell) >= 0 || !$(eventCell).hasClass("timeline-cell-occupied")));
            }

            if (dropAllowed && originalEventCells.length == eventCells.filter(".timeline-cell").length)
                originalEventCells = eventCells;
        }
    }


    /*** cursor style and "error-30"-handling ***/

    // detect downward collision
    if (!nextOccupiedCellTop && (e.pageY > getBottom(clickedCell))) {
        // if targeted cell is already occupied by another event, get its top Y coordinate
        if ($(targetedCell).hasClass("timeline-cell-occupied"))
            nextOccupiedCellTop = getTop(targetedCell);
    }


    // prevent dragging into no-drop area, i.e. :
    if (targetIsNoCell // into anything that is no timeline cell
        || (moving && !dropAllowed) // or out of table bounds or into occupied cells when moving
        || (!moving && e.pageY <= referenceY) // or above drag start
        || (getLeft(clickedCell) != getLeft(targetedCell)) // or out of column
        || (!moving && nextOccupiedCellTop && (e.pageY >= nextOccupiedCellTop - 3))) // or over the next occupied cell
    {
        $("body *").css("cursor", "no-drop");
        return;
    }
    else if (resizing)
        $(".timeline-cell").css("cursor", "s-resize");
    else if (moving)
        $(".timeline-cell").css("cursor", "move");
    else
        $("body *").css("cursor", "");


    // mark targeted cells if creating or resizing an event
    _mark(e, referenceY);
}


/**
 * Goes through all cells and marks those that were selected, restricted to the column clicked.
 * (inspired by: http://stackoverflow.com/questions/10591747/making-a-google-calendar-like-dragging-interface)
 *
 * @param e The mousemove or mouseup event (only triggered after mousedown on a cell).
 *
 */
function _mark(e, referenceY) {

    /*** mark selected cells ***/

    if (mousedownOnEmptyCell || resizing)

        $(getColumnCells(getColIDOfCell(clickedCell))).each(function () {

            // mark this cell if it's below drag start cell top, and the cursor has crossed its top
            if((referenceY + 3 < getBottom(this)) && (getTop(this) <= e.pageY))
                $(this).removeClass("timeline-cell-occupied").addClass("timeline-cell-marked");
            else
                $(this).removeClass("timeline-cell-marked");
        });

    else if (moving) {
        unmarkAllCells();
        originalEventCells.empty().removeClass("timeline-cell-occupied").addClass("timeline-cell-marked");
    }
}



/**
 * When down stops: create a new DIV where cells have been marked and attach context CRUD functionality.
 *
 * @param e The mouseup event. Can occur anywhere in the document.
 */
function handleMouseup(e) {

    /*** "click away" otherwise irritating tooltips and popovers ***/

    hideAllTooltips();
    // since "mouseup" is triggered before "click", all popover showing remains intact
    var popover = $(".popover.in");
    if (popover.length > 0
        && $(e.target).closest(popover.data("bs.popover").$element).length == 0
        && (e.pageX < getLeft(popover) || e.pageX > getRight(popover)
            || e.pageY < getTop(popover) || e.pageY > getBottom(popover))) hideAllPopovers();


    /*** handle timeline cell interaction ***/

    if (mousedownOnEmptyCell || resizing || moving) {

        // if no dragging happened, mark clicked cell (for subsequent access)
        if (!dragging) {
            if (mousedownOnEmptyCell || resizing)
                $(clickedCell).addClass("timeline-cell-marked");
            else
                $(originalEventCells).addClass("timeline-cell-marked");
        }


        var simulation = e.data;

        // create new context event in formerly empty cells
        if (mousedownOnEmptyCell) {
            createNewContextEvent(simulation);
        }

        // or update resized or moved context event
        else /** if (resizing || moving) **/ {
            var markedCells = $(".timeline-cell-marked");

            var timeline = simulation.getTimeline();
            var contextEvent = timeline.getEventAt(getRowIDOfCell(firstCell), getColIDOfCell(firstCell));

            var newStart = getRowIDOfCell(moving ? $(markedCells).first() : firstCell);
            var newEnd = getRowIDOfCell($(markedCells).last());

            updateEventTimeslot(contextEvent, timeline, newStart, newEnd);

            // refresh everything and reload tooltips
            simulation.renderTimeline();
        }
    }


    /*** in any case of mouseup on document ***/

    mousedownOnEmptyCell = false;
    dragging = false;
    resizing = false;
    moving = false;

    $("body *").css("cursor", "");

}




function handleLabelClick(e) {
    var simulation = e.data;
    var status = simulation.getStatus();

    if (status != STOPPED) {

        simulation.pause();

        // point the simulation to selected step
        simulation.getTimeline().setSelectedStep(getRowIDOfCell(this));

        simulation.run();

        // do not restart simulation when it has been paused
        if (status == PAUSED) simulation.pause();
    }

    e.stopPropagation();
}