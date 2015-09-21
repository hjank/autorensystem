/**
 * Created by Helena on 06.09.2015.
 */

var counter_multiSelectionContextInfos = 0;
var array_multiSelectionContextInfos = [];


// fill selection bars in tab "Kontextinformation"
/**
 * Function sets a event listener for selection bar context information after parsing is finished.
 * In this listener all selections and input fields were filled.
 * Furthermore the meta data selection bar is also filled with information.
 * */
function fillContextTab() {

    /* tab "Kontextinformation" */
    // triggered if a context information was selected
    $("#selectContextInfos").select2().on("select2-selecting", function(e) {
        // get index (value) of the selected option
        var j = e.val;

        // get the corresponding operators to the selected context information
        var operators = array_ContextInformations[j][2][1];

        // clear selection bar
        $("#selectOperator").empty();
        $("#selectPossibleValues").empty();

        // set empty field in selected start field
        $("#selectOperator").select2("data", {id:"\r",text:"\r"});
        $("#selectPossibleValues").select2("data", {id:"\r",text:"\r"});

        // fill selection bar "Operator"
        for (var i=0; i<operators.length; i++) {
            var option = $("<option>").attr("value", i.toString());
            option.html(operators[i]["translation"]);
            option.attr("origin", operators[i]["original"]);
            $("#selectOperator").append(option);
        }

        // fill input field
        fillInputField(array_ContextInformations[j][2]);

        // fill parameter selection bar
        fillParameterSelection(array_ContextInformations[j][3]);
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
    cleanSection("#selectParameter");
    cleanSection("#selectParameter2");

    // clean input fields
    $("#formContextInformation")[0].reset();

    // make objects invisible
    $("#inputContextValue").css("display", "none");
    $("#selectPossibleValues").css("display", "none");
    $("#s2id_selectPossibleValues").css("display", "none");
    $("#divContextParameter").css("display", "none");

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

    // iterate through all context classes
    for (var j=0; j<array_ContextClasses.length; j++) {
        var classname = array_ContextClasses[j];
        var optgroup = $("<optgroup>").attr("label", classname);
        array_optgroups.push(optgroup);
    }

    // iterate through all context information
    for (var i=0; i<array_ContextInformations.length; i++) {
        // create option DOM and add the context information
        var option = $("<option>").attr("value", i.toString());
        option.attr("origin", array_ContextInformations[i][0]["original"]);     // save original name
        option.html(array_ContextInformations[i][0]["translation"]);

        // find right context class and put it in this optgroup
        for (var k=0; k<array_ContextClasses.length; k++) {
            if (array_ContextInformations[i][1][0]["translation"] == array_ContextClasses[k]) {
                array_optgroups[k].append(option);
                break;
            }
        }
    }

    // change color of all context classes if selection bar "Kontextinformation" is opening
    $("#selectContextInfos").select2().on("select2-open", function() {
        $(".select2-results").children("li").children("div.select2-result-label").each(function() {
            // for all context classes set a specific color
            if ( $(this)[0].textContent == "Lernszenario" ) {
                $(this).css("background-color", "#3287C8");
                $(this).css("color", "white");
            } else if ( $(this)[0].textContent == "Persönlich" ) {
                $(this).css("background-color", "#AF46C8");
                $(this).css("color", "white");
            } else if ( $(this)[0].textContent == "Situationsbezogen" ) {
                $(this).css("background-color", "#91F52D");
                $(this).css("color", "#555555");
            } else if ( $(this)[0].textContent == "Infrastruktur" ) {
                $(this).css("background-color", "#969696");
                $(this).css("color", "white");
            } else if ( $(this)[0].textContent == "Umwelt" ) {
                $(this).css("background-color", "#FADC3C");
                $(this).css("color", "#555555");
            } else if ( $(this)[0].textContent == "Ortung" ) {
                $(this).css("background-color", "#F03C32");
                $(this).css("color", "white");
            }
        });
    });

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
 * @param {Object} ci Contains current context information.
 * */
function fillInputField(ci) {

    // clear input field caused by removing input field and re-building
    $("#inputContextValue").remove();
    var inputField = $("<input>").addClass("form-control").attr("id", "inputContextValue")
        .attr("onkeyup", "getInputContextValue(this)");
    $("#divContextValue").append(inputField);

    // get type of the context information
    var type = ci[0][0]["type"];   // float, integer, string, enum, boolean

    // decide which type of input field is needed
    switch (type) {
        case "FLOAT":
        case "INTEGER":
            configureInputContextValueForFloatInt(ci[0]);
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
            for (var i=0; i<ci[2].length; i++) {
                var option = $("<option>").attr("value", i.toString());
                option.html(ci[2][i]);
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

    // clear selection bar
    $("#selectParameter").empty();
    $("#selectParameter2").empty();

    // set empty field in selected start field
    $("#selectParameter").select2("data", {id:"\r",text:"\r"});
    $("#selectParameter2").select2("data", {id:"\r",text:"\r"});

    // clear input fields caused by removing input fields and re-building
    $("#inputContextParameter1").remove();
    $("#inputContextParameter2").remove();
    $("#inputParameterString").remove();
    var inputField = $("<input>").addClass("form-control").attr("id", "inputContextParameter1")
        .attr("type", "number").attr("onkeyup", "getParameterInput(this,1)");
    var inputField2 = $("<input>").addClass("form-control").attr("id", "inputContextParameter2")
        .attr("type", "number").attr("onkeyup", "getParameterInput(this,2)");
    var inputField3 = $("<input>").addClass("form-control").attr("id", "inputParameterString");
    $("#divParameterInput1").append(inputField);
    $("#divParameterInput2").append(inputField2);
    $("#divParameterString").append(inputField3);

    // set all parameter fields invisible
    $("#divContextParameter > div").css("display", "none");

    // cp[i][0] = parameter name
    // cp[i][1] = type (enum, string, float, integer)
    // cp[i][2] = possible values

    // iterate through all parameters
    for (var i=0; i<cp.length; i++) {

        // get each parameter's translated name, type, and all its possible values
        var parameterTranslation = cp[i][0]["translation"];
        var parameterOriginal = cp[i][0]["original"];
        var type = cp[i][1];
        var possibleValues = cp[i][2];

        switch (type) {

            // type enum needs a drop down selection for only possible values
            case "ENUM":

                // get all possible values
                for (var j=0; j<possibleValues.length; j++) {
                    var option = $("<option>").attr("value", j.toString());
                    option.html(possibleValues[j]["translation"]);
                    option.attr("origin", possibleValues[j]["original"]);

                    // needed if first selection is already existing
                    if ( $("#divParameterSelection1").css("display") == "block" ) {
                        // append possible values
                        $("#selectParameter2").append(option);

                        // add specific label to selection
                        $("#divParameterSelection2").children("label").html(parameterTranslation);
                        $("#divParameterSelection2").children("label").attr("origin", parameterOriginal);

                        // make selection visible
                        $("#divParameterSelection2").css("display", "block");

                    } else {
                        // append possible values
                        $("#selectParameter").append(option);

                        // add specific label to selection
                        $("#divParameterSelection1").children("label").html(parameterTranslation);
                        $("#divParameterSelection1").children("label").attr("origin", parameterOriginal);
                    }
                }
                // make selection visible
                $("#divParameterSelection1").css("display", "block");
                break;

            // type float needs one/two input fields and a specific label
            case "FLOAT":
                if ( $("#divParameterInput1").css("display") == "table-cell" ) {
                    $("#divParameterInput2").css("display", "table-cell");
                    $("#divParameterInput2").children("label").html(parameterTranslation);
                    $("#divParameterInput2").children("label").attr("origin", parameterOriginal);
                    setMinMax(possibleValues, $("#inputContextParameter2"));

                    // display google maps
                    $("#divMaps").css("display", "block");
                    resizeMap();

                } else {
                    $("#divParameterInput1").css("display", "table-cell");
                    $("#divParameterInput1").children("label").html(parameterTranslation);
                    $("#divParameterInput1").children("label").attr("origin", parameterOriginal);
                    setMinMax(possibleValues, $("#inputContextParameter1"));
                }
                break;

            // type integer needs one/two input fields and a specific label
            case "INTEGER":
                if ( $("#divParameterInput1").css("display") == "table-cell" ) {
                    $("#divParameterInput2").css("display", "table-cell");
                    $("#divParameterInput2").children("label").html(parameterTranslation);
                    $("#divParameterInput2").children("label").attr("origin", parameterOriginal);

                } else {
                    $("#divParameterInput1").css("display", "table-cell");
                    $("#divParameterInput1").children("label").html(parameterTranslation);
                    $("#divParameterInput1").children("label").attr("origin", parameterOriginal);
                }
                break;

            // type string needs an input field and a specific label
            case "STRING":
                $("#divParameterString").css("display", "block");
                $("#divParameterString").children("label").html(parameterTranslation);
                $("#divParameterString").children("label").attr("origin", parameterOriginal);
                break;

        }
        // show context parameter section
        $("#divContextParameter").css("display", "block");
    }
}


// set the need functionalities into the input field for float and integer values
/**
 * Function shows an input field an set minimum, maximum and default values if needed.
 * @param {Object} ci Contains current context information.
 * */
function configureInputContextValueForFloatInt(ci) {

    var min, max, def = null;

    // activate and show input field and hide selection bar
    $("#inputContextValue").attr("disabled", false);
    $("#inputContextValue").attr("type", "number");
    $("#inputContextValue").css("display", "block");
    $("#selectPossibleValues").css("display", "none");
    $("#s2id_selectPossibleValues").css("display", "none");

    for (var i=1; i<ci.length; i++) {

        // find minimum if given
        if (ci[i]["min"]) {
            min = ci[i]["min"];
        }
        // find maximum if given
        if (ci[i]["max"]) {
            max = ci[i]["max"];
        }
        // find default value if given
        if (ci[i]["default"]) {
            def = ci[i]["default"];

            // set default value in input field
            $("#inputContextValue").attr("value", def);
        }
    }

    // set minimum and maximum in input field
    if (min && max) {
        $("#inputContextValue").attr("min", min).attr("max", max);
    }
    // set minimum only
    if (min && !max) {
        $("#inputContextValue").attr("min", min);
    }
    // set maximum only
    if (!min && max) {
        $("#inputContextValue").attr("max", max);
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

    // reduce to big values to maximum
    if ( $("#inputContextParameter" + num)[0].hasAttribute("max") ) {
        // get max attribute value
        var max = $("#inputContextParameter" + num)[0].getAttribute("max");
        max = parseInt(max);
        if (val.value > max) {
            val.value = max;
        }
    }

    // increase to little values to minimum
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
        replaceMarker2(new_LatLong);

        // conter the map and set zoom factor
        map.setCenter(new_LatLong);
        map.setOptions({zoom: 15});
    }
}


// cleans selection bars
/**
 * Function cleans a selection bar.
 * @param {String} s Contains a selection bar id.
 * */
function cleanSection(s) {
    $(s).empty();
    $(s).select2("data", {id:"\r",text:"\r"});
}


// if home or confirm button is clicked change view
/**
 * Function changes view of context information tab from detail view to main view.
 * */
function showMainContextInfo() {
    // show main, hide detail
    $("#mainContextInfo").slideDown();
    $("#detailContextInfo").slideUp();
}



// get the specific color for each context class
/**
 * Function finds specific color of a context class.
 * @param {String} cc Contains a context class.
 * @return {String} Returns the specific color.
 * */
function getColor(cc) {
    var color;

    switch (cc) {
        case "Lernszenario":
            color = "#3287C8";
            break;
        case "Persönlich":
            color = "#AF46C8";
            break;
        case "Situationsbezogen":
            color = "#91F52D";
            break;
        case "Infrastruktur":
            color = "#969696";
            break;
        case "Umwelt":
            color = "#FADC3C";
            break;
        case "Ortung":
            color = "#F03C32";
            break;
    }
    return color;
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
                function() {$(this).attr("title", "Löschen")}
            );

            /* end new */

            // find right one
            if (array_multiSelectionContextInfos[i]["text"] == this.innerHTML ||    // text
                array_multiSelectionContextInfos[i]["text"] == title) {             // icon

                // get first context class
                var contextClass = array_ContextInformations[thisID][1][0]["translation"];

                // get specific context class color
                var color = getColor(contextClass);
                $(this).parent().css("background-color", color);

                // set title --> tooltip if the mouse is on the icon
                $(this).parent().attr("title", title);

                break;
            }
        }
    });
}

