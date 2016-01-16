/**
 * Created by Helena on 11.01.2016.
 */



/**
 * 1. Change class of selected cells from marked to occupied.
 * 2. Create a popover for adding/editing/deleting a context "event"
 *
 */
function createNewEvent () {

    var contextEvent = new ContextEvent();

    // keep track of selected cells
    var markedCells = $('.timelineCellMarked');
    // editor popover will be attached to first cell
    var startCell = $(markedCells).first();
    // count how many cells have been selected
    var occupiedCount = $(markedCells).length;

    var contextInfoID = $(startCell).attr("contextInfo");

    // remove old, add new class
    $('.timelineCellMarked').each(function() {
        $(this).removeClass('timelineCellMarked');
        $(this).addClass('timelineCellOccupied')
            .css("border-top", "1px solid " + getColor(translate_contextClass($(this).attr("contextClass"))));
    });

    // create a context editor popover for each selected cell
    $(markedCells).popover({
        container: 'body',
        content: generatePopoverContent(contextInfoID),
        delay: 100,
        html: true,
        placement: "auto bottom",
        template: '<div class="popover" role="tooltip">' +
        '<div class="arrow"></div>' +
        '<h3 class="popover-title"></h3>' +
        '<div class="popover-content"></div>' +
        '</div>',
        title: generatePopoverTitle(contextInfoID),
        viewport: "#timelineContainer"
    });

    // if no dragging happened, click event will be fired and opens popover (or closes open popover)
    if (dragging && occupiedCount > 1)
        $(startCell).popover("show");
}


/**
 * Generate the content of the newly created popover, i.e. operator, value and parameter selection.
 * @param contextInfoID
 */
function generatePopoverContent (contextInfoID) {
    var simulatedContextInfoMenuContainer = createNamedDOMElement("div", "simulatedContextInfoMenu");
    var simulatedOperatorSelectElement = createNamedDOMElement("select", "simulatedOperatorSelect")
        .addClass("form-control select select-primary select-block mbl")
        .css("display", "block")
        .css("min-width", "235px")
        .css("margin-bottom", "10px")
        .select2("data", {id:"\r",text:"\r"});
    var simulatedValueInput = createNamedDOMElement("input", "popoverInput")
        .addClass("form-control")
        .css("margin-bottom", "10px");
    var simulatedValueSelect = createNamedDOMElement("select", "popoverSelect")
        .addClass("form-control select select-primary select-block mbl")
        .css("display", "block")
        .css("min-width", "235px")
        .css("display", "none")
        .css("margin-bottom", "10px")
        .select2()
        .select2("data", {id:"\r",text:"\r"});
    var confirmButton = createNamedDOMElement("div", "btnConfirmContextEvent")
        .addClass("btn btn-info")
        .css("float", "center")
        .html("<b class='fui-check-circle'></b>Bestätigen</div>");

    simulatedContextInfoMenuContainer.append(simulatedOperatorSelectElement);
    simulatedContextInfoMenuContainer.append(simulatedValueInput);
    simulatedContextInfoMenuContainer.append(simulatedValueSelect);
    simulatedContextInfoMenuContainer.append(confirmButton);

    var contextInfo = simulatedContextList.getItemByID(contextInfoID);
    fillOperatorSelection(contextInfo, simulatedOperatorSelectElement);
    //fillInputField();


    $(document).on('inserted.bs.popover', function () {
        console.log("yay!");
    });

    return simulatedContextInfoMenuContainer;
}

/**
 * Generate the popover's title: the context info's name and an "X" for closing the popover.
 * @param contextInfoID
 * @returns {string}
 */
function generatePopoverTitle (contextInfoID) {
    return translate_contextInformation(contextInfoID)
        + '   <a href="#" title="Schließen" class="closePopover" style="float: right">X</a>';
}
