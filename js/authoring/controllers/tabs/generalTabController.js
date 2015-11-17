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

        // TODO: For each newly created unit show firstTab on first click --> see $(unit).click(...)
        // TODO: For each follow-up click of existing unit show tab that was last opened
        // only show tab content if a unit is clicked
        if (bool_unitClicked) {
            $(activeTab).fadeIn();
        }

        return false;
    });
});

/**
 * Function add event listeners after learning unit creation.
 *
 * @param {Object} newState Contains new created learning unit.
 */
function activateFunctionalities(newState) {

    // get id from new state (unit)
    var id = newState[0].getAttribute("id");
    var unit = document.getElementById(id);

    // creates variable which decides whether all or one context information have to be satisfied
    // default is all have to be satisfied
    var unitSatisfiesAllContextInfos = true;

    // get newState id in unit list
    list_units.push(unit);

    var current_unit;

    // triggered if learning unit is clicked
    $(unit).click(function(event) {

        bool_unitClicked = true;
        // get name of the unit
        if ($(unit).children("div").hasClass("title")) {
            global_currentInputUnitName = this.innerText.replace(/(\r\n|\n|\r)/gm,"");
        }

        // clear marking from all units
        clearMarkingFromLearningUnits();
        // unit is marked --> change color
        $(unit).css("background", "#16a085");
        $(unit).css("color", "white");
        // clear marking from label connections
        $(".aLabel").css("background-color", "");
        $(".aLabel").css("color", "");

        // show tab content of the current active tab
        var activeTab = $(".tab-Container > ul > li").children("a.active").attr("href");
        $(activeTab).fadeIn();
        $(".tab-Container").show();
        // hide tab from unit label connection
        $("#tabUnitLabel").hide();


        /* tab "Eigenschaften"*/

        // put name into the input field
        //var formObject = document.forms["formProperties"];
        $("#inputUnitName")[0].value = global_currentInputUnitName;

        current_unit = getCurrentUnitDataModel();

        // set description field
        $("#inputUnitDescription")[0].value = current_unit["description"];

        /* tab "Kontextinformation" */
        loadContextTabForUnit(unit);

        // prevents that underlying container is also clicked (needed for unit marking)
        event.stopPropagation();

        //console.log(myAuthorSystem);
        console.log(JSON.stringify(myAuthorSystem));

        // set listener for button "Bestätigen" in tab "Kontextinformation"
        activateContextConfirmation(unit, unitSatisfiesAllContextInfos, current_unit);
    });

    // triggered if one option was selected ("Eine" or "Alle")
    $("#selectNumberContextInfos").select2().on("select2-selecting", function(e) {

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
    });

    // triggered if string is changed in input field in tab "Eigenschaften"
    $("#inputUnitName").bind("input", function() {

        // store old name
        var old_name = global_currentInputUnitName;

        // get current input field value
        global_currentInputUnitName = $(this).val();

        // change unit name if his corresponding input field is changing
        $(unit).children("div.title")[0].innerText = global_currentInputUnitName;
        //name = $(unit).children("div.title")[0].innerText;

        // find right scenario in menu bar
        var scenarioName = $("#lname")[0].innerText;
        var findScenario = $("span.title").filter(":contains('" + scenarioName + "')");
        findScenario = findScenario.parent("a").parent("li");

        // change name in menu bar
        if (findScenario.length != 0) {
            var findUnit = findScenario.children("ul").children("li").children("a")
                .children("span").filter(":contains('" + old_name + "')");
            findUnit[0].innerHTML = global_currentInputUnitName;
        }

        // update JSON structure
        current_unit["name"] = global_currentInputUnitName;

        // necessary to redraw endpoints
        inst.repaintEverything();

    });

    // triggered if string is changed in description field in tab "Eigenschaften"
    $("#inputUnitDescription").bind("input", function() {
        // update JSON structure with current input field value
        current_unit["description"] = $(this).val();
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

    });

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

// cleans selection bars
/**
 * Function cleans a selection bar.
 * @param {String} s Contains a selection bar id.
 * */
function cleanSection(s) {
    $(s).empty();
    $(s).select2("data", {id:"\r",text:"\r"});
}