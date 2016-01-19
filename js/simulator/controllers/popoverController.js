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

    timeline.addEvent(
        new ContextEvent(timeline.getSimulation(), contextInfo, colID, firstStepID, firstStepID+occupiedCount-1, true)
    );


    // remove old, add new class
    $('.timelineCellMarked').each(function() {
        $(this).removeClass('timelineCellMarked');
        $(this).addClass('timelineCellOccupied')
            .css("border-style", "none solid none");
    });


    // create a context editor popover for each selected cell
    $(markedCells).popover({
        container: 'body',
        content: generatePopoverContent(contextInfo),
        html: true,
        placement: "auto top",
        template: '<div class="popover" role="tooltip">' +
        '<div class="arrow"></div>' +
        '<h3 class="popover-title"></h3>' +
        '<div class="popover-content"></div>' +
        '</div>',
        title: generatePopoverTitle(contextInfo),
        viewport: "#timelineContainer"
    })
        .tooltip("destroy");


    // if no dragging happened, click event will be fired and opens popover (or closes open popover)
    if (dragging && occupiedCount > 1)
        $(startCell).popover("show");

    setPopoverEventHandlers(markedCells);
}


/**
 * Generate the content of the newly created popover, i.e. operator, value and parameter selection.
 * @param contextInfo
 */
function generatePopoverContent (contextInfo) {
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
    return translate_contextInformation(contextInfo.getID())
        + '   <a href="#" title="Schließen" class="closePopover" style="float: right">X</a>';
}


function setPopoverEventHandlers(markedCells) {

    $(document).on("inserted.bs.popover", function() {

        var startCell = $(markedCells).first();
        var lastCell = $(markedCells).last();
        $(startCell).css("border-top", "solid");
        $(lastCell).css("border-bottom", "solid");

        $("#simulatedOperatorSelect").select2();

        $(".closePopover").on("click", function(){
            $(this).parent().parent().popover("hide");

            //if ()
            $("[aria-describedby="+ $(this).parent().parent().attr("id") +"]").removeClass("timelineCellOccupied").css("background-color", "white");
        });

        $(".timelineCell").on("click", ":not(.timelineCellOccupied)", function() {
            $(".timelineCellOccupied").popover("hide");
        });

    });
}