/**
 * Created by Helena on 06.09.2015.
 */

var array_multiSelectionContextInfos = [];
var unitContextIndex = 0;

$(function() {

    $("#btnBackToMainContextInfo").on("click", showMainContextInfo);


    // triggered if one option was selected ("Eine" or "Alle")
    $("#selectNumberContextInfos").select2().on("select2-selecting", function(e) {

        var unit = $("#" + currentUnitUUID)[0];
        var current_unit = authorSystemContent.getUnitByUUID(currentUnitUUID);
        // default is all have to be satisfied
        var unitSatisfiesAllContextInfos = current_unit.getSat();

        // decides that one of the group of selected context information has to be satisfied (1 == "Eine")
        if (e.val == 1) {

            // if a border already exists and is unequal to 1 --> change design
            if (unitSatisfiesAllContextInfos) {
                // check if icons exist
                if ($(unit).children("div.unit-icons").children("div.unit-icon").length != 0) {
                    $(unit).children("div.unit-icons").css("border", "2px dotted #adadad");

                    // check if ci attribute exists and change attribute ci
                    if ($(unit).children("div.unit-icons")[0].hasAttribute("ci")) {
                        $(unit).children("div.unit-icons").attr("ci", "one");
                    }
                }
            }
            // false == one has to be satisfied
            unitSatisfiesAllContextInfos = false;

            // change sat information in current unit
            current_unit.setSat("one");
        }
        // decides that all of the group of selected context information has to be satisfied (0 == "Alle")
        if (e.val == 0) {

            // if a border already exists and is unequal to 0 --> change design
            if (!unitSatisfiesAllContextInfos) {
                if ($(unit).children("div.unit-icons").children("div.unit-icon").length != 0) {
                    $(unit).children("div.unit-icons").css("border", "2px solid #adadad");

                    // check if ci attribute exists and change attribute ci
                    if ($(unit).children("div.unit-icons")[0].hasAttribute("ci")) {
                        $(unit).children("div.unit-icons").attr("ci", "all");
                    }
                }
            }
            // true == all have to be satisfied
            unitSatisfiesAllContextInfos = true;

            // change sat information in current unit
            current_unit.setSat("all");
        }
    });


    // triggered if an operator was selected in tab "Kontextinformation"
    $("#selectOperator").select2().on("select2-selecting", function(e) {
        // check string of the operator value
        if (e.choice.id == "NO_VALUE") {
            // disable input field if operator needs no value
            if ($("#inputContextValue").css("display") == "block") {
                $("#inputContextValue").attr("disabled", true);
            }
            // disable selection bar if operator needs no value
            if ($("#selectPossibleValues").css("display") == "block") {
                $("#selectPossibleValues").attr("disabled", true);
            }
            // in both cases enable input/selection if operator needs a value
        } else {
            if ($("#inputContextValue").css("display") == "block") {
                $("#inputContextValue").attr("disabled", false);
            }
            if ($("#selectPossibleValues").css("display") == "block") {
                $("#selectPossibleValues").attr("disabled", false);
            }
        }
    });



    // triggered if one option in multi selection bar in tab "Kontextinformation" was removed
    $("#selectMultiContextInfos").select2().on("select2-removed", function(e) {

        var index = e.choice.id;
        var unit = $("#" + currentUnitUUID)[0];

        // remove this option from array ...
        array_multiSelectionContextInfos.splice(index, 1);
        // ... and adjust remaining IDs
        for (var i = index; i < array_multiSelectionContextInfos.length; i++) {
            array_multiSelectionContextInfos[i].id--;
        }
        // update JSON structure
        authorSystemContent.getUnitByUUID(currentUnitUUID).removeContextInfoByIndex(index);

        // remove icon from learning unit
        var removableIconDiv = $(unit).children("div.unit-icons").children("div.unit-icon")[index];
        removableIconDiv.remove();

        // remove border if unit has no icons anymore
        if ($(unit).children("div.unit-icons").children("div.unit-icon").length == 0) {
            $(unit).children(".unit-icons").css("border", "");
            $(unit).children(".unit-icons").css("height", "");
            $(unit).children(".unit-icons").css("display", "");
            $(unit).css("padding-top", "");
        }

        // set endpoints on the right place
        inst.repaintEverything();

    });
});


