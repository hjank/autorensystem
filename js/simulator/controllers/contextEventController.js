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
    var markedCells = $(".timeline-cell-marked");
    // editor popover will be attached to first cell
    var startCell = $(markedCells).first();
    var firstStepID = getRowIDOfCell(startCell);
    var colID = getColIDOfCell(startCell);

    var timeline = simulation.getTimeline();
    var contextEvent = new ContextEvent(
        timeline.getColumnContext(colID),
        colID,
        firstStepID,
        firstStepID + $(markedCells).length - 1,
        true
    );
    timeline.addEvent(contextEvent);
    timeline.render(createNewPopover, contextEvent);
}


function createNewPopover(timeline, contextEvent) {

    // keep track of selected cells
    var markedCells = $(".timeline-cell-marked");

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
 * Generate the popover's title: the context info's name and an "X" for closing the popover.
 * @param contextInfo
 * @returns {string}
 */
function generatePopoverTitle (contextInfo) {
    var popoverTitle = $("<div>").append((translate_contextInformation(contextInfo.getID())));
    var closeX = $('<a href="#" title="Schließen" class="close-popover">X</a>');
    popoverTitle.append(closeX);

    return popoverTitle;
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
    fillPopoverContextValue(contextInfo, simulatedValueInput, simulatedValueSelect);
    fillParameterSelection(contextInfo.getParameters(), simulatedParameterDiv);

    $("#popoverContentTemplate").append(popoverTemplate);

    return simulatedContextInfoMenuElement;
}


function fillPopoverContextValue(ci, inputContextValueElement, selectPossibleValuesElement) {

    switch (ci.getType()) {

        case "FLOAT":
        case "INTEGER":
            selectPossibleValuesElement.remove();
            inputContextValueElement.attr("type", "number");
            setMinMaxDefault(ci.getMin(), ci.getMax(), ci.getDefault(), inputContextValueElement);

            break;

        case "STRING":
            selectPossibleValuesElement.remove();
            inputContextValueElement.attr("type", "text");

            break;

        case "ENUM":
            inputContextValueElement.css("display", "none");         // make input field invisible

            // fill selection bar
            var enums = ci.getEnums();
            for (var i in enums) {
                var option = $("<option>").attr("value", i.toString());
                option.html(translate_possibleValue(enums[i]));
                selectPossibleValuesElement.append(option);
            }
            //selectPossibleValuesElement.select2("data", {id:"\r",text:"\r"});

            break;

        case "BOOLEAN":
            inputContextValueElement.css("display", "none");      // and input field invisible

            // get the two possible values true and false in selection bar
            var option0 = $("<option>").attr("value", 0);
            var option1 = $("<option>").attr("value", 1);
            option0.html("falsch");
            option1.html("wahr");
            selectPossibleValuesElement.append(option1);
            selectPossibleValuesElement.append(option0);

            break;
    }
}


function hideAllPopovers(timeline) {
    $(".popover").hide();

    // remove all non-confirmed events
    var markedCells = $(".timeline-cell-marked");
    if ($(markedCells).length != 0) {
        var startCell = $(markedCells).first();

        var contextEvent = timeline.getEventAt(getRowIDOfCell(startCell), getColIDOfCell(startCell));
        timeline.removeEvent(contextEvent);

        $(markedCells).popover("destroy");
    }
}

var lastCell;
function setPopoverEventHandlers(startCell, timeline, contextEvent) {

    lastCell = startCell;

    $(".close-popover").on("click", function(event){
        startCell = lastCell;

        $(startCell).popover("hide");

        // closing popover without input + confirm, i.e. aborting event creation
        if (! $(startCell).hasClass("timeline-cell-occupied")) {
            timeline.removeEvent(contextEvent);

            $(startCell).popover("destroy");
        }

        event.stopPropagation();
    });

    $(".confirm-popover").on("click", function(event){
        startCell = lastCell;

        if ($(startCell).hasClass("timeline-cell-marked")) {
            // add new class and style
            drawTopBottomBorders($(".timeline-cell-marked").addClass("timeline-cell-occupied"));
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