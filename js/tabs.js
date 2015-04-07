/**
 * Created by juliushofler on 30.03.15.
 */

var global_currentInputUnitName = "";
var counter_parameter = 0;
var counter_parElem = 0;

$(function() {

    /* create parameter dropdown selection */
    var divParameter = $("<div>").attr("style", "margin: -15px 0 0 15px");
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

    });
    /* END parameter dropdown selection */


    // TEST: initialize selection bar
    $("#selectMetaData").select2({
        placeholder: "Metadaten"
        //initSelection: function(element, callback){}
    });

});

// get name into tab properties
function activateFunctionalities(newState) {

    var id = newState[0].getAttribute("id");
    var unit = document.getElementById(id);
    var name = "";

    // triggered if learning unit is clicked
    $(unit).click(function() {

        // get name of the unit
        if ($(unit).children("div").hasClass("title")) {
            name = (this).innerText.replace(/(\r\n|\n|\r)/gm,"");
        }

        // put name into the input field
        var formObject = document.forms["formProperties"];
        formObject.elements["unitName"].value = name;
        global_currentInputUnitName = name;

        //$("#selectContextInfos").select2("val", " ");
        $("#selectContextInfos option[value='ph']").remove();
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

        if (name == global_currentInputUnitName) {
            var divContextIcon = $("<div>").addClass("unit-icons").attr("id", id + "icon");
            var icon = $("<img>").attr("src", "img/test/" + e.val + ".png");
            icon.attr("width", "17").attr("height", "17");

            // check whether the unit has an icon already
            if ($(unit).find("div.unit-icons").length) {
                $(unit).find("div.unit-icons").remove();
                divContextIcon.append(icon);
                $(unit).append(divContextIcon);

                // no icon exists
            } else {
                divContextIcon.append(icon);
                $(unit).append(divContextIcon);
            }
        }
    });

    // triggered if an option in selection "Operator" was selected
    $("#selectOperator").select2().on("select2-selecting", function(e) {
        alert("Text:" + e.choice.text + " Value:" + e.val);
    });

    // triggered if an option in selection "Metadaten" was seleceted
    $("#selectMetaData").select2().on("select2-selecting", function(e) {

        if (name == global_currentInputUnitName) {
            var divMetaIcon = $("<div>").addClass("unit-meta-icons").attr("id", id + "metaIcon");

            var metaIcon;
            switch (e.choice.text) {
                case "Bild":
                    metaIcon = "fui-photo";
                    break;
                case "Film":
                    metaIcon = "fui-video";
                    break;
                case "Text":
                    metaIcon = "fui-document";
                    break;
                case "Navigation":
                    metaIcon = "fui-location";
                    break;
                case "Test":
                    metaIcon = "fui-radio-unchecked";
                    break;
                case "Audio":
                    metaIcon = "fui-volume";
                    break;
            }

            var bMetaIcon = $("<b>").addClass(metaIcon);

            // check whether the unit has an meta icon already
            if ($(unit).find("div.unit-meta-icons").length) {
                $(unit).find("div.unit-meta-icons").remove();
            }

            divMetaIcon.append(bMetaIcon);
            $(unit).append(divMetaIcon);
        }
    });
}
/* Begin */
// get images into selection from "Kontextinformation"
/*
$(function() {
    $("#selectContextInfos").select2({
        formatResult: contextInfoFormat,
        formatSelection: contextInfoFormat2,
        escapeMarkup: function(m) {return m;}
    });
});

// get images into selection from "Kontextinformation"
function contextInfoFormat(element) {

    // for optmenus
    if (!element.id) {
        return element.text;
    }

    var e = '<img src="img/test/' + element.id + '.png"/> ' + element.text;

    console.log("2");
    console.log(e);
    return e;
}

// get images into selection from "Kontextinformation"
function contextInfoFormat2 (element) {

    var e = '<img src="img/test/' + element.id + '.png"/> ' + element.text;

    console.log("1");
    console.log(e);
    return e;
}*/
/* END */


// needed to get event handling on parameter deletion button
function activateDeleteParameter(paraElem) {

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

}