// if home or confirm button is clicked change view
/**
 * Function changes view of context information tab from detail view to main view.
 * */
function showMainContextInfo() {

    // show main, hide detail
    $("#mainContextInfo").slideDown();
    $("#detailContextInfo").slideUp();

    // check how many context items this unit has got and render the DOM elements accordingly
    if (array_multiSelectionContextInfos.length < 1) {
        $("#mainContextInfoSAT").hide();
        $("#mainContextInfoSelection").hide();
    } else {
        $("#mainContextInfoSAT").show();
        $("#mainContextInfoSelection").show();
    }
}


// fill selection bars in tab "Kontextinformation"
/**
 * Function sets a event listener for selection bar context information after parsing is finished.
 * In this listener all selections and input fields were filled.
 * Furthermore the meta data selection bar is also filled with information.
 * */
function setContextTabListeners() {

    // triggered if add context info button was clicked
    $("#btnAddContextInfos").click(function(e) {

        // get current unit's number of context information pieces
        unitContextIndex = authorSystemContent.getUnitByUUID(currentUnitUUID).getContextData().length;
        showDetailContextInfo();
    });

    // change color of all context classes if selection bar "Kontextinformation" is opening
    $("#selectContextInfos").select2().on("select2-open", function() {
        $(".select2-results").children("li").children("div.select2-result-label").each(function() {
            // for all context classes set a specific color
            $(this).css("background-color", getColor($(this)[0].textContent));
            $(this).css("color", getClassNameColor($(this)[0].textContent));
        });
    });


    // triggered if a context information was selected
    $("#selectContextInfos").select2().on("select2-selecting", function(e) {
        // get index (value) of the selected option
        var j = e.val;
        var selectedInfo = contextList.getItem(j);

        fillOperatorSelection(selectedInfo);

        // fill input field
        fillInputField(selectedInfo);

        // fill parameter selection bar
        fillParameterSelection(selectedInfo.getParameters());
    });
}


function loadContextTabForUnit() {

    var currentUnitModel = authorSystemContent.getUnitByUUID(currentUnitUUID);

    // check how much context information are needed to reach SAT
    var sat = currentUnitModel.getSat();
    if (sat == "all")
        $("#s2id_selectNumberContextInfos").children("a").children("span.select2-chosen").html("Alle");
    else if (sat == "one")
        $("#s2id_selectNumberContextInfos").children("a").children("span.select2-chosen").html("Eine");


    // clear multi selection in context info tab
    var selectMultiContextInfos = $("#selectMultiContextInfos");
    selectMultiContextInfos.empty();
    selectMultiContextInfos.select2("data", null);
    // change format: add icons to text
    selectMultiContextInfos.select2({
        formatSelection: formatMultiContextInfos,
        formatResult: formatMultiContextInfos,
        escapeMarkup: function(m) {return m;}
    });

    // fill multi selection bar with data from a past editing of this learning unit
    array_multiSelectionContextInfos = [];
    var currentUnitContextArray = currentUnitModel.getContextData();
    for (var i in currentUnitContextArray) {
        var contextID = currentUnitContextArray[i].getID();
        array_multiSelectionContextInfos.push({
            "id":i,
            "text":translate_contextInformation(contextID)
        });
    }
    // get data in multi selection bar
    selectMultiContextInfos.select2("data", array_multiSelectionContextInfos);

    showMainContextInfo();

    // re-color each choice and add editing functionality
    formatMultiContextInfosElements();
}


// Jobs: - make details in tab "Kontextinformation" visible,
//       - hide main part
//       - get information into the selections and input fields
/**
 * Function gets information into the selection bar and input fields.
 * Furthermore hide main part in tab and show details of context information.
 * */
