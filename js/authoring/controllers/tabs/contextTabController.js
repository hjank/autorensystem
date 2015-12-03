/**
 * Created by Helena on 06.09.2015.
 */

var array_multiSelectionContextInfos = [];

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
                if (unit.children("div.unit-icons").children("div.unit-icon").length != 0) {
                    unit.children("div.unit-icons").css("border", "2px dotted #adadad");

                    // check if ci attribute exists and change attribute ci
                    if (unit.children("div.unit-icons")[0].hasAttribute("ci")) {
                        unit.children("div.unit-icons").attr("ci", "one");
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
                if (unit.children("div.unit-icons").children("div.unit-icon").length != 0) {
                    unit.children("div.unit-icons").css("border", "2px solid #adadad");

                    // check if ci attribute exists and change attribute ci
                    if (unit.children("div.unit-icons")[0].hasAttribute("ci")) {
                        unit.children("div.unit-icons").attr("ci", "all");
                    }
                }
            }
            // true == all have to be satisfied
            unitSatisfiesAllContextInfos = true;

            // change sat information in current unit
            current_unit.setSat("all");
        }
    });


    // TODO: This doesn't seem to work as supposed.
    // triggered if an operator was selected in tab "Kontextinformation"
    $("#selectOperator").select2().on("select2-selecting", function(e) {
        // check string of the operator value
        if (e.choice.text == "Hat keinen Wert") {
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
        $(unit).children("div.unit-icons").children("div.unit-icon")[index].remove();

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
}


// fill selection bars in tab "Kontextinformation"
/**
 * Function sets a event listener for selection bar context information after parsing is finished.
 * In this listener all selections and input fields were filled.
 * Furthermore the meta data selection bar is also filled with information.
 * */
function fillContextTab() {

    // triggered if add context info button was clicked
    $("#btnAddContextInfos").click(function(e) {

        // get current unit's number of context information pieces
        var current_unit = authorSystemContent.getUnitByUUID(currentUnitUUID);
        var contextDataCounter = current_unit.getContextData().length;

        showDetailContextInfo(contextDataCounter);
    });

    // change color of all context classes if selection bar "Kontextinformation" is opening
    $("#selectContextInfos").select2().on("select2-open", function() {
        $(".select2-results").children("li").children("div.select2-result-label").each(function() {
            // for all context classes set a specific color
            $(this).css("background-color", getColor($(this)[0].textContent));
            $(this).css("color", getClassNameColor($(this)[0].textContent));
        });
    });

    /* tab "Kontextinformation" */
    // triggered if a context information was selected
    $("#selectContextInfos").select2().on("select2-selecting", function(e) {
        // get index (value) of the selected option
        var j = e.val;
        var selectedInfo = contextList.getItem(j);

        // get the corresponding operators to the selected context information
        var operators = selectedInfo.getOperators();

        // clear selection bar
        $("#selectOperator").empty();
        $("#selectPossibleValues").empty();

        // set empty field in selected start field
        $("#selectOperator").select2("data", {id:"\r",text:"\r"});
        $("#selectPossibleValues").select2("data", {id:"\r",text:"\r"});

        // fill selection bar "Operator"
        for (var i in operators) {
            var option = $("<option>").attr("value", i.toString());
            option.html(translate_operator(operators[i]));
            $("#selectOperator").append(option);
        }

        // fill input field
        fillInputField(contextList.getItem(j));

        // fill parameter selection bar
        fillParameterSelection(contextList.getItem(j).getParameters());
    });
}


function loadContextTabForUnit(unit) {

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
            "id":contextID,
            "text":translate_contextInformation(contextID)
        });
    }
    // get data in multi selection bar
    selectMultiContextInfos.select2("data", array_multiSelectionContextInfos);


    // check if multi selection bar is empty
    if ( jQuery.isEmptyObject($("#selectMultiContextInfos").select2("data")) ) {
        $("#mainContextInfoSAT").hide();
        $("#mainContextInfoSelection").hide();
    } else {
        $("#mainContextInfoSAT").show();
        $("#mainContextInfoSelection").show();
    }
}


// Jobs: - make details in tab "Kontextinformation" visible,
//       - hide main part
//       - get information into the selections and input fields
/**
 * Function gets information into the selection bar and input fields.
 * Furthermore hide main part in tab and show details of context information.
 * */
