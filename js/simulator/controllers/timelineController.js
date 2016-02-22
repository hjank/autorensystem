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

    $(".timeline-header").append($("<th>").html(formatUnitIcons(contextInfo))
        .tooltip({
            container: "body",
            placement: "auto left",
            viewport: "#timelineContainer"
        })
        .append($("<div>").addClass("caret").hide()
            .popover({
                container: "body",
                content: getColumnOptions,
                html: true,
                placement: "bottom"
            })
        )
    );

    function getColumnOptions () {
        return $("<div>").addClass("timeline-column-options")
            .append($("<span>").addClass("btn btn-sm fui-plus"))
            .append($("<span>").addClass("btn btn-sm fui-eye-blocked"))
            .append($("<span>").addClass("btn btn-sm fui-trash"));
    }

    // add one column for each context item
    $(".timeline-step").each(function() {
        $(this).append( $("<td>").addClass("timeline-cell")
            .attr("contextClass", contextInfo.getClasses()[0])
            .tooltip({
                container: "#tab5",
                placement: "auto top",
                title: translate_contextInformation(contextInfo.getID()) + " hat keinen Wert",
                viewport: "#timelineContainer"
            })
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



/********** event handling **********/


var mousedownOnEmptyCell, dragging, resizing, moving; // Boolean interaction state indicators
var clickedCell, firstCell;
var nextOccupiedCellTop = 0; // y coordinate of next occupied cell (no-drop area)



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

    // prevent tooltips from getting in the way
    removeAllCellTooltips();

    // resizing a scheduled context event
    if ($(event.target).hasClass("occupied-resize-handle")) {
        resizing = true;

        var contextEvent = timeline.getEventAt(getRowIDOfCell(this), getColIDOfCell(this));
        firstCell = $(getContextEventCells(contextEvent)).first();

        event.stopPropagation();
    }

    // moving a scheduled context event
    else if ($(event.target).hasClass("timeline-cell-occupied")) {
        moving = true;
    }

    // marking cells to add a new context event to schedule
    else if ($(event.target).hasClass("timeline-cell"))
        mousedownOnEmptyCell = true;

    // no other interaction anticipated --> nothing to do here, return
    else return;


    // clicked ".timeline-cell": marking -> start; resizing -> end; moving -> any
    clickedCell = this;
    nextOccupiedCellTop = 0;
}

/**
 * If a cell has been clicked, all cells where the mouse is dragged over will be marked.
 *
 * @param event The mousemove event. Not restricted to cells because cursor may leave the table.
 * @private
 */
function _handleMousemove(event) {
    // prevent marking of label cells
    event.preventDefault();

    if (!(mousedownOnEmptyCell || resizing || moving)) return;

    // else

    dragging = true;


    // mark targeted cells if creating or resizing an event
    _mark(event);
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
    if ((mousedownOnEmptyCell || resizing) && !dragging)
        _mark(event);


    // create new context event in formerly empty cells
    if (mousedownOnEmptyCell) {
        createNewContextEvent(simulation);
    }

    // or resize context event
    else if (resizing) {
        var markedCells = $(".timeline-cell-marked");
        $(clickedCell).empty();

        var timeline = simulation.getTimeline();
        var contextEvent = timeline.getEventAt(getRowIDOfCell(firstCell), getColIDOfCell(firstCell));
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

    $(".timeline-cell").css("cursor", "");
}


/**
 * Goes through all cells and marks those that were selected, restricted to the column clicked.
 * (inspired by: http://stackoverflow.com/questions/10591747/making-a-google-calendar-like-dragging-interface)
 *
 * @param event The mousemove or mouseup event (only triggered after mousedown on a cell).
 * @private
 */
function _mark(event) {


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


    /*** get reference coordinates ***/

    var referenceX, referenceY;
    if (mousedownOnEmptyCell) {
        referenceX = getLeft(clickedCell);
        referenceY = getTop(clickedCell);
    }
    else if (resizing) {
        referenceX = getLeft(firstCell);
        referenceY = getTop(firstCell);
    }

    // get currently targeted cell
    var targetedCell = $(event.target).closest(".timeline-cell");


    /*** cursor style and "error-30"-handling ***/


    // detect downward collision
    if (!nextOccupiedCellTop && (event.pageY > getBottom(clickedCell))) {
        // if targeted cell is already occupied by another event, get its top Y coordinate
        if ($(targetedCell).hasClass("timeline-cell-occupied"))
            nextOccupiedCellTop = getTop(targetedCell);
    }

    // prevent dragging into no-drop area, i.e. :
    if ((event.pageY <= referenceY) // above drag start
        || (getLeft(clickedCell) != getLeft(targetedCell)) // or out of column
        || (nextOccupiedCellTop && (event.pageY >= nextOccupiedCellTop))) // or over the next occupied cell
    {
        $(".timeline-cell").css("cursor", "no-drop");
        return;
    }
    else if (resizing)
        $(".timeline-cell").css("cursor", "s-resize");
    else
        $(".timeline-cell").css("cursor", "");



    /*** mark selected cells ***/

    $(getColumnCells(getColIDOfCell(clickedCell))).each(function () {

        // mark this cell if it's below drag start cell top, and the cursor has crossed its top
        if((referenceY + 3 < getBottom(this)) && (getTop(this) <= event.pageY))
        {
            $(this).removeClass("timeline-cell-occupied");
            $(this).addClass("timeline-cell-marked");
        }
        else
            $(this).removeClass("timeline-cell-marked");
    });
}




function _handleLabelClick(event) {
    var timeline = event.data.getTimeline();

    timeline.setSelectedStep(getRowIDOfCell(this));
    highlightSelectedStep(timeline);

    event.stopPropagation();
}


function _handleColumnHeaderEnter(event) {
    $(this).css("border", "1px solid grey").children("div.caret").show();
    var colIndex = $(this).parent().children().not(".timeline-step-label").index(this);

    getColumnCells(colIndex).css({"background-image": "repeating-linear-gradient(rgba(0,0,0,.3), rgba(0,0,0,.3))"});
}

function _handleColumnHeaderLeave(event) {
    $(this).css("border", "").children("div.caret").hide();
    $(".timeline-cell").css("background-image", "");
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