function showDetailContextInfo() {

    // show detail, hide main
    $("#detailContextInfo").slideDown();
    $("#mainContextInfo").slideUp();

    /* add context information in selection bar */
    // clean selections
    cleanSection("#selectContextInfos");
    cleanSection("#selectOperator");
    cleanSection("#selectPossibleValues");

    // clean input fields
    $("#formContextInformation")[0].reset();

    // make objects invisible
    $("#selectOperator").css("display", "none");
    $("#inputContextValue").css("display", "none");
    $("#selectPossibleValues").css("display", "none");
    $("#divContextParameter").css("display", "none");

    // fill selection "Kontextinformation"
    fillSelectionContextInformation();

    // set event listener for "Bestätigen" button in tab "Kontextinformation"
    $("#btnConfirmContextInfo, #btnConfirmContextInfoSmall").on("click", function(event) {
        confirmContextInformation();
        event.stopPropagation();
    });
}


// fill selection bar "Kontextinformation"
/**
 * Function adds all context information and context classes into the selection bar context information.
 * */
function fillSelectionContextInformation() {

    // create array for all context classes
    var array_optgroups = [];
    var contextClasses = contextList.getClasses();

    // iterate through all context classes
    for (var j in contextClasses) {
        var classLabelTranslation = translate_contextClass(contextClasses[j]);
        array_optgroups.push($("<optgroup>").attr("label", classLabelTranslation));
    }

    // iterate through all context information
    for (var i in contextList.getItems()) {

        var contextItem = contextList.getItem(i);

        // create option DOM and add the context information
        var option = $("<option>").attr("value", i.toString());
        option.html(translate_contextInformation(contextItem.getID()));

        // get first of this context info's classes matching one of the global classes
        var classIndex = getFirstMatchingClassIndex(contextItem, contextClasses);
        // put context info into optgroup corresponding to this class
        if (classIndex != -1)
            array_optgroups[classIndex].append(option);
        // if no class matches, this info won't be shown
    }

    // change format: add glyphs per option
    $("#selectContextInfos").select2({
        formatSelection: formatContextInfos,
        formatResult: formatContextInfos,
        escapeMarkup: function(m) {return m;}
    });

    // append optgroups (context classes) and their included options in selection bar "Kontextinformation"
    for (var l=0; l<array_optgroups.length; l++) {
        $("#selectContextInfos").append(array_optgroups[l]);
    }
}

// fill operator selection and set choice
/**
 * For the given context info object, gets the operator selection filled and set to a previous choice (if in edit mode).
 * @param {Object} selectedInfo Contains current context information object.
 * */
function fillOperatorSelection(selectedInfo, selectOperatorElement) {
    // get the corresponding operators to the selected context information
    var operators = selectedInfo.getOperators();
    var chosenOperator = selectedInfo.getChosenOperator();

    var isPopover = false;
    if (selectOperatorElement)
        isPopover = true;
    else
        selectOperatorElement = $("#selectOperator");

    // clear selection bar
    cleanSection(selectOperatorElement);
    selectOperatorElement.select2();

    // fill selection bar "Operator"
    for (var i in operators) {
        var operator = operators[i];
        if (isPopover && (operator == "NO_VALUE"))
            continue;
        var option = $("<option>").attr("value", i.toString());
        option.html(translate_operator(operator));
        selectOperatorElement.append(option);
    }

    if (chosenOperator != "") {
        selectOperatorElement.select2("data", {
            id:operators.indexOf(chosenOperator),
            text:translate_operator(chosenOperator)
        });
    }
    else if (!isPopover) {
        // set empty field in selected start field
        selectOperatorElement.select2("data", {id:"\r",text:"\r"});
    }
}


// fill input field (value in tab Kontexinformation)
/**
 * Function gets the selected context information and decides which input field has to be set on GUI.
 * @param {Object} ci Contains current context information object.
 * */
