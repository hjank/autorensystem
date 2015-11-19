/**
 * Created by Helena on 06.09.2015.
 */



// listeners
$(function() {

    // for button: delete unit = YES
    $("btnDeleteUnits2").on("click", function() {
        deleteUnits();
        // delete one or more units + connections in modal window "Lernszenarien l�schen"
        deleteSelectedUnitsFromDOM();
    });

    // for button: delete unit = NO
    $("btnDeleteUnitsNot").on("click", deleteUnitsNot);

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

      /*  for (var j=0; j<myAuthorSystem.length; j++) {
            // find right scenario
            if (myAuthorSystem[j]["name"] == e.choice.text) {

                // get all units
                var units = $("#stm").children("div.w").children("div.title");

                for (var k=0; k<myAuthorSystem[j]["units"].length; k++) {
                    var option = $("<option>");

                    // get unit id and set value = id
                    for (var l=0; l<units.length; l++) {
                        if (myAuthorSystem[j]["units"][k]["name"] == units[l].innerText) {
                            option.attr('value', $(units[l]).parent()[0].id); // stateX
                        }
                    }

                    // set option name and append in multi selection bar
                    option.html(myAuthorSystem[j]["units"][k]["name"]);
                    selectScenarioDeleteUnitElement.append(option);
                }
            }
        }
*/
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
function deleteUnits(){
    // get units which should be deleted
    var list_deletableUnits = $("#selectMultiDeleteUnits").select2("data");

    // get right scenario name
    var currentScenario = $("#selectScenarioDeleteUnit").select2("data")["text"];

/*    // needed to find scenario in menu bar
    var liCurrentScenario;
    $("#menuScenarios").children("li").children("a").children("span.title").each(function() {
        if ( $(this)[0].innerHTML == currentScenario ) {
            liCurrentScenario = $(this).parent("a").parent("li");
        }
    });*/

    // update gui and JSON structure
    var selectedScenario = authorSystemContent.getScenario(currentScenario);
    for (var i in list_deletableUnits) {
        var unitName = list_deletableUnits[i].text;
        var deletableUnit = selectedScenario.getUnitByName(unitName);
        selectedScenario.removeUnit(deletableUnit);
        removeUnitFromMenu(currentScenario, unitName);
    }


 /*   for (var j=0; j<myAuthorSystem.length; j++) {
        // find right scenario
        if (myAuthorSystem[j]["name"] == currentScenario) {
            for (var k=0; k<myAuthorSystem[j]["units"].length; k++) {

                // delete all units in deletable list
                for (var i=0; i<list_deleteableUnits.length; i++) {

                    // Note: unit deletion on working place see statemachine.js
                    // delete unit in statemaschine
                    //var unit = list_deleteableUnits[i].id;
                    //$("#" + unit).remove();

                    // delete unit in JSON structure
                    if (myAuthorSystem[j]["units"][k]["name"] == list_deleteableUnits[i].text) {
                        myAuthorSystem[j]["units"].splice(k, 1);
                    }

                    // delete unit in menu bar
                    liCurrentScenario.children("ul").children("li").each(function() {
                        if ($(this).children("a").children("span")[0].innerHTML == list_deleteableUnits[i].text) {
                            $(this).remove();
                        }
                    });
                }

            }
        }
    }*/

    // all tab content invisible
    $(".tabContents").hide();
    $(".tab-Container").hide();
    $("#tabUnitLabel").hide();

}



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