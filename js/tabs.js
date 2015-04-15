/**
 * Created by juliushofler on 30.03.15.
 */

var global_currentInputUnitName = "";
//var counter_parameter = 0;
//var counter_parElem = 0;
var list_units = [];
var counter_multiSelectionContextInfos = 0;
var array_multiSelectionContextInfos = [];
var array_multiSelectionMetaData = [];
var counter_multiSelectionMetaData = 0;

$(function() {

    /* create parameter dropdown selection */
    /*var divParameter = $("<div>").attr("style", "margin: -15px 0 0 15px");
    divParameter.attr("id", "divPar");
    var labelParameter = $("<label>").addClass("label-tabs label");
    labelParameter.attr("id", "labelPar");
    labelParameter.html("Parameter");
    var arrayParameter = ["Parameter 1", "Parameter 2", "Parameter 3", "Parameter 4"]

    // triggered if parameter addition is clicked in tab "Kontextinformation"
    $(".parameter-add").on("click", function() {

        // build selection container
        var selectParameter = $("<select>").addClass("form-control select select-primary select-block mbl");
        selectParameter.attr("id", "selPar" + counter_parElem);
        selectParameter.attr("style", "min-width: 120px;");
        var aParameter = $("<a>").addClass("parameter-close").attr("href", "#");
        aParameter.attr("id", "aPar" + counter_parElem);
        var spanParameter = $("<span>").addClass("fui-cross-circle");

        // boundary of parameter creation
        if (counter_parameter < 5) {

            // at the beginning a div and label are also created
            if (counter_parameter == 0) {

                divParameter.append(labelParameter);
                aParameter.append(spanParameter);

                // get values from the parameter array
                for (var i=0; i<arrayParameter.length; i++) {
                    var optionParameter = $("<option>").attr("value", i);
                    optionParameter.html(arrayParameter[i]);
                    selectParameter.append(optionParameter);
                }

                divParameter.append(selectParameter);
                divParameter.append(aParameter);
                $("#contextSelection").append(divParameter);
                selectParameter.select2();

                // same as above but without div and label creation
            } else {

                for (var i=0; i<arrayParameter.length; i++) {
                    var optionParameter = $("<option>").attr("value", i);
                    optionParameter.html(arrayParameter[i]);
                    selectParameter.append(optionParameter);
                }

                aParameter.append(spanParameter);
                divParameter.append(selectParameter);
                divParameter.append(aParameter);
                selectParameter.select2();
            }

            // activate parameter deletion button function
            activateDeleteParameter(counter_parElem);
            counter_parameter++;
            counter_parElem++;
            $(".parameter-add").css("color", "#666");

        } else {
            alert("Es können keine weiteren Parameter hinzugefüht werden!");
        }

    });*/
    /* END parameter dropdown selection */


    /*$("#selectMetaData").empty();
    $("#selectMetaData").select2("data", {id:"\r",text:"\r"});*/
});

