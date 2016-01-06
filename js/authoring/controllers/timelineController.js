/**
 * Created by Helena on 29.12.2015.
 *
 * Adding of events inspired by:
 * http://stackoverflow.com/questions/10591747/making-a-google-calendar-like-dragging-interface
 *
 */


var down, dragging; // Boolean: mouse down?, mouse down and moving?
var xOnMousedown, yOnMousedown; // click coordinates (in px)
var xFirstCellLeft, yFirstCellTop; //  coordinates of clicked cell (in px)
var horizontalBorderPx = 2; // a marked cell's top and bottom border sum in px
var verticalBorderPx = 4;  // a marked cell's left and right border sum in px

/**
 * Initialize timeline
 */
$(function() {

    // get the list of all contextInformation items that were added in the author system
    var contextList = new ContextInfoList();
    $.get("data.json", function(data) {
        // and convert all items to their proper model type: ContextInformation (incl. Parameter)
        contextList.fromJSON(data);

        // create a column for each ContextInformation object
        createColumns(contextList.getItems());

        // set event handlers for these generated cells
        setCellEventHandlers();
    });

});


/**
 * Create one column per (unique) context item
 * @param contextList An array containing all context items (incl. duplicates) added in the author system
 */
function createColumns(contextList) {
    // functions as a set of unique context item IDs
    var itemIDList = [];
    // iterate through all context items
    for (var i in contextList) {
        var contextItemID = contextList[i].getID();

        // ensure IDs are unique (no duplicates)
        if (itemIDList.indexOf(contextItemID) == -1) {
            itemIDList.push(contextItemID);

            // add one column for each unique item
            $(".timelineStep").each(function() {
                var newCell = $("<td>")
                    .addClass("timelineCell")
                    .attr("contextID", contextItemID);
                $(this).append(newCell);
            });
        }
    }
}


/** *
 * Sets handlers for mouse events on table cells and on document, consequently
 */
function setCellEventHandlers() {

    $(".timelineCell").on("mousedown", _mousedown);
    $(document).mousemove(_mousemove);
    $(document).mouseup(_mouseup);

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
    xFirstCellLeft = $(this).position().left;
    yFirstCellTop = $(this).position().top;
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

    // if the mouse has been down, and is now released
    if (down) {
        // get height of marked area
        var height = _getHeight();

        // prevent erroneous behavior when cursor is dragged beyond top
        if (event.pageY > yFirstCellTop) {

            // create and add the draggable, resizable information container
            var eventDiv = _createEventDiv(height);
            var popoverDiv = _createPopover();

            // TODO: just a mock-up for now, will be replaced by formatting in author system
            var contextColor = "#"+((1<<24)*Math.random()|0).toString(16);
            eventDiv.css("background-color", contextColor);

            // add new div to timeline
            $("#timelineContainer").append(eventDiv);
        }
    }

    down = false;
    dragging = false;
    _unmark();
}

/**
 * Creates a new div as interactable for adding, editing, removing, copying, hiding context in the timeline.
 *
 * @param height The height of the div to be created.
 * @returns {*|jQuery} The new div with set style and features: drag, resize, tooltip, popover, quick edit buttons...
 */
function _createEventDiv(height) {
    // get width and height of a cell
    var cellWidth = $(".timelineCell").width() + verticalBorderPx;
    var cellHeight = $(".timelineCell").height() + horizontalBorderPx;

    // in case no height was provided
    height = height || cellHeight;

    // create a new div with style and functionality
    return $("<div>")
        .addClass("resizableEvent")
        .css("height", height+"px")
        .css("min-height", cellHeight+"px")
        .css("width", cellWidth+"px")
        .css("background-color", "#1ABC9C")
        .css("border", "1px solid gray")
        .css("position", "absolute")
        .css("top", yFirstCellTop+"px")
        .css("left", xFirstCellLeft+"px")
        .resizable({
            handles: "s",
            grid: [cellWidth, cellHeight],
            containment: "table",
            distance: 0,
            resize: function(event, ui) {
                ui.size.height += horizontalBorderPx;
            }
        })
        .draggable({
            grid: [cellWidth, cellHeight],
            axis: "y",
            cursor: "move",
            containment: "table"
        })
        .tooltip({
            hide: false,
            show: false,
            content: "awesome",
            items: ".resizable",
            track: true
        });
}


/**
 * Create a popover for adding/editing/deleting a context "event"
 *
 * @returns {*|jQuery}
 * @private
 */
function _createPopover () {
    return $("<div>").popover(); // TODO
}


/**
 * Goes through all cells and marks those that were selected, restricted to the column clicked.
 *
 * @param event The mousemove or mouseup event (only triggered after mousedown on a cell).
 * @private
 */
function _mark(event) {

    $('.timelineCell').each(function () {
        var top = $(this).position().top;
        var bottom = top + $(this).height()+horizontalBorderPx;
        var left = $(this).position().left;
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
    return $(element).position().top + $(element).height()+horizontalBorderPx;
}

/**
 *
 * @returns {number} The height of the selected, i.e. marked area in px
 * @private
 */
function _getHeight() {
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