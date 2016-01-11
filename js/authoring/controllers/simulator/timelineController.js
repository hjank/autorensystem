/**
 * Created by Helena on 29.12.2015.
 *
 * Adding of events inspired by:
 * http://stackoverflow.com/questions/10591747/making-a-google-calendar-like-dragging-interface
 *
 */


var down, dragging, moving; // Boolean: mouse down?, mouse down and moving?
var xOnMousedown, yOnMousedown; // click coordinates (in px)
var xFirstCellLeft, yFirstCellTop; //  coordinates of clicked cell (in px)
var horizontalBorderPx = 2; // a marked cell's top and bottom border sum in px
var verticalBorderPx = 4;  // a marked cell's left and right border sum in px


/**
 * Create one column per (unique) context item
 * @param contextInfoList An array containing all context items (incl. duplicates) added in the author system
 */
function createColumns(contextInfoList) {
    // in case no context has been added to any unit in the scenario yet
    if (typeof contextInfoList == "undefined")
        contextInfoList = contextList.getItems();

    for (var i in contextInfoList) {
        $(".timelineHeader").append($("<th>").html(formatUnitIcons(contextInfoList[i])));

        // add one column for each context item
        $(".timelineStep").each(function() {
            var newCell = $("<td>").addClass("timelineCell");
            $(this).append(newCell);
        });
    }
}


/** *
 * Sets handlers for mouse events on table cells and on document, consequently
 */
function setCellEventHandlers() {

    $(".timelineCell").on("mousedown", _mousedown);
    $(document).mousemove(_mousemove);
    $(document).mouseup(_mouseup);

   // $(".timelineCellOccupied").on("click", _mouseenter);
}



/**
 * Triggered if the user clicks on a cell: sets down to true and records click coordinates.
 *
 * @param event
 * @private
 */
function _mousedown(event) {
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
function _mousemove(event) {
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
function _mouseup(event) {
    event.preventDefault();

    // if the mouse has been down, and is now released (could there be any other case, actually?)
    if (down) {
        // if a single cell was clicked, without dragging, mark it (for subsequent access)
        if (!dragging)
            _mark(event);

        _createNewEvent();
    }

    down = false;
    dragging = false;



    $(".closePopover").on("click", function(){
        $(this).parent().parent().popover("hide");
    });
}


/**
 * 1. Change class of selected cells from marked to occupied.
 * 2. Create a popover for adding/editing/deleting a context "event"
 *
 * @private
 */
function _createNewEvent () {
    // keep track of selected cells
    var markedCells = $('.timelineCellMarked');
    // editor popover will be attached to first cell
    var startCell = $(markedCells).first();
    // count how many cells have been selected
    var occupiedCount = $(markedCells).length;

    // remove old, add new class
    $('.timelineCellMarked').each(function() {
        $(this).removeClass('timelineCellMarked');
        $(this).addClass('timelineCellOccupied');
    });

    // create a context editor popover for each selected cell
    $(markedCells).popover({
        container: 'body',
        content: "test",
        html: true,
        placement: "auto bottom",
        template: '<div class="popover" role="tooltip">' +
        '<div class="arrow"></div>' +
        '<h3 class="popover-title"></h3>' +
        '<div class="popover-content"></div>' +
        '</div>',
        title: function(){
            return "Kontextinformation " + '<button class="closePopover">X</button>';},
        viewport: "#tab5"
    });

    // if no dragging happened, click event will be fired and opens popover (or closes open popover)
    if (dragging && occupiedCount > 1)
        $(startCell).popover("show");

}


/**
 * Goes through all cells and marks those that were selected, restricted to the column clicked.
 *
 * @param event The mousemove or mouseup event (only triggered after mousedown on a cell).
 * @private
 */
function _mark(event) {

    $('.timelineCell').each(function () {
        var top = $(this).offset().top;
        var bottom = top + $(this).height()+horizontalBorderPx;
        var left = $(this).offset().left;
        var right = left + $(this).width()+verticalBorderPx;

        if( bottom > yOnMousedown && event.pageY >= top && xOnMousedown >= left && xOnMousedown < right)
            $(this).addClass( 'timelineCellMarked' );
        else
            $(this).removeClass( 'timelineCellMarked' );
    });
}

/**
 * Removes the markup from all cells.
 *
 * @private
 */
function _unmark() {
    $('.timelineCell').each(function () {
        $(this).removeClass( 'timelineCellMarked' );
    });
}

/**
 * Returns the Y coordinate of the element's bottom.
 *
 * @param element The DOM element whose bottom is searched.
 * @returns {*} A number representing the y coordinate (in px).
 * @private
 */
function _bottom(element){
    return $(element).offset().top + $(element).height()+horizontalBorderPx;
}

/**
 *
 * @returns {number} The height of the selected, i.e. marked area in px
 * @private
 */
function _getHeight(event) {
    // if a single cell was clicked, without dragging, mark it (to access it afterwards)
    if (!dragging)
        _mark(event);

    // get the y coordinate of the lowest selected cell's bottom
    var yEnd = 0;
    $('.timelineCellMarked').each(function() {
        var y = _bottom(this);
        yEnd = y > yEnd ? y : yEnd;
    });

    // calculate the distance between start and end y coordinates, i.e. height of the marked area
    return yEnd - yFirstCellTop;
}