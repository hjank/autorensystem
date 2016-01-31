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
        .on("shown.bs.popover", function(event){
            reconstructPopoverContent(this, timeline, contextEvent);
            repositionPopover(this);
            function repositionPopover(cell) {
                var cellTop = $(cell).position().top;
                var cellBottom = cellTop + $(cell).height();
                var popoverHeight = $(".popover").height();
                var newPositionTop = cellTop - popoverHeight - 11;
                var newPositionBottom = cellBottom + popoverHeight + 11;

                var newPosition = "";
                if (newPositionTop > $("#tab5").offset().top)
                    newPosition = newPositionTop;
                else if (newPositionBottom < $("#tab5").height()) {
                    newPosition = cellBottom + 11;
                    $(".popover .arrow").hide();
                }
                $(".popover").css("top", newPosition);
            }
            event.stopPropagation();
        })
        .on("hide.bs.popover", function() {
            // rescue google maps
            $("#divMapsTemplate").append($("#divMaps"));
            // remove select2 markup
            $(".popover select").select2("destroy");
            // remove class "timeline-cell-marked" from all cells
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
    var closeX = $('<a href="#" title="Schließen" class="popover-close">X</a>');
    popoverTitle.append(closeX);

    return popoverTitle;
}


/**
 * Generate the content of the newly created popover, i.e. operator, value and parameter selection.
 * @param contextEvent
 */
function generatePopoverContent (contextEvent) {

    var simulatedContextInfoMenuElement = $("#popoverContentTemplate > div.popover-context-info");

    var popoverTemplate = $(simulatedContextInfoMenuElement).clone();
    $("#popoverContentTemplate").append(popoverTemplate);

    return simulatedContextInfoMenuElement;
}


var lastCell;
function reconstructPopoverContent(startCell, timeline, contextEvent) {
    lastCell = startCell;

    var contextInfo = contextEvent.getContextInfo();

    var simulatedOperatorSelectElement = $(".popover div.popover-context-info > select.popover-operator");
    var simulatedValueInput = $(".popover div.popover-context-info > input.popover-value");
    var simulatedValueSelect = $(".popover div.popover-context-info > select.popover-value");
    var simulatedParameterDiv = $(".popover div.popover-context-info > div.popover-parameters");

    fillOperatorSelection(contextInfo, simulatedOperatorSelectElement);
    fillPopoverContextValue(contextInfo, simulatedValueInput, simulatedValueSelect);
    fillParameterSelection(contextInfo.getParameters(), simulatedParameterDiv);

    $(".popover select").select2();

    setPopoverEventHandlers(timeline, contextEvent);
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


function setPopoverEventHandlers(timeline, contextEvent) {

    $(".popover-close").on("click", function(event){
        $(lastCell).popover("hide");

        // closing popover without input + confirm, i.e. aborting event creation
        if (! $(lastCell).hasClass("timeline-cell-occupied")) {
            timeline.removeEvent(contextEvent);

            $(lastCell).popover("destroy");
        }
        event.stopPropagation();
    });

    $(".popover-confirm").on("click", function(event){
        confirmPopoverContent(contextEvent.getContextInfo());

        if ($(lastCell).hasClass("timeline-cell-marked")) {
            // add new class and style
            drawTopBottomBorders($(".timeline-cell-marked").addClass("timeline-cell-occupied"));
        }

        // triggers unmarking of all cells
        $(lastCell).popover("hide");

        event.stopPropagation();
    });
}


function confirmPopoverContent(contextInfo) {
    var operatorID = $(".select.popover-operator").select2("data").id;
    //contextInfo.setChosenOperator();

    var inputValue = $("input.popover-value").val();
    var selectedValueID = $(".select.popover-value").select2("data").id;

    //contextInfo.setChosenValue(inputValue || selectedValueID);

    //TODO: parameters
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