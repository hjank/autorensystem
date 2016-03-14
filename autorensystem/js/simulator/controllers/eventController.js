/**
 * Created by Helena on 11.01.2016.
 */


/**
 * 1. Create a popover for adding/editing/deleting a context "event"
 * 2. Change class of selected cells from marked to occupied.
 *
 */
function createNewContextEvent (simulation) {

    var timeline = simulation.getTimeline();

    // keep track of selected cells
    var markedCells = $(".timeline-cell-marked");
    var numberOfMarkedCells = $(markedCells).length;

    if (numberOfMarkedCells == 0) return;

    // editor popover will be attached to first cell
    var startCell = $(markedCells).first();
    var firstStepID = getRowIDOfCell(startCell);
    var lastStepID = firstStepID + numberOfMarkedCells - 1;
    var colID = getColIDOfCell(startCell);


    if (copying && eventClipboard.constructor == ContextEvent && eventClipboard.getColumn() == colID) {
        eventClipboard.setStart(firstStepID);
        eventClipboard.setEnd(lastStepID);

        timeline.addEvent(eventClipboard);
        simulation.renderTimeline();

        copying = false;
        eventClipboard = {};
    }
    else {
        var contextEvent = new ContextEvent(
            "event"+uuid4(),
            new ContextInformation().fromJSON(timeline.getColumnContext(colID)),
            colID,
            firstStepID,
            lastStepID,
            true
        );
        timeline.addEvent(contextEvent);

        createNewPopover(contextEvent, simulation);

        // editor popover will be attached to first cell
        $(startCell).popover("show");
    }
}


function deleteContextEvent (contextEvent, simulation) {
    // make sure to hide popover before destroying it, to save google maps
    hideAllPopovers();

    simulation.getTimeline().removeEvent(contextEvent);
    simulation.renderTimeline();
    //removeOccupiedMarkup(contextEvent);
}


function removeTemporaryEvents(timeline) {

    // remove all non-confirmed events
    var markedCells = $(".timeline-cell-marked");

    if ($(markedCells).length != 0) {
        var startCell = $(markedCells).first();

        var contextEvent = timeline.getEventAt(getRowIDOfCell(startCell), getColIDOfCell(startCell));
        timeline.removeEvent(contextEvent);

        // remove class "timeline-cell-marked" from all cells
        unmarkAllCells();
    }
}