function fillInputField(ci) {

    var chosenValue = ci.getChosenValue();

    var inputContextValueElement = $("#inputContextValue");
    var selectPossibleValuesElement = $("#selectPossibleValues");
    // clear selection
    selectPossibleValuesElement.empty();
    selectPossibleValuesElement.select2("destroy");

    // decide which type of input field is needed
    switch (ci.getType()) {

        case "FLOAT":
        case "INTEGER":
            // activate and show input field and hide selection bar
            inputContextValueElement
                .attr("disabled", false)
                .attr("type", "number")
                .css("display", "block");
            setMinMaxDefault(ci.getMin(), ci.getMax(), ci.getDefault(), inputContextValueElement);

            selectPossibleValuesElement.css("display", "none");

            // reset the value of this input field to "" or the last saved value (if we are in edit mode)
            inputContextValueElement.val(chosenValue);
            break;

        case "STRING":
            inputContextValueElement
                .attr("disabled", false)            // activate input field
                .attr("type", "text")               // set type to text
                .css("display", "block")           // make input field visible
                .attr("maxlength", 40);            // set max length to 40


            selectPossibleValuesElement.css("display", "none");      // and selection bar invisible

            // reset the value of this input field to "" or the last saved value (if we are in edit mode)
            inputContextValueElement.val(chosenValue);
            break;

        case "ENUM":
            inputContextValueElement.css("display", "none");         // make input field invisible
            selectPossibleValuesElement.css("display", "block");     // and selection bar visible
            selectPossibleValuesElement.select2();

            // fill selection bar
            var enums = ci.getEnums();
            for (var i in enums) {
                var option = $("<option>").attr("value", i.toString());
                option.html(translate_possibleValue(enums[i]));
                selectPossibleValuesElement.append(option);
            }


            // set selection to none or last choice (if we are in edit mode)
            if (chosenValue == "") {
                selectPossibleValuesElement.select2("data", {id:"\r",text:"\r"});
            }
            else {
                selectPossibleValuesElement.select2("data", {
                    id:enums.indexOf(chosenValue),
                    text:translate_possibleValue(chosenValue)
                });
            }
            break;

        case "BOOLEAN":
            // TODO: Prettify this whole Boolean thing: include values in operator, spare value selection.
            inputContextValueElement.css("display", "none");      // and input field invisible
            selectPossibleValuesElement.css("display", "block");  // make selection bar visible
            selectPossibleValuesElement.select2();

            // get the two possible values true and false in selection bar
            var option0 = $("<option>").attr("value", 0);
            var option1 = $("<option>").attr("value", 1);
            option0.html("falsch");
            option1.html("wahr");
            selectPossibleValuesElement.append(option1);
            selectPossibleValuesElement.append(option0);

            // set selection to none or last choice (if we are in edit mode)
            if (chosenValue == "") {
                selectPossibleValuesElement.select2("data", {id:"\r",text:"\r"});
            }
            else {
                selectPossibleValuesElement.select2("data", {
                    id:enums.indexOf(chosenValue),
                    text:translate_possibleValue(chosenValue)
                });
            }

            break;
    }
}


// get the current needed input fields and selection bars (tab Kontextinformation)
/**
 * Function show all needed input fields and selection bar for the selected context information.
 * @param {Object} cp Contains all existing context parameter.
 * */
