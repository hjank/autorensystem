/**
 * Created by Helena on 11.01.2016.
 */


/**
 * 1. Change class of selected cells from marked to occupied.
 * 2. Create a popover for adding/editing/deleting a context "event"
 *
 */
function createNewEvent (timeline) {

    // keep track of selected cells
    var markedCells = $('.timelineCellMarked');
    // editor popover will be attached to first cell
    var startCell = $(markedCells).first();
    // count how many cells have been selected
    var occupiedCount = $(markedCells).length;

    var firstStepID = $(startCell).parent().index();
    var colID = $(startCell).parent().children(".timelineCell").index(startCell);

    var column = timeline.getColumns()[colID];
    var contextInfo = column.getContextInfo();

    var contextEvent = new ContextEvent(timeline.getSimulation(),
        contextInfo,
        colID,
        firstStepID,
        firstStepID+occupiedCount-1,
        true);
    contextEvent.render(createNewPopover);

    timeline.addEvent(contextEvent);

}

function createNewPopover(contextEvent) {

    hideAllPopovers();

    // keep track of selected cells
    var markedCells = $('.timelineCellMarked');
    // editor popover will be attached to first cell
    var startCell = $(markedCells).first();
    // count how many cells have been selected
    var occupiedCount = $(markedCells).length;

    // create a context editor popover for each selected cell
    $(markedCells)
        .popover({
            container: "#tab5",
            content: generatePopoverContent(contextEvent),
            html: true,
            placement: "auto top",
            selector: markedCells,
            template: '<div class="popover" role="tooltip">' +
            '<div class="arrow"></div>' +
            '<h3 class="popover-title"></h3>' +
            '<div class="popover-content"></div>' +
            '</div>',
            title: generatePopoverTitle(contextEvent.getContextInfo()),
            viewport: "#timelineContainer"
        })
        .on("shown.bs.popover", function(){
            setPopoverEventHandlers(this);
            if (!$(this).hasClass("timelineCellOccupied")) $("select").select2();
        })
        .on("hide.bs.popover", function() {
            unmarkAllCells();
        })
        .tooltip("destroy");


    // if no dragging happened, click event will be fired and opens popover (or closes open popover)
    if (dragging && occupiedCount > 1) {
        $(startCell).popover("show");
    }
}

/**
 * Generate the content of the newly created popover, i.e. operator, value and parameter selection.
 * @param contextEvent
 */
function generatePopoverContent (contextEvent) {

    var contextInfo = contextEvent.getContextInfo();
    var eventUUID = contextEvent.getUUID();

    var simulatedContextInfoMenuContainer = createNamedDOMElement("div", "simulatedContextInfoMenu"+eventUUID);
    var simulatedOperatorSelectElement = createNamedDOMElement("select", "simulatedOperatorSelect"+eventUUID)
        .addClass("form-control select select-primary select-block mbl")
        .css("display", "block")
        .css("min-width", "235px")
        .css("margin-bottom", "10px")
        .select2("data", {id:"\r",text:"\r"});
    var simulatedValueInput = createNamedDOMElement("input", "popoverInput"+eventUUID)
        .addClass("form-control")
        .css("margin-bottom", "10px");
    var simulatedValueSelect = createNamedDOMElement("select", "popoverSelect"+eventUUID)
        .addClass("form-control select select-primary select-block mbl")
        .css("display", "block")
        .css("min-width", "235px")
        .css("display", "none")
        .css("margin-bottom", "10px")
        .select2()
        .select2("data", {id:"\r",text:"\r"});
    var confirmButton = createNamedDOMElement("div", "btnPopoverConfirm"+eventUUID)
        .addClass("btn btn-info confirmPopover")
        .css("float", "center")
        .html("<b class='fui-check-circle'></b>Bestätigen</div>");

    simulatedContextInfoMenuContainer.append(simulatedOperatorSelectElement);
    simulatedContextInfoMenuContainer.append(simulatedValueInput);
    simulatedContextInfoMenuContainer.append(simulatedValueSelect);
    simulatedContextInfoMenuContainer.append(confirmButton);

    fillOperatorSelection(contextInfo, simulatedOperatorSelectElement);
    //fillInputField();


    return simulatedContextInfoMenuContainer;
}

/**
 * Generate the popover's title: the context info's name and an "X" for closing the popover.
 * @param contextInfo
 * @returns {string}
 */
function generatePopoverTitle (contextInfo) {
    return (translate_contextInformation(contextInfo.getID())
        + '<a href="#" title="Schließen" class="closePopover" style="float: right">X</a>');
}



function hideAllPopovers() {
    $(".popover").hide();
}


function setPopoverEventHandlers(cell) {

    var confirmed = false;

    $(".closePopover").on("click", function(){
        $(cell).popover("hide");

        // closing popover without input + confirm, i.e. aborting event creation
        if ( !($(this).hasClass("timelineCellOccupied") || confirmed) ) {
            $(cell).popover("destroy");
        }

    });

    $(".confirmPopover").on("click", function(){
        confirmed = true;

        // add new class
        $(".timelineCellMarked").each(function() {
            $(this).addClass('timelineCellOccupied');
        });

        // triggers unmarking of all cells
        $(cell).popover("hide");

    });

}