// get name into tab properties
function activateFunctionalities(newState) {

    var id = newState[0].getAttribute("id");
    var unit = document.getElementById(id);
    var name = "";

    // get newState id in unit list
    list_units.push(unit);

    // triggered if learning unit is clicked
    $(unit).click(function(event) {

        // clear marking
        for (var l=0; l<list_units.length; l++) {
            $(list_units[l]).css("background", "");
            $(list_units[l]).css("color", "");
        }

        // unit is marked --> change color
        $(unit).css("background", "#16a085");
        $(unit).css("color", "white");

        /* input field in tab "Eigenschaften"*/
        // get name of the unit
        if ($(unit).children("div").hasClass("title")) {
            name = (this).innerText.replace(/(\r\n|\n|\r)/gm,"");
        }

        // put name into the input field
        var formObject = document.forms["formProperties"];
        formObject.elements["unitName"].value = name;
        global_currentInputUnitName = name;

        /* tab "Kontextinformation" */

        /* multi selection bar in tab "Metadaten" */
        // clear multi selection in meta data tab
        $("#selectMultiMetaData").empty();
        $("#selectMultiMetaData").select2("data", null);
        array_multiSelectionMetaData = [];

        // get data back in multi selection bar from a past edited learning unit
        var array_icons = $(unit).find(".unit-meta-icons");
        for (var j=0; j<array_icons.length; j++) {
            array_multiSelectionMetaData.push({"id":j, "text":$(array_icons[j])[0].title});
        }
        $("#selectMultiMetaData").select2("data", array_multiSelectionMetaData);

        // prevents that underlying container is also clicked (needed for unit marking)
        event.stopPropagation();
    });

    // triggered if string is changed in input field
    $("#inputUnitName").bind("input", function() {
        var val = $(this).val();

        // change unit name if his corresponding input field is changing
        if (name == global_currentInputUnitName) {
            $(unit).children("div.title")[0].innerText = val;
            name = $(unit).children("div.title")[0].innerText;
            global_currentInputUnitName = val;
        }
    });

    // triggered if an option in selection "Kontextinformation" was selected
    $("#selectContextInfos").select2().on("select2-selecting", function(e) {

        var selElem = e.object.element[0];
        var optgroup = $(selElem).parent()[0].label;

        if (name == global_currentInputUnitName) {
            var divContextIcon = $("<div>").addClass("unit-icon").attr("id", id + "icon");
            var icon = $("<img>").attr("src", "img/context-classes/" + optgroup + ".png");
            icon.attr("width", "15").attr("height", "15").attr("title", e.choice.text);

            // check whether the unit has an icon already
            /*if ($(unit).find("div.unit-icons").length) {
                $(unit).find("div.unit-icons").remove();
                divContextIcon.append(icon);
                $(unit).append(divContextIcon);

                // no icon exists
            } else {*/

            // add icon und div to unit
            divContextIcon.append(icon);
            $(unit).children("div.unit-icons").append(divContextIcon);

            // design reasons
            $(unit).css("padding-top", "10px");
            $(unit).children("div.unit-icons").css("height", "21px");
            $(unit).children("div.unit-icons").css("border", "1px solid #34495e");
            $(unit).children("div.unit-icons").css("border-radius", "4px");
            $(unit).children("div.unit-icons").css("display", "inline-block");
            //}
        }
    });

    // triggered if an option in selection "Operator" was selected
    $("#selectOperator").select2().on("select2-selecting", function(e) {
        //alert("Text:" + e.choice.text + " Value:" + e.val);
    });

    // triggered if an option in selection "Metadaten" was seleceted
    $("#selectMetaData").select2().on("select2-selecting", function(e) {

        if (name == global_currentInputUnitName) {

            // no two same meta data symbols allowed
            for (var i = 0; i < array_multiSelectionMetaData.length; i++) {
                if (array_multiSelectionMetaData[i]["text"] == e.choice.text) {
                    return true;
                }
            }

            var divMetaIcon = $("<div>").addClass("unit-meta-icons").attr("id", counter_multiSelectionMetaData + "metaIcon");

            // choose icon symbol
            var metaIcon;
            switch (e.choice.text) {
                case "Bild":
                    metaIcon = "fui-photo";
                    divMetaIcon.attr("title", e.choice.text);
                    break;
                case "Film":
                    metaIcon = "fui-video";
                    divMetaIcon.attr("title", e.choice.text);
                    break;
                case "Text":
                    metaIcon = "fui-document";
                    divMetaIcon.attr("title", e.choice.text);
                    break;
                case "Navigation":
                    metaIcon = "fui-location";
                    divMetaIcon.attr("title", e.choice.text);
                    break;
                case "Test":
                    metaIcon = "fui-radio-unchecked";
                    divMetaIcon.attr("title", e.choice.text);
                    break;
                case "Audio":
                    metaIcon = "fui-volume";
                    divMetaIcon.attr("title", e.choice.text);
                    break;
            }

            var bMetaIcon = $("<b>").addClass(metaIcon);

            // get icon in learning unit
            divMetaIcon.append(bMetaIcon);
            $(unit).append(divMetaIcon);

            // change size of learning unit
            //if (counter_multiSelectionMetaData == 0) {
            $(unit).css("padding-bottom", "5px");
            //}

            // clear multi selection bar
            $("#selectMultiMetaData").empty();
            $("#selectMultiMetaData").select2("data", null);

            // get meta data in multi selection bar
            array_multiSelectionMetaData.push({"id": counter_multiSelectionMetaData, "text": e.choice.text});
            $("#selectMultiMetaData").select2({
                formatSelection: formatMultiMetaData,
                escapeMarkup: function(m) {return m;}
            });
            $("#selectMultiMetaData").select2("data", array_multiSelectionMetaData);

            counter_multiSelectionMetaData ++;
        }
    });

    // remove option from multi selection bar
    //$("#selectMultiMetaData").select2().on("select2-removed", function(e) {

    //});

    // resets the glyphs in selection bar
    $("#selectMetaData").select2({
        formatSelection: formatMetaData,
        formatResult: formatMetaData,
        escapeMarkup: function(m) {return m;}
    });
}

