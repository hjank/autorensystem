/**
 * Created by Helena on 23.02.2016.
 */



/********** event handling **********/


var mousedownOnEmptyCell, dragging, resizing, moving; // Boolean interaction state indicators
var clickedCell; // needed for both creating and resizing events
var nextOccupiedCellTop = 0; // y coordinate of next occupied cell (no-drop area)
var firstCell; // needed for resizing and moving
var originalEventCells, clickedCellIndex; // needed for moving



/**
 * Sets handlers for mouse events on table
 */
var cellEventHandlersSet = false;
function setCellEventHandlers(simulation) {

    if (cellEventHandlersSet) return;

    $(document).on("mousedown", ".timeline-cell", simulation, _handleMousedown);
    $(document).on("mousemove", _handleMousemove);
    $(document).on("mouseup", null, simulation, _handleMouseup);

    $(document).on("click", "td.timeline-step-label", simulation, _handleLabelClick);

    $(document).on("mouseenter", ".timeline-header th:not(.timeline-step-label)", null, _handleColumnHeaderEnter);
    $(document).on("mouseleave", ".timeline-header th:not(.timeline-step-label)", null, _handleColumnHeaderLeave);

    cellEventHandlersSet = true;
}




/**
 * Triggered if the user clicks on a cell: sets down to true and records click coordinates.
 *
 * @param event
 * @private
 */
function _handleMousedown(event) {
    var timeline = event.data.getTimeline();

    hideAllPopovers();

    // delegate target is an occupied cell
    if ($(this).hasClass("timeline-cell-occupied")) {

        // prevent tooltips from getting in the way
        removeAllCellTooltips();

        var contextEvent = timeline.getEventAt(getRowIDOfCell(this), getColIDOfCell(this));
        var contextEventCells = getContextEventCells(contextEvent);
        firstCell = $(contextEventCells).first();

        // resizing a scheduled context event
        if ($(event.target).hasClass("occupied-resize-handle")) {
            resizing = true;
        }

        // moving a scheduled context event
        else if ($(event.target).is(this)) {
            moving = true;

            var contextEvent = timeline.getEventAt(getRowIDOfCell(this), getColIDOfCell(this));
            originalEventCells = getContextEventCells(contextEvent);
            clickedCellIndex = $(originalEventCells).index(this);

            $(this).css("cursor", "move");
        }
    }

    // marking cells to add a new context event to schedule
    else if ($(event.target).hasClass("timeline-cell"))
        mousedownOnEmptyCell = true;

    // no other interaction anticipated --> nothing to do here, return
    else return;


    // clicked ".timeline-cell": marking -> start; resizing -> end; moving -> any in-between
    clickedCell = this;
    nextOccupiedCellTop = 0;

    event.stopPropagation();
}



/**
 * If a cell has been clicked, all cells where the mouse is dragged over will be marked.
 *
 * @param event The mousemove event. Not restricted to cells because cursor may leave the table.
 * @private
 */
function _handleMousemove(event) {

    // handle only marking, resizing, moving
    if (!(mousedownOnEmptyCell || resizing || moving)) return;


    /*** else: ***/

        // prevent marking of label cells
    event.preventDefault();

    dragging = true;


    /*** get reference coordinates ***/

    var referenceY;
    if (mousedownOnEmptyCell)
        referenceY = getTop(clickedCell);
    else if (resizing)
        referenceY = getTop(firstCell);

    // get currently targeted cell
    var targetedCell = $(event.target).closest(".timeline-cell");
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
    if (!nextOccupiedCellTop && (event.pageY > getBottom(clickedCell))) {
        // if targeted cell is already occupied by another event, get its top Y coordinate
        if ($(targetedCell).hasClass("timeline-cell-occupied"))
            nextOccupiedCellTop = getTop(targetedCell);
    }


    // prevent dragging into no-drop area, i.e. :
    if (targetIsNoCell // into anything that is no timeline cell
        || (moving && !dropAllowed) // or out of table bounds or into occupied cells when moving
        || (!moving && event.pageY <= referenceY) // or above drag start
        || (getLeft(clickedCell) != getLeft(targetedCell)) // or out of column
        || (!moving && nextOccupiedCellTop && (event.pageY >= nextOccupiedCellTop - 3))) // or over the next occupied cell
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
    _mark(event, referenceY);
}


/*** tiny little helper (i.e. readability improvement) functions ***/
var getTop = function (cell) {
    return $(cell).offset().top - parseInt($(cell).css("border-top-width"));
};
var getBottom = function (cell) {
    return $(cell).offset().top + $(cell).height() + parseInt($(cell).css("border-bottom-width"));
};
var getLeft = function (cell) {
    return $(cell).offset().left - parseInt($(cell).css("border-left-width"));
};

/**
 * Goes through all cells and marks those that were selected, restricted to the column clicked.
 * (inspired by: http://stackoverflow.com/questions/10591747/making-a-google-calendar-like-dragging-interface)
 *
 * @param event The mousemove or mouseup event (only triggered after mousedown on a cell).
 * @private
 */
function _mark(event, referenceY) {

    /*** mark selected cells ***/

    if (mousedownOnEmptyCell || resizing)

        $(getColumnCells(getColIDOfCell(clickedCell))).each(function () {

            // mark this cell if it's below drag start cell top, and the cursor has crossed its top
            if((referenceY + 3 < getBottom(this)) && (getTop(this) <= event.pageY))
            {
                $(this).removeClass("timeline-cell-occupied").addClass("timeline-cell-marked");
            }
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
 * @param event The mouseup event. Can occur anywhere in the document.
 * @private
 */
function _handleMouseup(event) {
    var simulation = event.data;

    // if no dragging happened, mark clicked cell (for subsequent access)
    if (!dragging) {
        if (mousedownOnEmptyCell || resizing)
            $(clickedCell).addClass("timeline-cell-marked");
        else if (moving)
            $(originalEventCells).addClass("timeline-cell-marked");
    }


    // create new context event in formerly empty cells
    if (mousedownOnEmptyCell) {
        createNewContextEvent(simulation);
    }

    // or resize context event
    else if (resizing || moving) {
        var markedCells = $(".timeline-cell-marked");

        var timeline = simulation.getTimeline();
        var contextEvent = timeline.getEventAt(getRowIDOfCell(firstCell), getColIDOfCell(firstCell));
        if (moving)
            contextEvent.setStart(getRowIDOfCell($(markedCells).first()));
        contextEvent.setEnd(getRowIDOfCell($(markedCells).last()));

        timeline.removeEvent(contextEvent);
        timeline.addEvent(contextEvent);

        // refresh everything and reload tooltips
        simulation.renderTimeline();
    }


    mousedownOnEmptyCell = false;
    dragging = false;
    resizing = false;
    moving = false;

    $("body *").css("cursor", "");
}




function _handleLabelClick(event) {
    var timeline = event.data.getTimeline();

    timeline.setSelectedStep(getRowIDOfCell(this));
    highlightSelectedStep(timeline);

    event.stopPropagation();
}


function _handleColumnHeaderEnter(event) {
    $(this).css("border", "1px solid grey").children("div.timeline-header-options").show();
    var colIndex = $(this).parent().children().not(".timeline-step-label").index(this);

    getColumnCells(colIndex).css({"background-image": "repeating-linear-gradient(rgba(0,0,0,.3), rgba(0,0,0,.3))"});
}

function _handleColumnHeaderLeave(event) {
    $(this).css("border", "").children("div.timeline-header-options").hide();
    $(".timeline-cell").css("background-image", "");
}