function fillParameterSelection(cp, divContextParams) {
    divContextParams = divContextParams || $("#divContextParameter");

    var id, div, child;
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

        switch (thisParam.getType()) {

            // type enum needs a drop down selection for only possible values
            case "ENUM":
                var enums = thisParam.getEnums();

                id = "parameter" + i;
                div = createNamedDOMElement("div", "divParameter"+i)
                    .css("display", "block")
                    .append(createParameterLabelDOM(id, parameterTranslation));
                child = createNamedDOMElement("select", id)
                    .addClass("form-control select select-primary select-block mbl")
                    .attr("style", "min-width: 235px;");

                // append all possible values
                for (var j in enums) {
                    child.append(
                        $("<option>")
                            .attr("value", j.toString())
                            .html(translate_parameterValue(enums[j]))
                    );
                }
                div.append(child);
                divContextParams.append(div);
                $("#" + id).select2();
                // decision depends on mode we are in: new info --> empty, edit mode --> previous choice
                if (chosenValue == "")
                    $("#" + id).select2("data", {id:"\r",text:"\r"});
                else {
                    $("#" + id).select2("data", {
                        id:enums.indexOf(chosenValue),
                        text:translate_parameterValue(chosenValue)
                    });
                }
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

                id = "parameter"+i;
                div = createNamedDOMElement("div", "divParameter"+i)
                    .addClass("parameter-input")
                    .css("display", "table-cell")
                    .append(createParameterLabelDOM(id, parameterTranslation));
                child = createNamedDOMElement("input", id)
                    .addClass("form-control")
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
                id = "parameter"+i;
                div = createNamedDOMElement("div", "divParameter"+i)
                    .css("display", "block")
                    .append(createParameterLabelDOM(id, parameterTranslation));
                child = createNamedDOMElement("input", id)
                    .addClass("form-control")
                    .attr("type", "text");
                // if we are in edit mode: previously saved value, else ""
                child.val(chosenValue);
                div.append(child);
                divContextParams.append(div);
                break;
        }

        // show context parameter section
        divContextParams.css("display", "block");
    }
}


// set minima and maxima if needed in input fields in tab "Kontextinformation"
/**
 * Function set minimum and maximum values for an input field.
 * @param {Array} values Contains minimum and maximum values.
 * @param {Object} inputField Contains an input field.
 * */
function setMinMaxDefault(min, max, def, inputField) {

    if (min != "") {
        inputField.attr("min", min);
    }
    if (max != "") {
        inputField.attr("max", max);
    }
    if (def != "") {
        inputField.attr("value", def);
    }
}


// function gets called when "Bestätigen" button was clicked after context editing
function confirmContextInformation() {

    // get current unit's data model
    var current_unit = authorSystemContent.getUnitByUUID(currentUnitUUID);
    // save this before a new info is added or an old replaced to get icons right
    var oldContextLength = current_unit.getContextData().length;
    // and the information if "all" or "one" context infos must be satisfied
    var sat = current_unit.getSat();
    // get the unit's DOM element
    var unit = $("#"+currentUnitUUID)[0];

    // check if all needed fields were filled with information and return selected context
    var selectedInfo = checkInformation();
    // abort if error occurred
    if (!selectedInfo) return false;

    // add the new information to the context list of the currently selected unit
    current_unit.addContextInfo(selectedInfo, unitContextIndex);

    var selectedInfoID = selectedInfo.getID();
    var selectedInfoIconID = selectedInfoID + unitContextIndex;

    // create icon DOM
    var divContextIcon = $("<div>")
        .addClass("unit-icon")
        .attr("id", selectedInfoIconID + "icon");

    // get right format for icon visualisation in learning unit
    // case 1: context specific icon
    // case 2: context class icon (upper class icon, only color)
    var icon = formatUnitIcons(selectedInfo);

    // add icon and div to unit
    divContextIcon.append(icon);
    // if this was the editing of an already asserted context datum, replace the icon
    if (unitContextIndex < oldContextLength) {
        var staleDiv = $(unit).children("div.unit-icons").children("div.unit-icon")[unitContextIndex];
        $(staleDiv).replaceWith(divContextIcon);
    }
    // else, if this is a brand-new piece of context information, then simply add the icon
    else
        $(unit).children("div.unit-icons").append(divContextIcon);


    /* design reasons */
    // all SAT needs solid border
    if (sat == "all") {
        $(unit).children("div.unit-icons").css("border", "2px solid #adadad");
        $(unit).children("div.unit-icons").attr("ci", "all");      // ci all = all context informations

        // one SAT needs dotted border
    } else if (sat == "one") {
        $(unit).children("div.unit-icons").css("border", "2px dotted #adadad");
        $(unit).children("div.unit-icons").attr("ci", "one");      // ci one = one context information
    }
    $(unit).children("div.unit-icons").css("border-radius", "4px");
    $(unit).css("padding-top", "10px");
    $(unit).children("div.unit-icons").css("height", "23px");
    $(unit).children("div.unit-icons").css("display", "inline-block");

    // set endpoints on the right place
    inst.repaintEverything();

    /* get selected context information name into multi selection bar */

    // get name
    var contextInfoName = translate_contextInformation(selectedInfoID);

    // change format: add icons to text
    var selectMultiContextInfos = $("#selectMultiContextInfos")[0];
    $(selectMultiContextInfos).select2({
        formatSelection: formatMultiContextInfos,
        formatResult: formatMultiContextInfos,
        escapeMarkup: function (m) {
            return m;
        }
    });

    // get name into multi selection
    //$("#selectMultiContextInfos").append(option);
    array_multiSelectionContextInfos[unitContextIndex] = {id: unitContextIndex.toString(), text: contextInfoName};
    $(selectMultiContextInfos).select2("data", array_multiSelectionContextInfos);

    // re-color each choice and add editing functionality
    formatMultiContextInfosElements();

    // show main, hide detail
    showMainContextInfo();

    // workaround to avoid error message due to circular structure
    replaceScenarioReferencesWithNames();
    console.log(JSON.stringify(authorSystemContent));
}