// change shown format in multi selection bar in "Metadaten"
function formatMultiMetaData(item) {

    switch (item.text) {
        case "Bild":
            return '<b class="fui-photo"></b>';
        case "Film":
            return '<b class="fui-video"></b>';
        case "Text":
            return '<b class="fui-document"></b>';
        case "Navigation":
            return '<b class="fui-location"></b>';
        case "Test":
            return '<b class="fui-radio-unchecked"></b>';
        case "Audio":
            return '<b class="fui-volume"></b>';
    }
}

// change shown format in selection bar in "Metadaten"
function formatMetaData(item) {

    switch (item.text) {
        case "Bild":
            return '<b class="fui-photo"> </b>' + item.text;
        case "Film":
            return '<b class="fui-video"> </b> ' + item.text;
        case "Text":
            return '<b class="fui-document"> </b>' + item.text;
        case "Navigation":
            return '<b class="fui-location"> </b> ' + item.text;
        case "Test":
            return '<b class="fui-radio-unchecked"> </b> ' + item.text;
        case "Audio":
            return '<b class="fui-volume"> </b>' + item.text;
    }
}

// needed to get event handling on parameter deletion button
/*function activateDeleteParameter(paraElem) {

    // triggered if deletion button is clicked
    $("#aPar" + paraElem).on("click", function() {

        // get parameter id
        var id = $(this)[0].getAttribute("id");

        // get last character from id
        var nr = id.slice(-1);

        // remove parameter selection and delete button
        $("#selPar" + nr).select2("destroy");
        $("#selPar" + nr).remove();
        $(this).remove();

        counter_parameter--;

        // if all parameters are deleted, parameter div and label will be deleted too
        if (counter_parameter == 0) {
            $("#divPar").remove();
            $("#labelPar").remove();
        }

    });

    $("#selPar" + paraElem).select2().on("select2-selecting", function(e) {
        alert("Text:" + e.choice.text + " Value:" + e.val);
    });

}*/

