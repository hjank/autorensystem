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
    contextEvent.render(createNewPopover, simulation);
}


function createNewPopover(contextEvent, simulation) {

    var markedCells = [];
    for (var step = contextEvent.getStart(); step <= contextEvent.getEnd(); step++)
        markedCells.push($("#timelineTable").find(".timeline-step").eq(step).children(".timeline-cell").eq(contextEvent.getColumn()));

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
        .tooltip("destroy");

    markedCells.forEach(function(cell){
        cell.on("shown.bs.popover", function(event){
            reconstructPopoverContent(this, simulation, contextEvent);
            repositionPopover(this);
        }).on("hide.bs.popover", function() {
            removeEventMarkup();
        });
    });

    // if no dragging happened, click event will be fired and opens popover (or closes open popover)
    if ($(markedCells).length > 1) {
        // editor popover will be attached to first cell
        $(markedCells).first().popover("show");
    }
}


function removeEventMarkup() {
    // rescue google maps
    $("#divMapsTemplate").append($("#divMaps"));
    // remove select2 markup
    $(".popover select").select2("destroy");
    // remove class "timeline-cell-marked" from all cells
    unmarkAllCells();
}


/**
 * Generate the popover's title: the context info's name and an "X" for closing the popover.
 * @param contextInfo
 * @returns {string}
 */
function generatePopoverTitle (contextInfo) {
    var popoverTitle = $("<div>").append((translate_contextInformation(contextInfo.getID())));
    var closeX = $('<a href="#" title="Schließen ohne zu speichern" class="popover-close">X</a>');
    popoverTitle.append(closeX);

    return popoverTitle;
}


/**
 * Generate the content of the newly created popover, i.e. value and parameter selection.
 * @param contextEvent
 */
function generatePopoverContent (contextEvent) {

    var simulatedContextInfoMenuElement = $("#popoverContentTemplate > div.popover-context-info");

    var popoverTemplate = $(simulatedContextInfoMenuElement).clone();
    $("#popoverContentTemplate").append(popoverTemplate);

    return simulatedContextInfoMenuElement;
}


var lastCell;
function reconstructPopoverContent(startCell, simulation, contextEvent) {
    lastCell = startCell;

    var contextInfo = contextEvent.getContextInfo();

    var simulatedValueInput = $(".popover div.popover-context-info > input.popover-value");
    var simulatedValueSelect = $(".popover div.popover-context-info > select.popover-value");
    var simulatedParameterDiv = $(".popover div.popover-context-info > div.popover-parameters");

    fillPopoverContextValue(contextInfo, simulation.getScenario(), simulatedValueInput, simulatedValueSelect);
    fillPopoverParameterSelection(contextInfo.getParameters(), simulatedParameterDiv);

    $(".popover select").select2();

    setPopoverEventHandlers(simulation, contextEvent);
}

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

function fillPopoverContextValue(ci, scenario, inputContextValueElement, selectPossibleValuesElement) {

    selectPossibleValuesElement.empty();

    // if a unit is expected as value (a unit's UUID, that is, which will be entered on confirm)
    if (ci.getID().indexOf("LEARNING_UNIT") != -1) {
        inputContextValueElement.css("display", "none"); // make input field invisible

        // add all units of the current scenario
        scenario.getUnits().forEach(function (unit, index) {
            selectPossibleValuesElement.append($("<option>")
                .attr("value", index.toString())
                .html(unit.getName()));
        });
        return;
    }

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
            selectPossibleValuesElement.append($("<option>").attr("value", 1).html("ist wahr"));
            selectPossibleValuesElement.append($("<option>").attr("value", 0).html("ist falsch"));

            break;
    }
}