// get current value from input field
/**
 * Function evaluate the input value and sets too big values to maximum and too small values to minimum.
 * @param {Object} val Contains the current value of the context value input field.
 * */
function getInputContextValue(event) {

    var inputContextValueElement = event.target;
    var val = $(inputContextValueElement).val();

    // reduce to big values to maximum
    if ( $(inputContextValueElement).hasAttribute("max") ) {
        // get max attribute value
        var max = $(inputContextValueElement).getAttribute("max");
        max = parseInt(max);
        if (val.value > max) {
            val.value = max;
        }
    }

    // increase to little values to minimum
    if ( $(inputContextValueElement).hasAttribute("min") ) {
        // get min attribute value
        var min = $(inputContextValueElement).getAttribute("min");
        min = parseInt(min);
        if (val.value < min) {
            val.value = min;
        }
    }

    // do not allow no numbers
    /*if (val.value.length == 0) {
     var regex = /[0-9]/;
     if( !regex.test(val.value) ) {
     val.value = 0;
     }
     }*/

}


// get current value from input field
/**
 * Function evaluate the input value of the context parameter.
 * Resets values if they are too high (maximum) or too small (minimum).
 * Set marker on Google Maps if two input fields and the map are available.
 * @param {Object} val Contains current input field content.
 * @param {int} num Contains the specific input id number.
 * @param {Boolean} coord True if coordinates are expected as input.
 * */
function getParameterInput(event, coord) {

    var parameterElement = event.target;
    var val = $(parameterElement).val();

    // reduce too big values to maximum
    if ( parameterElement.hasAttribute("max") ) {
        // get max attribute value
        var max = parameterElement.getAttribute("max");
        max = parseInt(max);
        if (val.value > max) {
            val.value = max;
        }
    }

    // increase too little values to minimum
    if ( parameterElement.hasAttribute("min") ) {
        // get min attribute value
        var min = parameterElement.getAttribute("min");
        min = parseInt(min);
        if (val.value < min) {
            val.value = min;
        }
    }

    /* get values from inputs and set the marker on this point in google maps */
    if (coord) {

        var lat, long;
        var lngInputDiv = $("#divMaps").prev();
        var latInputDiv = $(lngInputDiv).prev();

        // check if latitude is not empty
        lat = $(latInputDiv).children("input")[0].value;

        // check if longitude is not empty
        long = $(lngInputDiv).children("input")[0].value;

        // only if both inputs have a value set marker
        if (lat && long) {
            var new_LatLong = new google.maps.LatLng(lat, long);

            // replace old marker and set the new one
            replaceMarker(new_LatLong);
            resetMapToCenter(new_LatLong);
        }
    }
}


