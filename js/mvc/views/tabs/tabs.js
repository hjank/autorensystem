/**
 * Created by Julius Höfler on 30.03.15.
 */

// tabs
$(function() {

    // default hide tabs
    $(".tab-Container").hide();
    $(".tabContents").hide();
    $("#firstTab").addClass("active");

    // if one tab is clicked show this one
    $(".tab-Container ul li a").click(function() {

        // hide other tab content
        var activeTab = $(this).attr("href");
        $(".tab-Container ul li a").removeClass("active");
        $(this).addClass("active");
        $(".tabContents").hide();

        // only show tab content if a unit is clicked
        if (bool_unitClicked) {
            $(activeTab).fadeIn();
        }

        return false;
    });
});




var global_currentInputUnitName = "";





// bind unit with properties (tabs)
/**
 * Function add event listeners after learning unit creation.
 * @param {Object} newState Contains new created learning unit.
 * */
function activateFunctionalities(newState) {

    // get id from new state (unit)
    var id = newState[0].getAttribute("id");
    var unit = document.getElementById(id);
    var name = "";

    // creates variable which decides whether all or one context information have to be satisfied
    // default is all have to be satisfied
    var unitSatisfiesAllContextInfos = true;

    // get newState id in unit list
    list_units.push(unit);

    var current_unit;

    // triggered if learning unit is clicked
    $(unit).click(function(event) {

        // clear marking from all units
        clearMarkingFromLearningUnits();

        // unit is marked --> change color
        $(unit).css("background", "#16a085");
        $(unit).css("color", "white");
        bool_unitClicked = true;

        // show tab content of the current active tab
        var activeTab = $(".tab-Container > ul > li").children("a.active").attr("href");
        $(activeTab).fadeIn();
        $(".tab-Container").show();

        // hide tab from unit label connection
        $("#tabUnitLabel").hide();

        // clear marking from label connections
        $(".aLabel").css("background-color", "");
        $(".aLabel").css("color", "");

        /* input field in tab "Eigenschaften"*/
        // get name of the unit
        if ($(unit).children("div").hasClass("title")) {
            name = this.innerText.replace(/(\r\n|\n|\r)/gm,"");
        }

        // put name into the input field
        //var formObject = document.forms["formProperties"];
        $("#inputUnitName")[0].value = name;
        global_currentInputUnitName = name;

        // get current unit dictionary
        for (var p=0; p<myAuthorSystem.length; p++) {
            if (myAuthorSystem[p]["name"] == $("#lname")[0].innerText) {
                for (var q=0; q<myAuthorSystem[p]["units"].length; q++) {
                    if (myAuthorSystem[p]["units"][q]["name"] == name) {
                        current_unit = myAuthorSystem[p]["units"][q];
                    }
                }
            }
        }

        // get current unit dictionary if scenario was loaded
        if (loadedData) {
            for (var q=0; q<loadedData["units"].length; q++) {
                if (loadedData["units"][q]["name"] == name) {
                    current_unit = loadedData["units"][q];
                }
            }
        }

        // set description field
        $("#inputUnitDescription")[0].value = current_unit["description"];


        /* tab "Kontextinformation" */
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

        // change format: add icons to text
        $("#selectMultiMetaData").select2({
            formatSelection: formatMultiMetaData,
            escapeMarkup: function(m) {return m;}
        });
        // get data in multi selection bar
        $("#selectMultiMetaData").select2("data", array_multiSelectionMetaData);

        // prevents that underlying container is also clicked (needed for unit marking)
        event.stopPropagation();

        //console.log(myAuthorSystem);
        console.log(JSON.stringify(myAuthorSystem));
    });

    // triggered if one option was selected ("Eine" or "Alle")
    $("#selectNumberContextInfos").select2().on("select2-selecting", function(e) {

        // only for the selected unit
        if (name == global_currentInputUnitName) {

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
                current_unit["sat"] = "one";
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
                current_unit["sat"] = "all";
            }
        }
    });

    // triggered if string is changed in input field in tab "Eigenschaften"
    $("#inputUnitName").bind("input", function() {

        // get current input field value
        var val = $(this).val();

        // only for the selected unit
        if (name == global_currentInputUnitName) {

            // store old name
            var old_name = name;

            // change unit name if his corresponding input field is changing
            $(unit).children("div.title")[0].innerText = val;
            //name = $(unit).children("div.title")[0].innerText;
            name = val;
            global_currentInputUnitName = val;

            // find right scenario in menu bar
            var scenarioName = $("#lname")[0].innerText;
            var findScenario = $("span.title").filter(":contains('" + scenarioName + "')");
            findScenario = findScenario.parent("a").parent("li");

            // change name in menu bar
            if (findScenario.length != 0) {
                var findUnit = findScenario.children("ul").children("li").children("a")
                    .children("span").filter(":contains('" + old_name + "')");
                findUnit[0].innerHTML = val;
            }

            // update JSON structure
            current_unit["name"] = name;

            // necessary to redraw endpoints
            inst.repaintEverything();
        }
    });

    // triggered if string is changed in description field in tab "Eigenschaften"
    $("#inputUnitDescription").bind("input", function() {

        // get current input field value
        var val = $(this).val();

        // only for the selected unit
        if (name == global_currentInputUnitName) {

            // update JSON structure
            current_unit["description"] = val;
        }
    });

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

        // only for the selected unit
        if (name == global_currentInputUnitName) {

            // remove this option from array
            for (var m=0; m<array_multiSelectionContextInfos.length; m++) {
                if (array_multiSelectionContextInfos[m]["text"] == e.choice.text) {
                    array_multiSelectionContextInfos.splice(m, 1);
                    break;
                }
            }

            // remove icon from learning unit
            $(unit).children("div.unit-icons").children("div.unit-icon").each(function() {
                var iconName = $(this).children("img")[0].title;
                if (iconName == e.choice.text) {
                    $(this).remove();
                }
            });

            // remove border if unit has no icons anymore
            if ($(unit).children("div.unit-icons").children("div.unit-icon").length == 0) {
                $(unit).children(".unit-icons").css("border", "");
                $(unit).children(".unit-icons").css("height", "");
                $(unit).children(".unit-icons").css("display", "");
                $(unit).css("padding-top", "");
            }

            // update JSON structure
            for (var i=0; i<current_unit["contextInformations"].length; i++) {
                if (current_unit["contextInformations"][i].name == e.choice.text) {
                    current_unit["contextInformations"].splice(i, 1);
                    break;
                }
            }

            // set endpoints on the right place
            inst.repaintEverything();
        }
    });

    // button "Bestätigen" in tab "Kontextinformation" was clicked
    // Jobs: - evaluate the selections and inputs
    //       - put context information in multi selection bar
    //       - add icons in current unit
    $("#btnConfirmContextInfo, #btnConfirmContextInfoSmall").on("click", function() {

        // only for the selected unit
        if (name == global_currentInputUnitName) {

            // check if all needed fields were filled with information
            var returnArray = checkInformation(current_unit);
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

                    // get selected context information
                    var contentContextInfo = $("#selectContextInfos").select2("data");

                    // get corresponding context class
                    var optgroup = $(contentContextInfo.element[0]).parent()[0].label;

                    // get corresponding context class id
                    var ccID = contentContextInfo.element[0].value;

                    // create icon DOM
                    var divContextIcon = $("<div>").addClass("unit-icon").attr("id", ccID + "icon");
                    //var icon = $("<img>").attr("src", "img/context-classes/" + optgroup + ".png");
                    //icon.attr("width", "15").attr("height", "15").attr("title", e.choice.text).attr("ccID", ccID);

                    // get right format for icon visualisation in learning unit
                    // case 1: context specific icon
                    // case 2: context class icon (upper class icon, only color)
                    var icon = formatUnitIcons(contentContextInfo, optgroup, ccID);

                    // get icon information in JSON structure
                    for (var j = 0; j < current_unit["contextInformations"].length; j++) {
                        if (current_unit["contextInformations"][j].name == contentContextInfo["text"]) {
                            current_unit["contextInformations"][j].icon = icon;
                        }
                    }

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
                    var id = contentContextInfo.id;

                    // get name
                    var contextInfoName = contentContextInfo.text;
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

        }
    });

    // triggered if an option in selection "Metadaten" was selected
    $("#selectMetaData").select2().on("select2-selecting", function(e) {

        // only for the selected unit
        if (name == global_currentInputUnitName) {

            // no two same meta data symbols allowed
            for (var i = 0; i < array_multiSelectionMetaData.length; i++) {
                if (array_multiSelectionMetaData[i]["text"] == e.choice.text) {
                    return true;
                }
            }

            // create meta data DOM
            var divMetaIcon = $("<div>").addClass("unit-meta-icons").attr("id", counter_multiSelectionMetaData + "metaIcon");

            // choose icon symbol and add it to meta data DOM
            var metaIcon = chooseMetaIcon(e.choice.text);
            divMetaIcon.attr("title", e.choice.text);

            // add DOM for meta data icon (glyph)
            var bMetaIcon = $("<b>").addClass(metaIcon);

            // get icon into learning unit
            divMetaIcon.append(bMetaIcon);
            $(unit).append(divMetaIcon);

            // change size of learning unit
            $(unit).css("padding-bottom", "5px");

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

            counter_multiSelectionMetaData++;

            // update JSON structure
            var currentMetaData = {};
            currentMetaData.name = e.choice.text;
            currentMetaData.icon = metaIcon;
            current_unit["metaData"].push(currentMetaData);

            // set endpoints on the right place
            inst.repaintEverything();
        }
    });

    // remove option from multi selection bar in tab "Metadaten"
    $("#selectMultiMetaData").select2().on("select2-removed", function(e) {

        // only for the selected unit
        if (name == global_currentInputUnitName) {

            // find the right meta icon
            $(unit).find("div.unit-meta-icons").each(function() {

                // get icon title name
                var icon = $(this)[0].title;

                // remove the right icon from unit
                if (icon == e.choice.text) {
                    this.remove();

                    // update the array of the multi selection meta data
                    for (var k=0; k<array_multiSelectionMetaData.length; k++) {
                        if (array_multiSelectionMetaData[k]["text"] == e.choice.text) {
                            array_multiSelectionMetaData.splice(k, 1);
                        }
                    }
                    // if no more meta icons in unit go back to old unit design
                    if (array_multiSelectionMetaData.length == 0) {
                        $(unit).css("padding-bottom", "");
                    }
                }
            });

            // update JSON structure
            for (var j=0; j<current_unit["metaData"].length; j++) {
                if (current_unit["metaData"][j].name == e.choice.text) {
                    current_unit["metaData"].splice(j, 1);
                }
            }

            // set endpoints on the right place
            inst.repaintEverything();
        }
    });

    // re-sets the glyphs in selection bar
    addMetadataGlyphsToOptions();

    // triggered if unit was dragged
    $(unit).on("dragstop", function() {
        // get new positions (absolute)
        var top = $(unit)[0].offsetTop;
        var left = $(unit)[0].offsetLeft;

        // only set if current unit object exists
        if (current_unit) {
            current_unit.posX = left;
            current_unit.posY = top;
        }
    });

    // clear marking from existing learning units
    clearMarkingFromLearningUnits();

    // clear multi selection bar
    $("#selectMultiContextInfos").empty();
    $("#selectMultiContextInfos").select2("data", null);
    array_multiSelectionContextInfos = [];

}



