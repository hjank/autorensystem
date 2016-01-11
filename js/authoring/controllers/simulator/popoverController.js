/**
 * Created by Helena on 11.01.2016.
 */



/**
 * 1. Change class of selected cells from marked to occupied.
 * 2. Create a popover for adding/editing/deleting a context "event"
 *
 */
function createNewEvent () {
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
        content: loadPopoverContent,
        html: true,
        placement: "auto bottom",
        template: '<div class="popover" role="tooltip">' +
        '<div class="arrow"></div>' +
        '<h3 class="popover-title"></h3>' +
        '<div class="popover-content"></div>' +
        '</div>',
        title: function(){
            return "Kontextinformation   " + '<a href="#" class="closePopover">X</a>';},
        viewport: "#tab5"
    });

    // if no dragging happened, click event will be fired and opens popover (or closes open popover)
    if (dragging && occupiedCount > 1)
        $(startCell).popover("show");
}



function loadPopoverContent () {
    showDetailContextInfo();
}