// change all colors in multi selection in tab "Kontextinformation"
/**
 * Function changes colors of all selected options in multi selection bar context information.
 * */
function formatMultiContextInfosElements() {

    for (var contextIndex in array_multiSelectionContextInfos) {

        // get the context item, its ID and translation
        var item = array_multiSelectionContextInfos[contextIndex];
        var contextInfo = authorSystemContent.getUnitByUUID(currentUnitUUID).getContextData()[item.id];
        var contextInfoTranslation = item.text;
        // and the containing DOM element
        var selectSearchChoice = $("#s2id_selectMultiContextInfos > .select2-choices > .select2-search-choice")[contextIndex];

        // get color for first known context class
        var firstClassTranslation = translate_contextClass(contextInfo.getClasses()[0]);

        // set background color, title (for tooltip) and hover event handler
        $(selectSearchChoice)
            .css("background-color", getColor(firstClassTranslation))
            .attr("title", contextInfoTranslation)
            .hover( function() { $(this).css("width", "85px"); },
                function() { var obj = $(this); setTimeout( function() { obj.css("width", ""); }, 200 ); })
        ;

        /* new */

        // add edit icon
        var edit = createContextInfoEditDOM();
        $(selectSearchChoice).append(edit);

        // add click event handler
        edit.on("click", function(e) {
            console.log("edit");
            e.stopPropagation();

            // get the index of this item in the current unit's context multi selection
            unitContextIndex = $(this).parent().index();
            // and use it to get at the whole context info data object
            var thisContextInfo = authorSystemContent.getUnitByUUID(currentUnitUUID).getContextData()[unitContextIndex];

            // then reconstruct its values in the context details tab
            reconstructContextDetailsTab(thisContextInfo);

            $("#mainContextInfo").hide();
            $("#detailContextInfo").show();

        });

        // add event handlers for close "x"

        $(".select2-search-choice-close").hover(
            function() {$(this).attr("title", "Löschen")}
        );
        $(".select2-search-choice-close").on("click", function(e) {
            console.log("delete");
            e.stopPropagation();
        });

        /* end new */
    }
}

// when edit icon in multi selection was clicked: recall chosen details
function reconstructContextDetailsTab(contextInfo) {

    var contextID = contextInfo.getID();
    // 1. the context information type selection:
    var selectIndex = contextList.getIndexByID(contextID);
    $("#selectContextInfos").select2("data", {
        id:selectIndex,
        text:translate_contextInformation(contextID)
    });

    // 2. the operator selection:
    var chosenOperator = contextInfo.getChosenOperator();
    $("#selectOperator").select2("data", {
        id:contextInfo.getOperators().indexOf(chosenOperator),
        text:translate_operator(chosenOperator)
    });

    // 3. the chosen value:
    fillInputField(contextInfo);

    // 4. the parameter section (if given):
    fillParameterSelection(contextInfo.getParameters());
}

// search for this context info's classes in a list of classes and return first match
function getFirstMatchingClassIndex(contextItem, contextClasses) {
    var classIndex;
    var classes = contextItem.getClasses();
    for (var k in classes) {
        classIndex = contextClasses.indexOf(classes[k]);
        if (classIndex != -1)
            break;
    }
    return classIndex;
}


/**************************tiny little helpers******************************/

// create any new DOM element with an ID
function createNamedDOMElement(elem, id) {
    return $("<"+elem+">")
        .attr("id", id);
}

// create a new label (which is also a DOM element)
function createParameterLabelDOM(elem, label) {
    return $("<label>")
        .attr("class", "label-tabs label")
        .attr("for", elem)
        .html(label);
}

// create a clickable edit icon for context info multi selection
function createContextInfoEditDOM () {
    return $("<a>")
        .attr("href", "#")
        .addClass("select2-search-choice-edit")
        .attr("tabindex", -1)
        .attr("title", "Bearbeiten");
}