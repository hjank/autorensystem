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
 * Initialize timeline
 */
function initTimeline(simulation) {

    var timeline = new Timeline();
    timeline.setSimulation(simulation);

    // init the simulation editor timeline
    // 1. fetch and append html
    $.get( "js/simulator/view/simulator.html", function( data ) {
        $( "#tab5" ).html( data );

        // create a column for each ContextInformation object
        createColumns(timeline);

        // set event handlers for these generated cells
        setCellEventHandlers(timeline);

    });
}

/**
 * Create one column per (unique) context item
 */
function createColumns(timeline) {

    var simulatedContextList = timeline.getSimulation().getSimulatedContextList();

    for (var i in simulatedContextList.getItems()) {
        var contextInfo = simulatedContextList.getItem(i);
        timeline.addColumn(new SimulationColumn(i, contextInfo, [], timeline.getSimulation()));

        $(".timelineHeader").append($("<th>").html(formatUnitIcons(contextInfo)));


        // add one column for each context item
        var steps = timeline.getSteps();
        $(".timelineStep").each(function() {
            var index = $(this).index();
            if (!steps[index])
                timeline.addStep(new SimulationStep(index, [], timeline.getSimulation(), false));


            var newCell = $("<td>").addClass("timelineCell timelineCellEmpty")
                .attr("contextClass", contextInfo.getClasses()[0])
                .tooltip({
                    animation: false,
                    container: "body",
                    placement: "auto left",
                    selector: ".timelineCellEmpty",
                    title: "kein Wert",
                    viewport: "#timelineContainer"
                });
            $(this).append(newCell);
        });
    }
}


/** *
 * Sets handlers for mouse events on table cells and on document, consequently
 */
function setCellEventHandlers(timeline) {

    $(".timelineCell").on("mousedown", _handleMousedown);
    $(document).mousemove(_handleMousemove);
    $(document).mouseup(function (event) {
        _handleMouseup(event, timeline);
    });

}



/**
 * Triggered if the user clicks on a cell: sets down to true and records click coordinates.
 *
 * @param event
 * @private
 */
function _handleMousedown(event) {
    if ($(event.target).hasClass("timelineCellOccupied")) return;

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
function _handleMouseup(event, timeline) {

    // if the mouse has been down, and is now released (could there be any other case, actually?)
    if (down) {
        // if a single cell was clicked, without dragging, mark it (for subsequent access)
        if (!dragging)
            _mark(event);

        createNewEvent(timeline);
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

    $('.timelineCell').each(function () {
        var top = $(this).offset().top;
        var bottom = top + $(this).height()+horizontalBorderPx;
        var left = $(this).offset().left;
        var right = left + $(this).width()+verticalBorderPx;

        if( bottom > yOnMousedown && event.pageY >= top && xOnMousedown >= left && xOnMousedown < right) {
            $(this).addClass( 'timelineCellMarked' )
                .css("background-color", getColor(translate_contextClass($(this).attr("contextClass"))));
        }
        else
            $(this).removeClass( 'timelineCellMarked' );
    });
}


function unmarkAllCells() {
    var markedCells = $(".timelineCellMarked");
    var countMarked = markedCells.length;

    $(markedCells).each(function (index) {
        $(this).removeClass("timelineCellMarked");

        // after confirming popover input
        if ($(this).hasClass("timelineCellOccupied")) {
            // first cell
            if (index == 0)
                $(this).css("border-top", "solid");
            // last cell
            if (index == countMarked-1)
                $(this).css("border-bottom", "solid");
            else
                $(this).css("border-style", "none solid none");
        }
        // closing popover without input + confirm, i.e. aborting
        else
            $(this).css("background-color", "");
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