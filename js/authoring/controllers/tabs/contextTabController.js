/**
 * Created by Helena on 06.09.2015.
 */

var counter_multiSelectionContextInfos = 0;
var array_multiSelectionContextInfos = [];

$(function() {
    $("#btnBackToMainContextInfo").on("click", showMainContextInfo);
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

    /* tab "Kontextinformation" */
    // triggered if a context information was selected
    $("#selectContextInfos").select2().on("select2-selecting", function(e) {
        // get index (value) of the selected option
        var j = e.val;
        var selectedInfo = contextList.getItem(j);

        // get the corresponding operators to the selected context information
        var operators = selectedInfo.value.operators;

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
        fillInputField(contextList.getItem(j).value);

        // fill parameter selection bar
        fillParameterSelection(contextList.getItem(j).parameters);
    });
}


function loadContextTabForUnit(unit) {
    // check how much context information are needed to reach SAT
    var ciSAT = $(unit).children("div.unit-icons")[0].getAttribute("ci");
    if (ciSAT == "all") {
        $("#s2id_selectNumberContextInfos").children("a").children("span.select2-chosen").html("Alle");
    } else if (ciSAT == "one") {
        $("#s2id_selectNumberContextInfos").children("a").children("span.select2-chosen").html("Eine");
    }

    // clear multi selection in context info tab
    $("#selectMultiContextInfos").empty();
    $("#selectMultiContextInfos").select2("data", null);
    array_multiSelectionContextInfos = [];

    // change format: add icons to text
    $("#selectMultiContextInfos").select2({
        formatSelection: formatMultiContextInfos,
        formatResult: formatMultiContextInfos,
        escapeMarkup: function(m) {return m;}
    });

    // TODO: Fetch this unit's context info from model, not icons!
    // get data back in multi selection bar from a past edited learning unit
    var array_unitIcons = $(unit).find(".unit-icon");
    for (var n=0; n<array_unitIcons.length; n++) {
        array_multiSelectionContextInfos.push({
            "id":$(array_unitIcons[n]).children("img")[0].getAttribute("ccID"),
            "text":$(array_unitIcons[n]).children("img")[0].title
        });
    }
    // get data in multi selection bar
    $("#selectMultiContextInfos").select2("data", array_multiSelectionContextInfos);

    // check if multi selection bar is empty
    if ( jQuery.isEmptyObject($("#selectMultiContextInfos").select2("data")) ) {
        $("#mainContextInfoSAT").hide();
        $("#mainContextInfoSelection").hide();
    } else {
        $("#mainContextInfoSAT").show();
        $("#mainContextInfoSelection").show();
    }

    // needed to re-color the selections
    changeColorMultiContextInfos();
}



// Jobs: - evaluate the selections and inputs
//       - put context information in multi selection bar
//       - add icons in current unit
function activateContextConfirmation(unit, unitSatisfiesAllContextInfos, current_unit) {

    // button "Best�tigen" in tab "Kontextinformation" was clicked
    $("#btnConfirmContextInfo, #btnConfirmContextInfoSmall").on("click", function() {

        var contextClasses = contextList.getClasses();
        // check if all needed fields were filled with information
        var returnArray = checkInformation();
        var missing_content = returnArray[0]; // displayed to user if something is missing
        var selectedInfo = returnArray[1];

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
                current_unit["contextInformations"].push(selectedInfo);

                // get corresponding context class
                var classIndex = getFirstMatchingClassIndex(contextList.getItem(selectedInfo.id), contextClasses);
                var optgroup = contextClassDictionary[classIndex];
                // get corresponding context class id
                var ccID = contextClasses[classIndex];

                // create icon DOM
                var divContextIcon = $("<div>").addClass("unit-icon").attr("id", ccID + "icon");
                //var icon = $("<img>").attr("src", "img/context-classes/" + optgroup + ".png");
                //icon.attr("width", "15").attr("height", "15").attr("title", e.choice.text).attr("ccID", ccID);

                // get right format for icon visualisation in learning unit
                // case 1: context specific icon
                // case 2: context class icon (upper class icon, only color)
                var icon = formatUnitIcons(selectedInfo, optgroup, ccID);

                // TODO: Icons should be fetched on reload, not saved in JSON file
                /*                    // get icon information in JSON structure
                 for (var j = 0; j < current_unit["contextInformations"].length; j++) {
                 if (current_unit["contextInformations"][j].name == contentContextInfo["text"]) {
                 current_unit["contextInformations"][j].icon = icon;
                 }
                 }*/

                // add icon and div to unit
                divContextIcon.append(icon);
                $(unit).children("div.unit-icons").append(divContextIcon);

                /* design reasons */
                // all SAT needs solid border
                if (unitSatisfiesAllContextInfos) {
                    $(unit).children("div.unit-icons").css("border", "2px solid #adadad");
                    $(unit).children("div.unit-icons").attr("ci", "all");      // ci all = all context informations

                    // one SAT needs dotted border
                } else {
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
                var id = selectedInfo.id;

                // get name
                var contextInfoName = selectedInfo.text;
                var option = $("<option>").attr("value", id.toString()).attr("selected", "selected");
                option.html(contextInfoName);

                // change format: add icons to text
                $("#selectMultiContextInfos").select2({
                    formatSelection: formatMultiContextInfos,
                    formatResult: formatMultiContextInfos,
                    escapeMarkup: function (m) {
                        return m;
                    }
                });

                // get name into multi selection
                //$("#selectMultiContextInfos").append(option);
                array_multiSelectionContextInfos.push({id: id, text: contextInfoName});
                $("#selectMultiContextInfos").select2("data", array_multiSelectionContextInfos);

                // change color per option in multi selection bar
                changeColorMultiContextInfos();

                // increase counter --> needed for continuous ids
                counter_multiSelectionContextInfos++;

                // show main, hide detail
                showMainContextInfo();

                // show SAT and multi selection bar
                $("#mainContextInfoSAT").show();
                $("#mainContextInfoSelection").show();

                //console.log(myAuthorSystem);
                //console.log(JSON.stringify(myAuthorSystem));
            }
        }
    });
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
    cleanSection("#selectParameterTemplate");

    // clean input fields
    $("#formContextInformation")[0].reset();

    // make objects invisible
    $("#selectOperator").css("display", "none");
    $("#inputContextValue").css("display", "none");
    $("#selectPossibleValues").css("display", "none");
    $("#s2id_selectPossibleValues").css("display", "none");
    $("#divContextParameters").css("display", "none");

    // fill selection "Kontextinformation"
    fillSelectionContextInformation();
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
        option.attr("origin", contextItem.name);     // save original name
        option.html(translate_contextInformation(contextItem.name));

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
 * @param {Object} ciValue Contains current context information value details.
 * */
function fillInputField(ciValue) {

    // clear input field caused by removing input field and re-building
    $("#inputContextValue").remove();
    var inputField = $("<input>").addClass("form-control").attr("id", "inputContextValue")
        .attr("onkeyup", "getInputContextValue(this)");
    $("#divContextValue").append(inputField);

    // get {type, min, max, default} of the context information
    var ciAttributes = ciValue.attributes;

    // decide which type of input field is needed
    switch (ciAttributes.type) {

        case "FLOAT":
        case "INTEGER":
            // activate and show input field and hide selection bar
            $("#inputContextValue").attr("disabled", false);
            $("#inputContextValue").attr("type", "number");
            $("#inputContextValue").css("display", "block");
            $("#selectPossibleValues").css("display", "none");
            $("#s2id_selectPossibleValues").css("display", "none");
            setMinMaxDefault(ciAttributes, $("#inputContextValue"));
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
            for (var i in ciValue.enums) {
                var option = $("<option>").attr("value", i.toString());
                option.html(translate_possibleValue(ciValue.enums[i]));

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

    // remove all parameter fields from previous editing
    cleanSection("#divContextParameters");

    // iterate through all parameters
    for (var i in cp) {

        // get each parameter's translated name, type, and all its possible values
        var parameterOriginal = cp[i].id;
        var parameterTranslation = translate_parameter(parameterOriginal);
        var type = cp[i].type;
        var possibleValues = cp[i].values;

        // prepare DOM elements
        var id = "parameter"+i;
        var divContainer = $("#divContextParameters");

        switch (type) {

            // type enum needs a drop down selection for only possible values
            case "ENUM":

                // This does not work properly since select2 does not support dynamically added elements yet.
                // See initContainer() in flat-ui.js --> only gets called on DOM load; does things like addClass "select2-offscreen"
                // For details see: https://github.com/select2/select2/issues/2830

                var div = $("#divParameterSelectionTemplate").clone();
                div.attr("id", "divParameter"+i);
                div.css("display", "block");
                divContainer.append(div);

                var select = $("#divParameter"+i+" select");
                select.attr("id",id);
                // append all possible values
                for (var j in possibleValues) {
                    select.append(new Option(translate_parameterValue(possibleValues[j]), j.toString()));
                }
                break;

            // type float or integer each need an input field and a specific label
            case "INTEGER":
            case "FLOAT":
                var div = $("#divParameterInputTemplate").clone();
                div
                    .attr("id", "divParameter"+i)
                    .addClass("divParameterInputs")
                    .css("display", "table-cell");

                var input = $("#inputParameterTemplate").clone()
                    .attr("id", id)
                    .attr("type", "number")
                    .attr("onkeyup", "getParameterInput(this,"+i+")");
                div.append(input);
                setMinMaxDefault(possibleValues[0], input);
                $("#divContextParameters").append(div);

                // display google maps if coordinates are expected input
                if (coordIdentRegex.test(parameterOriginal)) {
                    $("#divMaps").css("display", "block");
                    $("#divContextParameters").append($("#divMaps"));
                    resizeMap();
                }
                break;

            // type string needs an input field and a specific label
            case "STRING":
                div.css("display", "block");
                div.append($("#inputParameterTemplate").clone()
                    .attr("id", id)
                    .attr("type", "text"));
                $("#divContextParameters").append(div);
                break;
        }

        // update parameter label
        $("#divParameter"+i+" label").attr("for", id).html(parameterTranslation);
        // show context parameter section
        $("#divContextParameters").css("display", "block");
    }
}


// set minima and maxima if needed in input fields in tab "Kontextinformation"
/**
 * Function set minimum and maximum values for an input field.
 * @param {Array} values Contains minimum and maximum values.
 * @param {Object} inputField Contains an input field.
 * */
function setMinMaxDefault(values, inputField) {

    if (values == undefined)
        return;

    var min = (values.min != undefined) ? values.min : false;
    var max = (values.max != undefined) ? values.max : false;
    var def = (values.default != undefined) ? values.default : false;

    if (min) {
        inputField.attr("min", min);
    }
    if (max) {
        inputField.attr("max", max);
    }
    if (def) {
        inputField.attr("value", def);
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
        case "Pers�nlich":
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
        case "Pers�nlich":
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
function changeColorMultiContextInfos() {

    // get all names from selected options
    var name = $("#s2id_selectMultiContextInfos > .select2-choices > .select2-search-choice > div");
    $(name).each(function() {

        // iterate over all multi selections
        for (var i=0; i<array_multiSelectionContextInfos.length; i++) {

            // get id
            var thisID = array_multiSelectionContextInfos[i]["id"];

            // needed to prevent failure, if no img exist
            var title;
            if ($(this).children("img").length != 0) {
                // get context information title
                title = $(this).children("img")[0].title;
            }

            /* new */
            // add edit icon
            var edit = $("<a>")
                .attr("href", "#")
                .addClass("select2-search-choice-edit")
                .attr("tabindex", -1)
                .attr("title", "Bearbeiten")
                .attr("id", thisID);
            //var icon = $("<b>").addClass("fui-new edit-ci").attr("style", "padding-right: 10px;");
            //edit.append(icon);
            $(this).parent().append(edit);

            $(this).parent().hover(
                function() { $(this).css("width", "85px"); },
                function() { var obj = $(this);
                    setTimeout(function() { obj.css("width", ""); }, 200);
                }
            );

            // add event listeners
            $(".select2-search-choice-edit").on("click", function(e) {
                console.log("edit");

                var nameContextInfo = $(this).parent()[0].title;
                var operator, value, parameter1, parameter2, input1, input2, inputString;

                /*      for (var i=0; i<myAuthorSystem.length; i++) {
                 if ( myAuthorSystem[i].name == $("#lname")[0].innerText ) {
                 for (var j=0; j<myAuthorSystem[i]["units"].length; j++) {
                 if ( myAuthorSystem[i]["units"][j].name == global_currentInputUnitName ) {
                 for (var k=0; k<myAuthorSystem[i]["units"][j]["contextInformations"].length; k++) {
                 if ( myAuthorSystem[i]["units"][j]["contextInformations"][k].name == nameContextInfo ) {
                 operator = myAuthorSystem[i]["units"][j]["contextInformations"][k].operator;
                 if (myAuthorSystem[i]["units"][j]["contextInformations"][k].value) {
                 value = myAuthorSystem[i]["units"][j]["contextInformations"][k].value }
                 if (myAuthorSystem[i]["units"][j]["contextInformations"][k].parameter1) {
                 parameter1 = myAuthorSystem[i]["units"][j]["contextInformations"][k].parameter1 }
                 if (myAuthorSystem[i]["units"][j]["contextInformations"][k].parameter2) {
                 parameter2 = myAuthorSystem[i]["units"][j]["contextInformations"][k].parameter2 }
                 if (myAuthorSystem[i]["units"][j]["contextInformations"][k].input1) {
                 input1 = myAuthorSystem[i]["units"][j]["contextInformations"][k].input1 }
                 if (myAuthorSystem[i]["units"][j]["contextInformations"][k].input2) {
                 input2 = myAuthorSystem[i]["units"][j]["contextInformations"][k].input2 }
                 if (myAuthorSystem[i]["units"][j]["contextInformations"][k].inputString) {
                 inputString = myAuthorSystem[i]["units"][j]["contextInformations"][k].inputString }
                 break;
                 }
                 }
                 }
                 }

                 }
                 }*/

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
            $(".select2-search-choice-close").on("click", function(e) {
                console.log("delete");
                e.stopPropagation();
            });
            $(".select2-search-choice-close").hover(
                function() {$(this).attr("title", "L�schen")}
            );

            /* end new */

            // find right one
            if (array_multiSelectionContextInfos[i]["text"] == this.innerHTML ||    // text
                array_multiSelectionContextInfos[i]["text"] == title) {             // icon

                // get color for first context class
                var firstClassTranslation = translate_contextClass(contextList.getItem(thisID).classes[0]);
                var color = getColor(firstClassTranslation);
                $(this).parent().css("background-color", color);

                // set title --> tooltip if the mouse is on the icon
                $(this).parent().attr("title", title);

                break;
            }
        }
    });
}

// search for this context info's classes in a list of classes and return first match
function getFirstMatchingClassIndex(contextItem, contextClasses) {
    var classIndex;
    for (var k in contextItem.classes) {
        classIndex = contextClasses.indexOf(contextItem.classes[k]);
        if (classIndex != -1)
            break;
    }
    return classIndex;
}