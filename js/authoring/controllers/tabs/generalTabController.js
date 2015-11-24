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
    var unit = newState[0];

    // creates variable which decides whether all or one context information have to be satisfied
    // default is all have to be satisfied
    var unitSatisfiesAllContextInfos = true;

    // get newState id in unit list
    list_units.push(unit);


    // triggered if one option was selected ("Eine" or "Alle")
    $("#selectNumberContextInfos").select2().on("select2-selecting", function(e) {

        var current_unit = authorSystemContent.getUnitByUUID(currentUnitUUID);

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
        var currentUnitContextList = authorSystemContent.getUnitByUUID(currentUnitUUID).getContextData();
        for (var i in currentUnitContextList) {
            if (currentUnitContextList[i].name == e.choice.text) {
                currentUnitContextList.splice(i, 1);
                break;
            }
        }

        // set endpoints on the right place
        inst.repaintEverything();

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