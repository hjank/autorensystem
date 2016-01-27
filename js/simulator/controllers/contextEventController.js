/**
 * Created by Helena on 11.01.2016.
 */


/**
 * 1. Change class of selected cells from marked to occupied.
 * 2. Create a popover for adding/editing/deleting a context "event"
 *
 */
function createNewContextEvent (simulation) {

    // keep track of selected cells
    var markedCells = $('.timelineCellMarked');
    // editor popover will be attached to first cell
    var startCell = $(markedCells).first();
    // count how many cells have been selected
    var occupiedCount = $(markedCells).length;
    var firstStepID = $(startCell).parent().index();
    var colID = $(startCell).parent().children(".timelineCell").index(startCell);


    var timeline = simulation.getTimeline();
    var contextInfo = timeline.getColumnContext(colID);

    var contextEvent = new ContextEvent(contextInfo, colID, firstStepID, firstStepID+occupiedCount-1, true);
    timeline.addEvent(contextEvent);

    timeline.render(createNewPopover);
}

function createNewPopover(timeline) {

    // keep track of selected cells
    var markedCells = $('.timelineCellMarked');
    var startCell = $(markedCells).first();
    var firstStepID = $(startCell).parent().index();
    var colID = $(startCell).parent().children(".timelineCell").index(startCell);
    var contextEvent = timeline.getEventAt(firstStepID, colID);

        // create a context editor popover for each selected cell
    $(markedCells)
        .popover({
            container: "#tab5",
            content: generatePopoverContent(contextEvent),
            html: true,
            placement: "auto bottom",
            selector: markedCells,
            template: '<div class="popover" role="tooltip">' +
            '<div class="arrow"></div>' +
            '<h3 class="popover-title"></h3>' +
            '<div class="popover-content"></div>' +
            '</div>',
            title: generatePopoverTitle(contextEvent.getContextInfo()),
            viewport: "#timelineContainer"
        })
        .on("shown.bs.popover", function(event){
            $(".popover select").select2();
            setPopoverEventHandlers(this, timeline, contextEvent);
            event.stopPropagation();
        })
        .on("hide.bs.popover", function() {
            $(".popover select").select2("destroy");
            unmarkAllCells();
        })
        .tooltip("destroy");


    // if no dragging happened, click event will be fired and opens popover (or closes open popover)
    if (dragging && $(markedCells).length > 1) {
        // editor popover will be attached to first cell
        $(markedCells).first().popover("show");
    }
}

/**
 * Generate the content of the newly created popover, i.e. operator, value and parameter selection.
 * @param contextEvent
 */
function generatePopoverContent (contextEvent) {
    var contextInfo = contextEvent.getContextInfo();
    var eventUUID = contextEvent.getUUID();

    var simulatedContextInfoMenuElement = $("#simulatedContextInfoMenu");
    var popoverTemplate = $(simulatedContextInfoMenuElement).clone();
    var simulatedOperatorSelectElement = $("#popoverOperatorSelect");
    var simulatedValueInput = $("#popoverValueInput");
    var simulatedValueSelect = $("#popoverValueSelect");
    var simulatedParameterDiv = $("#popoverParameters");

    $(simulatedContextInfoMenuElement).find("*").each(function() {
        var id = $(this).attr("id");
        if (id) $(this).attr("id", id + "_" + eventUUID);
    });
    $(simulatedContextInfoMenuElement).attr("id", "simulatedContextInfoMenu_"+eventUUID);

    fillOperatorSelection(contextInfo, simulatedOperatorSelectElement);
    fillInputField(contextInfo, simulatedValueInput, simulatedValueSelect);
    fillParameterSelection(contextInfo.getParameters(), simulatedParameterDiv);

    $("#popoverContentTemplate").append(popoverTemplate);

    return simulatedContextInfoMenuElement;
}


/**
 * Generate the popover's title: the context info's name and an "X" for closing the popover.
 * @param contextInfo
 * @returns {string}
 */
function generatePopoverTitle (contextInfo) {
    var popoverTitle = $("<div>").append((translate_contextInformation(contextInfo.getID())));
    var closeX = $('<a href="#" title="Schließen" class="closePopover">X</a>');
    popoverTitle.append(closeX);

    return popoverTitle;
}



function hideAllPopovers() {
    $(".popover").hide();
}

var lastCell;
function setPopoverEventHandlers(startCell, timeline, contextEvent) {

    lastCell = startCell;

    $(".closePopover").on("click", function(event){
        startCell = lastCell;

        $(startCell).popover("hide");

        // closing popover without input + confirm, i.e. aborting event creation
        if (! $(startCell).hasClass("timelineCellOccupied")) {
            timeline.removeEvent(contextEvent);

            $(startCell).popover("destroy");
        }

        event.stopPropagation();
    });

    $(".confirmPopover").on("click", function(event){
        startCell = lastCell;

        if ($(startCell).hasClass("timelineCellMarked")) {
            // add new class and style
            drawTopBottomBorders($(".timelineCellMarked").addClass('timelineCellOccupied'));
        }

        // triggers unmarking of all cells
        $(startCell).popover("hide");

        event.stopPropagation();
    });
}

function createContextEventDeleteDOM () {
    return $("<a>")
        .attr("href", "#")
        .addClass("fui-trash")
        .attr("tabindex", -1)
        .attr("title", "Löschen");
}

function createContextEventCopyDOM () {
    return $("<a>")
        .attr("href", "#")
        .addClass("fui-copy")
        .attr("tabindex", -1)
        .attr("title", "Duplizieren");
}

function createContextEventHideDOM () {
    return $("<a>")
        .attr("href", "#")
        .addClass("fui-eye-blocked")
        .attr("tabindex", -1)
        .attr("title", "Ausblenden");
}