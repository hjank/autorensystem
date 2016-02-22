/**
 * Created by Helena on 11.01.2016.
 */


/**
 * 1. Create a popover for adding/editing/deleting a context "event"
 * 2. Change class of selected cells from marked to occupied.
 *
 */
function createNewContextEvent (simulation) {

    // keep track of selected cells
    var markedCells = $(".timeline-cell-marked");
    var numberOfMarkedCells = $(markedCells).length;

    if (numberOfMarkedCells == 0) return;

    // editor popover will be attached to first cell
    var startCell = $(markedCells).first();
    var firstStepID = getRowIDOfCell(startCell);
    var colID = getColIDOfCell(startCell);

    var timeline = simulation.getTimeline();
    var contextEvent = new ContextEvent(
        new ContextInformation().fromJSON(timeline.getColumnContext(colID)),
        colID,
        firstStepID,
        firstStepID + numberOfMarkedCells - 1,
        true
    );
    timeline.addEvent(contextEvent);

    createNewPopover(contextEvent, simulation);

    // editor popover will be attached to first cell
    $(startCell).popover("show");
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
        // destroy temporary popover
        $(markedCells).popover("destroy");
    }
}