// fill selection bars in tab "Kontextinformation"
function parsingFinished() {

    // triggered if one option was selected ("Eine" or "Alle")
    $("#selectNumberContextInfos").select2().on("select2-selecting", function(e) {

        // show the detailed information for the context information (1 == "Eine")
        if (e.val == 1) {
            $("#detailContextInfo").slideDown();

            // clear multi-selection
            $("#selectMultiContextInfos").empty();
            $("#selectMultiContextInfos").select2("data", null);
            array_multiSelectionContextInfos = [];

            /* add context information in selction bar */
            // clean selections
            $("#selectContextInfos").empty();
            $("#selectContextInfos").select2("data", {id:"\r",text:"\r"});
            $("#selectOperator").empty();
            $("#selectOperator").select2("data", {id:"\r",text:"\r"});

            /* fill selection "Kontextinformation" */
            fillSelectionContextInformation();

        }
        // hide the detailed information for the context information (0 == "Alle")
        if (e.val == 0) {
            $("#detailContextInfo").slideUp();

            // clear multi-selection
            $("#selectMultiContextInfos").empty();
            $("#selectMultiContextInfos").select2("data", null);

            // put all given context informations into the multi-selection
            var array_multiContextInfos = [];
            for (var i=0; i<array_ContextInformations.length; i++) {
                var option = $("<option>").attr("value", i.toString()).attr("selected", "selected");
                option.html(array_ContextInformations[i][0]);
                $("#selectMultiContextInfos").append(option);
                array_multiContextInfos.push({id:i, text:array_ContextInformations[i][0]})
            }
            $("#selectMultiContextInfos").select2("data", array_multiContextInfos);
        }
    });

    // re-change the colors of the multi selection in context information
    /*$('#selectMultiContextInfos').select2().on("change", function(e) {
        $("#s2id_selectMultiContextInfos > .select2-choices > .select2-search-choice > div").each(function() {
            changeColorMultiContextInfos(this);
        });
    });*/

    // change the colors of the multi selection in context information to custom colors
    /*$("#s2id_selectMultiContextInfos > .select2-choices > .select2-search-choice > div").each(function() {
        changeColorMultiContextInfos(this);
    });*/


    // triggered if context information was selected
    $("#selectContextInfos").select2().on("select2-selecting", function(e) {
        var j = e.val;
        var operators = array_ContextInformations[j][2][1];

        // clear selection bar
        $("#selectOperator").empty();

        // set empty field in selected start field
        $("#selectOperator").select2("data", {id:"\r",text:"\r"});

        // fill selection bar "Operator"
        for (var i=0; i<operators.length; i++) {
            var option = $("<option>").attr("value", i.toString());
            option.html(operators[i]);
            $("#selectOperator").append(option);
        }

        // fill input field
        fillInputField(array_ContextInformations[j][2]);

        // fill parameter selection bar
        fillParameterSelection(array_ContextInformations[j][3]);
    });

    /* 3.tab "Metadaten" */
    var array_SelectionMetaData = ["Bild", "Film", "Text", "Navigation", "Test", "Audio"];

    for (var i=0; i<array_SelectionMetaData.length; i++) {
        var option = $("<option>").attr("value", i.toString());
        option.html(array_SelectionMetaData[i]);
        $("#selectMetaData").append(option);
    }
    $("#selectMetaData").select2({
        formatSelection: formatMetaData,
        formatResult: formatMetaData,
        escapeMarkup: function(m) {return m;}
    });
}

// fill selection bar "Kontextinformation"
function fillSelectionContextInformation() {

    var array_optgroups = [];

    // iterate through all context classes
    for (var j=0; j<array_ContextClasses.length; j++) {
        var classname = array_ContextClasses[j];
        var optgroup = $("<optgroup>").attr("label", classname);
        array_optgroups.push(optgroup);
    }

    // iterate through all context informations
    for (var i=0; i<array_ContextInformations.length; i++) {
        var option = $("<option>").attr("value", i.toString());
        option.html(array_ContextInformations[i][0]);

        // find right context class and put it in this optgroup
        for (var k=0; k<array_ContextClasses.length; k++) {
            if (array_ContextInformations[i][1][0] == array_ContextClasses[k]) {
                array_optgroups[k].append(option);
                break;
            }
        }

        //$("#selectContextInfos").append(option);
    }

    // append optgroups and included options in selection bar "Kontextinformation"
    for (var l=0; l<array_optgroups.length; l++) {
        $("#selectContextInfos").append(array_optgroups[l]);
    }
}

// fill input field (value in tab Kontexinformation)
function fillInputField(ci) {

    // clear input field caused by removing input field and re-building
    $("#inputContextValue").remove();
    var inputField = $("<input>").addClass("form-control").attr("id", "inputContextValue")
        .attr("onkeyup", "getInputContextValue(this)");
    $("#divContextValue").append(inputField);

    var type = ci[0][0]["type"];   // float, integer, string, enum, boolean

    switch (type) {

        case "FLOAT":
            configureInputContextValueForFloatInt(ci[0]);
            break;

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
            $("#inputContextValue").attr("disabled", true);         // disable input field
            $("#inputContextValue").css("display", "block");        // make input field visible
            $("#selectPossibleValues").css("display", "none");      // and selection bar invisible
            $("#s2id_selectPossibleValues").css("display", "none");
            break;

    }

}

