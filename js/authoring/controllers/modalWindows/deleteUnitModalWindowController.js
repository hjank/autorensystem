/**
 * Created by Helena on 06.09.2015.
 */



// listeners
$(function() {

    // for button in modal window "Lernszenarien löschen": delete unit = YES
    $("#btnDeleteUnits2").on("click", function() {

        // get from multi selection bar all units which shall be deleted
        var list_deletableUnits = $("#selectMultiDeleteUnits").select2("data");
        // get selected scenario name
        var selectedScenarioName = $("#selectScenarioDeleteUnit").select2("data")["text"];

        // for each unit that is to be deleted
        for (var i in list_deletableUnits) {
            // get its uuid, name and data model
            var unitUUID = list_deletableUnits[i].id;
            // and delete it and its traces
            removeUnitFromScenario(unitUUID, selectedScenarioName);
        }

        // all tab content invisible
        $(".tabContents").hide();
        $(".tab-Container").hide();
        $("#tabUnitLabel").hide();
    });

    // for button: delete unit = NO
    $("#btnDeleteUnitsNot").on("click", deleteUnitsNot);

    // set the trigger for the delete units modal window
    $("#deleteLearnUnit").on("click", showDeleteUnits);

    // set the trigger for opening a new modal window to confirm the unit deletion
    $("#btnDeleteUnits").on("click", showDeleteUnitsConfirm);
});

// trigger delete scenarios modal window
/**
 * Function shows the delete unit modal window.
 * Sets event listeners to the selection and multi selection bar.
 * */
function showDeleteUnits() {
    var selectMultiDeleteUnitsElement = $("#selectMultiDeleteUnits");

    showModalWindow($("#modal-delete-units"));

    // set deletion button label
    var list_units = [];
    $("#btnDeleteUnits").text("Löschen (" + list_units.length.toString() + ")");

    // delete scenarios and put them and new scenarios in selection bar again
    $("#selectScenarioDeleteUnit").empty();
    $("#selectScenarioDeleteUnit").select2("data", {id:"\r",text:"\r"});
    for (var i = 0; i < global_dataArrayScenarios.length; i++) {
        var option = $("<option>").attr("value", global_dataArrayScenarios[i]["id"]);
        option.html(global_dataArrayScenarios[i]["text"]);
        $("#selectScenarioDeleteUnit").append(option);
    }

    // clean multi selection bar and fill it again
    selectMultiDeleteUnitsElement.empty();
    selectMultiDeleteUnitsElement.select2("data", null);

    // triggered if an scenario was selected
    $("#selectScenarioDeleteUnit").on("select2-selecting", function(e) {

        // clean multi selection bar
        selectMultiDeleteUnitsElement.empty();
        list_units = [];
        $("#btnDeleteUnits").text("Löschen (" + 0 + ")");

        // get units into multi selection choice
        var selectedScenario = authorSystemContent.getScenario(e.choice.text);
        // get all units of this scenario
        var units = selectedScenario.getUnits();
        for (var i in units) {
            var option = $("<option>");
            option.attr('value', units[i].getUUID());
            // set option name and append in multi selection bar
            option.html(units[i].getName());
            selectMultiDeleteUnitsElement.append(option);
        }

        // select unit which should be deleted
        selectMultiDeleteUnitsElement.select2().on("select2-selecting", function(e) {

            // test if unit is already in the list
            var isContained = false;
            for (var i=0; i<list_units.length; i++) {
                if (e.val == list_units[i].id) {
                    isContained = true;
                }
            }
            // if not in list add unit
            if (!isContained) {
                list_units.push({id: e.val, text:e.choice.text});
            }

            // set label
            $("#btnDeleteUnits").text("Löschen (" + list_units.length.toString() + ")");
        });

        // triggered if a unit was deleted
        selectMultiDeleteUnitsElement.select2().on("select2-removed", function(e) {
            // remove unit from list
            for (var j=0; j<list_units.length; j++) {
                if (list_units[j].id == e.val) {
                    list_units.splice(j, 1);
                }
            }
            // set label
            $("#btnDeleteUnits").text("Löschen (" + list_units.length.toString() + ")");
        });
    });
}

// opens new modal window to confirm unit deletion
/**
 * Function shows the confirmation of unit deletion modal window.
 * */
function showDeleteUnitsConfirm() {

    // show modal window
    $("#modal-delete-units-confirm").modal({
        show: true
    });
}

/**
 * Function deletes a learning unit from the working place.
 * Triggered in the modal window "confirm unit deletion".
 */



// get back to deletion overview after canceling deletion
/**
 * Function shows delete units modal window after canceling deletion in confirmation.
 * */
function deleteUnitsNot() {

    // show modal window
    $("#modal-delete-units").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}