function fillPopoverParameterSelection(cp, divContextParams) {

    // in case there are coordinates to be set
    var divMaps = $("#divMaps");
    var coordsExpected = false;
    var lat, long;
    // remove all parameter fields from previous editing (except maps div)
    $("#divMapsTemplate").append(divMaps);

    divContextParams.empty();

    // iterate through all parameters
    for (var i in cp) {

        // get each parameter's ID, translated name, and previously chosen value (given we are in edit mode)
        var thisParam = cp[i];
        var parameterOriginal = thisParam.getID();
        var parameterTranslation = translate_parameter(parameterOriginal);
        var chosenValue = thisParam.getChosenValue(); // "" if not chosen previously

        var id = "popoverParameter"+i;
        var div = $("<div>").addClass("popover-parameter");
        var child;

        switch (thisParam.getType()) {

            // type enum needs a drop down selection for only possible values
            case "ENUM":
                div.append(createParameterLabelDOM(id, parameterTranslation));
                child = createNamedDOMElement("select", id)
                    .addClass("form-control select select-primary select-block mbl");

                // append all possible values
                var enums = thisParam.getEnums();
                enums.forEach(function(val, index) {
                    child.append($("<option>").attr("value", index.toString()).html(translate_parameterValue(val)));
                });
                div.append(child);
                divContextParams.append(div);

                $("#" + id).select2();
                // decision depends on mode we are in: new info --> empty, edit mode --> previous choice
                if (chosenValue == "")
                    $("#" + id).select2("data", {id:"\r",text:"\r"});
                else
                    $("#" + id).select2("data", {
                        id:enums.indexOf(chosenValue),
                        text:translate_parameterValue(chosenValue)
                    });

                break;


            // type float or integer each need an input field and a specific label
            case "INTEGER":
            case "FLOAT":
                // if coordinates are expected, set lat and long to either "" (new info) or previously input values
                if (/CP_.*LONGITUDE/.test(parameterOriginal)) {
                    long = chosenValue;
                    coordsExpected = true;
                }
                if (/CP_.*LATITUDE/.test(parameterOriginal)) {
                    lat = chosenValue;
                    coordsExpected = true;
                }

                div.addClass("parameter-input").append(createParameterLabelDOM(id, parameterTranslation));
                child = createNamedDOMElement("input", id).addClass("form-control")
                    .attr("type", "number")
                    .on("keyup", function (event) {
                        getParameterInput(event, coordsExpected);
                    });
                setMinMaxDefault(thisParam.getMin(), thisParam.getMax(), thisParam.getDefault(), child);

                // if we are in edit mode: previously saved value, else ""
                child.val(chosenValue);
                div.append(child);
                divContextParams.append(div);

                // display google maps if both lat and long have been set
                if (typeof lat != "undefined" && typeof long != "undefined") {

                    // put the map in a visible spot and render it correctly (hopefully)
                    divContextParams.append(divMaps);

                    // put marker where it has been placed before (i.e. we are in edit mode)
                    if (chosenValue != "") {
                        var latlng = new google.maps.LatLng(lat, long);
                        replaceMarker(latlng);
                        //resetMapToCenter(latlng);
                    } else
                        resizeMap();
                }
                break;

            // type string needs an input field and a specific label
            case "STRING":
                div.append(createParameterLabelDOM(id, parameterTranslation));
                child = createNamedDOMElement("input", id).addClass("form-control").attr("type", "text");
                // if we are in edit mode: previously saved value, else ""
                child.val(chosenValue);
                div.append(child);
                divContextParams.append(div);
                break;
        }
    }
}

function setPopoverEventHandlers(simulation, contextEvent) {

    $(".popover-close").on("click", function(event){
        // closing popover without input + confirm, i.e. aborting event creation
        hideAllPopovers(simulation.getTimeline());
    });

    $(".popover-confirm").on("click", function(event){
        confirmPopoverContent(contextEvent.getContextInfo(), simulation.getScenario());

        if ($(lastCell).hasClass("timeline-cell-marked")) {
            // add new class and style
            addOccupiedMarkup($(".timeline-cell-marked"));
        }

        // triggers unmarking of all cells
        $(lastCell).popover("hide");
    });
}


function confirmPopoverContent(contextInfo, scenario) {

    var inputValue = $(".popover input.popover-value").val();
    var selectedValueID = $(".popover .select.popover-value").select2("val");
    if (typeof selectedValueID != "undefined")
        inputValue = contextInfo.getEnums()[selectedValueID] || scenario.getUnits()[selectedValueID].getUUID();

    contextInfo.setChosenValue(inputValue);

    contextInfo.getParameters().forEach(function(param, index) {
        var paramElement = $("#popoverParameter"+index);
        var paramValue;
        if (param.getType() == "ENUM")
            paramValue = param.getEnums()[$(paramElement).select2("val")];
        else
            paramValue = $(paramElement).val();
        param.setChosenValue(paramValue);
    });
}



function hideAllPopovers(timeline) {

    // triggers "hide.bs.popover" event handled by removing all markup
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
        .attr("title", "Löschen")
        .tooltip();
}

function createContextEventCopyDOM () {
    return $("<a>")
        .attr("href", "#")
        .addClass("fui-copy")
        .attr("title", "Duplizieren")
        .tooltip();
}

function createContextEventHideDOM () {
    return $("<a>")
        .attr("href", "#")
        .addClass("fui-eye-blocked")
        .attr("title", "Ausblenden")
        .tooltip();
}