// set the need functionalities into the input field for float and integer values
function configureInputContextValueForFloatInt(ci) {

    var min, max, def = null;
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
        //$("#inputContextValue").attr("pattern", ".{" + min + "," + max + "}");
        $("#inputContextValue").attr("min", min).attr("max", max);
    }
    if (min &&  !max) {
        $("#inputContextValue").attr("min", min);
    }
    if (!min && max) {
        $("#inputContextValue").attr("max", max);
    }
}

// get current value from input field
function getInputContextValue(val) {

    // reduce to big values to maximum
    if ( $("#inputContextValue")[0].hasAttribute("max") ) {
        var max = $("#inputContextValue")[0].getAttribute("max");
        max = parseInt(max);
        if (val.value > max) {
            val.value = max;
        }
    }

    // increase to little values to minimum
    if ( $("#inputContextValue")[0].hasAttribute("min") ) {
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

// get the current needed input fields and selection bars (tab Kontextinformation)
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

    //console.log(cp);
    // cp[i][0] = parameter name
    // cp[i][1] = type (enum, string, float, integer)
    // cp[i][2] = possible values

    // iterate through all parameters
    for (var i=0; i<cp.length; i++) {

        // get the current type
        var type = cp[i][1];

        switch (type) {

            // type enum needs a dropdown selection for only possible values
            case "ENUM":

                // get all possible values
                for (var j=0; j<cp[i][2].length; j++) {
                    var option = $("<option>").attr("value", j.toString());
                    option.html(cp[i][2][j]);

                    // needed if first seletion is already existing
                    if ( $("#divParameterSelection1").css("display") == "block" ) {
                        // append possible values
                        $("#selectParameter2").append(option);

                        // add specific label to selection
                        $("#divParameterSelection2").children("label").html(cp[i][0]);

                        // make selection visible
                        $("#divParameterSelection2").css("display", "block");

                    } else {
                        // append possible values
                        $("#selectParameter").append(option);

                        // add specific label to selection
                        $("#divParameterSelection1").children("label").html(cp[i][0]);
                    }
                }
                // make selection visible
                $("#divParameterSelection1").css("display", "block");
                break;

            // type float needs one/two input fields and a label
            case "FLOAT":
                if ( $("#divParameterInput1").css("display") == "table-cell" ) {
                    $("#divParameterInput2").css("display", "table-cell");
                    $("#divParameterInput2").children("label").html(cp[i][0]);
                    setMinMax(cp[i][2], $("#inputContextParameter2"));
                } else {
                    $("#divParameterInput1").css("display", "table-cell");
                    $("#divParameterInput1").children("label").html(cp[i][0]);
                    setMinMax(cp[i][2], $("#inputContextParameter1"));
                }
                break;

            // type integer needs one/two input fields and a label
            case "INTEGER":
                if ( $("#divParameterInput1").css("display") == "table-cell" ) {
                    $("#divParameterInput2").css("display", "table-cell");
                    $("#divParameterInput2").children("label").html(cp[i][0]);
                    //setMinMax(cp[i][2], $("#inputContextParameter2"));
                } else {
                    $("#divParameterInput1").css("display", "table-cell");
                    $("#divParameterInput1").children("label").html(cp[i][0]);
                    //setMinMax(cp[i][2], $("#inputContextParameter1"));
                }
                break;

            // type string needs an input field and a label
            case "STRING":
                $("#divParameterString").css("display", "block");
                $("#divParameterString").children("label").html(cp[i][0]);
                break;

        }
    }
}

// set minima and maxima if needed in input fields in tab "Kontextinformation"
function setMinMax(values, inputField) {

    var min, max = null;
    for (var i=0; i<values.length; i++) {

        // find minimum if given
        if (values[i]["min"]) {
            min = values[i]["min"];
        }
        // find maximum if given
        if (values[i]["max"]) {
            max = values[i]["max"];
        }
    }

    // set minimum and maximum in input field
    if (min && max) {
        inputField.attr("min", min).attr("max", max);
    }
    if (min &&  !max) {
        inputField.attr("min", min);
    }
    if (!min && max) {
        inputField.attr("max", max);
    }
}

// get current value from input field
function getParameterInput(val, num) {

    // reduce to big values to maximum
    if ( $("#inputContextParameter" + num)[0].hasAttribute("max") ) {
        var max = $("#inputContextParameter" + num)[0].getAttribute("max");
        max = parseInt(max);
        if (val.value > max) {
            val.value = max;
        }
    }

    // increase to little values to minimum
    if ( $("#inputContextParameter" + num)[0].hasAttribute("min") ) {
        var min = $("#inputContextParameter" + num)[0].getAttribute("min");
        min = parseInt(min);
        if (val.value < min) {
            val.value = min;
        }
    }
}

// triggered if button "Bestätigen" was clicked
// Job: - evaluate the seletions and inputs
//      - put context information in multi selection bar
function confirmContextInformation() {

    /* check if all needed fields were filled with informaions */
    var missing_content = "";

    // check selection bar "Kontextinformationen"
    if ( $("#selectContextInfos").select2("data") == null ) {
        missing_content += " - Kontextinformation\n";
    }
    // check selection bar "Operator"
    if ( $("#selectOperator").select2("data")["text"] == "\r" ) {
        missing_content += " - Operator\n";
    }
    // check input "Wert" is visible AND filled with information
    if ( $("#inputContextValue")[0].style.display == "block" && $("#inputContextValue")[0].disabled == false ) {
        if ( $("#inputContextValue")[0].value == "" ) {
            missing_content += " - Wert\n";
        }

    // check if selection bar "Wert" is visible AND filled with information
    } else if ( $("#selectPossibleValues")[0].style.display == "block" ) {
        if ( $("#selectPossibleValues").select2("data")["text"] == "\r" ) {
            missing_content += " - Wert\n";
        }
    }

    // check selection bar "Parameter"
    if ( $("#selectParameter").select2("data")["text"] == "\r" &&  $("#selectParameter")[0].length != 0) {
        missing_content += " - Parameter\n";
    }

    // if something needed is missing
    if ( !!missing_content ) {
        alert("[Fehler] Bitte setzen Sie Werte in den folgenden Feldern:\n" + missing_content);
        return false;
    }


    /* get selected context information name into multi selection bar */
    var id = $("#selectContextInfos").select2("data").id;

    // get name
    var contextInfoName = $("#selectContextInfos").select2("data").text;
    var option = $("<option>").attr("value", id.toString()).attr("selected", "selected");
    option.html(contextInfoName);

    // get name into multi selection
    $("#selectMultiContextInfos").append(option);
    array_multiSelectionContextInfos.push({id:id, text:contextInfoName});
    $("#selectMultiContextInfos").select2("data", array_multiSelectionContextInfos);


    // change color per option
    var name = $("#s2id_selectMultiContextInfos > .select2-choices > .select2-search-choice > div");
    $(name).each(function() {

            // iterate over all multi selections
            for (var i=0; i<array_multiSelectionContextInfos.length; i++) {

                // get id
                var thisID = array_multiSelectionContextInfos[i]["id"];

                // find right one
                if (array_multiSelectionContextInfos[i]["text"] == this.innerHTML) {

                    // get first context class
                    var contextClass = array_ContextInformations[thisID][1][0];

                    // get specific context class color
                    var color = getColor(contextClass);
                    $(this).parent().css("background-color", color);
                    break;
                }
            }
    });

    // increase counter --> needed for continuous ids
    counter_multiSelectionContextInfos ++;
}

// get the specific color for each context class
function getColor(cc) {
    var color;

    switch (cc) {
        case "Lernszenario":
            color = "#3287C8";    // color: #3287C8
            break;
        case "Persönlich":
            color = "#AF46C8";      // color: #AF46C8
            break;
        case "Situationsbezogen":
            color = "#91F52D";   // color: #91F52D
            break;
        case "Infrastruktur":
            color = "#969696";   // color: #969696
            break;
        case "Umwelt":
            color = "#FADC3C";        // color: #FADC3C
            break;
        case "Ortung":
            color = "#F03C32";      // color: #F03C32
            break;
    }
    return color;
}