function showDetailContextInfo(contextDataIndex) {

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
    $("#s2id_selectPossibleValues").css("display", "none");
    $("#divContextParameter").css("display", "none");

    // fill selection "Kontextinformation"
    fillSelectionContextInformation();


    // set event listener for "Bestätigen" button in tab "Kontextinformation"
    $("#btnConfirmContextInfo, #btnConfirmContextInfoSmall").on("click", function() {
        confirmContextInformation(contextDataIndex);
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


// fill input field (value in tab Kontexinformation)
/**
 * Function gets the selected context information and decides which input field has to be set on GUI.
 * @param {Object} ci Contains current context information object.
 * */
function fillInputField(ci) {

    // clear input field caused by removing input field and re-building
    $("#inputContextValue").remove();
    var inputField = $("<input>").addClass("form-control").attr("id", "inputContextValue")
        .attr("onkeyup", "getInputContextValue(this)");
    $("#divContextValue").append(inputField);

    // decide which type of input field is needed
    switch (ci.getType()) {

        case "FLOAT":
        case "INTEGER":
            // activate and show input field and hide selection bar
            $("#inputContextValue").attr("disabled", false);
            $("#inputContextValue").attr("type", "number");
            $("#inputContextValue").css("display", "block");
            $("#selectPossibleValues").css("display", "none");
            $("#s2id_selectPossibleValues").css("display", "none");
            setMinMaxDefault(ci.getMin(), ci.getMax(), ci.getDefault(), $("#inputContextValue"));
            break;

        case "STRING":
            $("#inputContextValue").attr("disabled", false);        // activate input field
            $("#inputContextValue").attr("type", "text");           // set type to text
            $("#inputContextValue").css("display", "block");        // make input field visible
            $("#selectPossibleValues").css("display", "none");      // and selection bar invisible
            $("#s2id_selectPossibleValues").css("display", "none");
            $("#inputContextValue").attr("maxlength", 40);          // set max length to 40
            break;

        case "ENUM":
            $("#inputContextValue").css("display", "none");         // make input field invisible
            $("#selectPossibleValues").css("display", "block");     // and selection bar visible
            $("#s2id_selectPossibleValues").css("display", "block");

            // clear selection
            $("#selectPossibleValues").empty();
            $("#selectPossibleValues").select2("data", {id:"\r",text:"\r"});

            // fill selection bar
            var enums = ci.getEnums();
            for (var i in enums) {
                var option = $("<option>").attr("value", i.toString());
                option.html(translate_possibleValue(enums[i]));

                $("#selectPossibleValues").append(option);
            }
            break;

        case "BOOLEAN":
            $("#selectPossibleValues").css("display", "block");  // make selection bar visible
            $("#s2id_selectPossibleValues").css("display", "block");
            $("#inputContextValue").css("display", "none");      // and input field invisible

            // get the two possible values true and false in selection bar
            var option0 = $("<option>").attr("value", 0);
            var option1 = $("<option>").attr("value", 1);
            option0.html("falsch");
            option1.html("wahr");
            $("#selectPossibleValues").append(option1);
            $("#selectPossibleValues").append(option0);

            break;
    }
}


// get the current needed input fields and selection bars (tab Kontextinformation)
/**
 * Function show all needed input fields and selection bar for the selected context information.
 * @param {Object} cp Contains all existing context parameter.
 * */
function fillParameterSelection(cp) {

    var coordIdentRegex = /CP_.*(LONGITUDE|LATITUDE)/;

    var id, div, child;
    var divContextParams = $("#divContextParameter");
    var divMaps = $("#divMaps");

    // remove all parameter fields from previous editing (except maps div)
    $("#divMapsTemplate").append(divMaps);
    cleanSection("#divContextParameter");

    // iterate through all parameters
    for (var i in cp) {

        var thisParam = cp[i];
        // get each parameter's translated name, type, and all its possible values
        var parameterOriginal = thisParam.getID();
        var parameterTranslation = translate_parameter(parameterOriginal);

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
                $("#" + id).select2("data", {id:"\r",text:"\r"});
                break;

            // type float or integer each need an input field and a specific label
            case "INTEGER":
            case "FLOAT":
                id = "parameter"+i;
                div = createNamedDOMElement("div", "divParameter"+i)
                    .addClass("divParameterInputs")
                    .css("display", "table-cell")
                    .append(createParameterLabelDOM(id, parameterTranslation));
                child = createNamedDOMElement("input", id)
                    .addClass("form-control")
                    .attr("type", "number")
                    .attr("onkeyup", "getParameterInput(this,"+i+")");

                setMinMaxDefault(thisParam.getMin(), thisParam.getMax(), thisParam.getDefault(), child);

                div.append(child);
                divContextParams.append(div);

                // display google maps if coordinates are expected input
                if (coordIdentRegex.test(parameterOriginal)) {
                    divContextParams.append(divMaps);
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
function confirmContextInformation(contextDataIndex) {

    // get current unit's data model
    var current_unit = authorSystemContent.getUnitByUUID(currentUnitUUID);
    // and the information if "all" or "one" context infos must be satisfied
    var sat = current_unit.getSat();
    // get the unit's DOM element
    var unit = $("#"+currentUnitUUID)[0];

    // check if all needed fields were filled with information
    var messageDataObject = checkInformation();
    var missing_content = messageDataObject.errorMessage; // displayed to user if something is missing
    var selectedInfo = messageDataObject.contextData;

    // if content is missing do not accept adding of the context information
    if (missing_content == "Error999") {
        return false;

    } else {

        // if something needed is missing
        if (!!missing_content) {
            alert("[Fehler] Bitte setzen Sie Werte in den folgenden Feldern:\n" + missing_content);
            return false;

        } else {

            // push all new information about the context unit in current scenario
            current_unit.addContextInfo(selectedInfo, contextDataIndex);

            var selectedInfoID = selectedInfo.getID();
            var selectedInfoIconID = selectedInfoID + contextDataIndex;

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
            var selectMultiContextInfos = $("#selectMultiContextInfos");
            selectMultiContextInfos.select2({
                formatSelection: formatMultiContextInfos,
                formatResult: formatMultiContextInfos,
                escapeMarkup: function (m) {
                    return m;
                }
            });

            // get name into multi selection
            //$("#selectMultiContextInfos").append(option);
            array_multiSelectionContextInfos[contextDataIndex] = {id: selectedInfoID, text: contextInfoName};
            selectMultiContextInfos.select2("data", array_multiSelectionContextInfos);

            // change color per option in multi selection bar
            formatMultiContextInfosElements();

            // show main, hide detail
            showMainContextInfo();

            // show SAT and multi selection bar
            $("#mainContextInfoSAT").show();
            $("#mainContextInfoSelection").show();

            //console.log(myAuthorSystem);
            //console.log(JSON.stringify(myAuthorSystem));
        }
    }
}


// get current value from input field
/**
 * Function evaluate the input value and sets too big values to maximum and too small values to minimum.
 * @param {Object} val Contains the current value of the context value input field.
 * */
function getInputContextValue(val) {

    // reduce to big values to maximum
    if ( $("#inputContextValue")[0].hasAttribute("max") ) {
        // get max attribute value
        var max = $("#inputContextValue")[0].getAttribute("max");
        max = parseInt(max);
        if (val.value > max) {
            val.value = max;
        }
    }

    // increase to little values to minimum
    if ( $("#inputContextValue")[0].hasAttribute("min") ) {
        // get min attribute value
        var min = $("#inputContextValue")[0].getAttribute("min");
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
 * */
function getParameterInput(val, num) {

    // reduce too big values to maximum
    if ( $("#inputContextParameter" + num)[0].hasAttribute("max") ) {
        // get max attribute value
        var max = $("#inputContextParameter" + num)[0].getAttribute("max");
        max = parseInt(max);
        if (val.value > max) {
            val.value = max;
        }
    }

    // increase too little values to minimum
    if ( $("#inputContextParameter" + num)[0].hasAttribute("min") ) {
        // get min attribute value
        var min = $("#inputContextParameter" + num)[0].getAttribute("min");
        min = parseInt(min);
        if (val.value < min) {
            val.value = min;
        }
    }

    /* get values from inputs and set the marker on this point in google maps */
    var lat, long;
    // check if latitude is not empty
    if ($("#inputContextParameter1").val()) {
        lat = $("#inputContextParameter1").val();
    }

    // check if longitude is not empty
    if ($("#inputContextParameter2").val()) {
        long = $("#inputContextParameter2").val();
    }

    // only if both inputs have a value set marker
    if ($("#inputContextParameter1").val() && $("#inputContextParameter2").val()) {
        var new_LatLong = new google.maps.LatLng(lat, long);

        // replace old marker and set the new one
        replaceMarker(new_LatLong);

        // conter the map and set zoom factor
        map.setCenter(new_LatLong);
        map.setOptions({zoom: 15});
    }
}


// get the specific color for each context class
/**
 * Function finds specific color of a context class.
 * @param {String} cc Contains a context class.
 * @return {String} Returns the specific color.
 * */
function getColor(cc) {
    switch (cc) {
        case "Lernszenario":
            return "#3287C8";
        case "Persönlich":
            return "#AF46C8";
        case "Situationsbezogen":
            return "#91F52D";
        case "Infrastruktur":
            return "#969696";
        case "Umwelt":
            return "#FADC3C";
        case "Ortung":
            return "#F03C32";
    }
}


// get the color of each context class' label (depending on background color)
function getClassNameColor(classText) {
    // a little bit cumbersome but slightly easier to maintain
    switch (classText) {
        case "Lernszenario":
        case "Persönlich":
        case "Infrastruktur":
        case "Ortung":
            return "white";
        case "Situationsbezogen":
        case "Umwelt":
            return "#555555";
    }
}


// change all colors in multi selection in tab "Kontextinformation"
/**
 * Function changes colors of all selected options in multi selection bar context information.
 * */
function formatMultiContextInfosElements() {

    for (var itemIndex in array_multiSelectionContextInfos) {
        var item = array_multiSelectionContextInfos[itemIndex];

        // get the item's DOM element
        var itemDiv = $("#s2id_selectMultiContextInfos > .select2-choices > .select2-search-choice > div")[itemIndex];
        // get the item's context info ID and translation
        var contextInfoID = item.id;
        var contextInfoTranslation = item.text;

        /* new */
        // add edit icon
        var edit = $("<a>")
            .attr("href", "#")
            .addClass("select2-search-choice-edit")
            .attr("tabindex", -1)
            .attr("title", "Bearbeiten")
            .attr("id", contextInfoID);
        //var icon = $("<b>").addClass("fui-new edit-ci").attr("style", "padding-right: 10px;");
        //edit.append(icon);
        $(itemDiv).parent().append(edit);
        $(itemDiv).parent().hover(
            function() {
                $(itemDiv).css("width", "85px");
            },
            function() {
                var obj = $(itemDiv);
                setTimeout(function() {
                    obj.css("width", "");
                }, 200);
            }
        );

        // add event listeners
        $(".select2-search-choice-edit").on("click", function(e) {
            console.log("edit");

            var something = this;
            var nameContextInfo = $(itemDiv).parent()[0].title;

            for (var l= 0; l<$("#selectContextInfos")[0].length; l++) {
                if ( $("#selectContextInfos")[0][l].text == nameContextInfo ) {
                    $("#selectContextInfos").select2("data", {
                        id:$("#selectContextInfos")[0][l].id,
                        text:$("#selectContextInfos")[0][l].text
                    });
                    break;
                }
            }

            $("#mainContextInfo").hide();
            $("#detailContextInfo").show();

            e.stopPropagation();
        });
        $(".select2-search-choice-close").hover(
            function() {$(itemDiv).attr("title", "Löschen")}
        );
        $(".select2-search-choice-close").on("click", function(e) {
            console.log("delete");
            e.stopPropagation();
        });

        /* end new */

        // get color for first context class
        var firstClassTranslation = translate_contextClass(contextList.getItemByID(contextInfoID).getClasses()[0]);
        var color = getColor(firstClassTranslation);
        $(itemDiv).parent().css("background-color", color);
        // set title --> tooltip if the mouse is on the icon
        $(itemDiv).parent().attr("title", contextInfoTranslation);
    }
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


/**************************tiny little helper******************************/

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