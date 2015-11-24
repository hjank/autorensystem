/**
 * Created by Helena on 06.09.2015.
 */

$(function() {

    // triggered if string is changed in input field in tab "Eigenschaften"
    $("#inputUnitName").bind("input", function() {

        var current_unit = authorSystemContent.getUnitByUUID(currentUnitUUID);

        // store old name
        var oldName = current_unit.getName();

        // get current input field value
        var newName = $(this).val();

        // change unit name if his corresponding input field is changing
        $("#" + currentUnitUUID).children("div.title")[0].innerText = newName;
        //name = $(unit).children("div.title")[0].innerText;

        // find right scenario in menu bar
        var scenarioName = $("#lname")[0].innerText;
        var findScenario = $("span.title").filter(":contains('" + scenarioName + "')");
        findScenario = findScenario.parent("a").parent("li");

        // change name in menu bar
        if (findScenario.length != 0) {
            var findUnit = findScenario.children("ul").children("li").children("a")
                .children("span").filter(":contains('" + oldName + "')");
            findUnit[0].innerHTML = newName;
        }

        // update JSON structure
        current_unit.setName(newName);

        // necessary to redraw endpoints
        inst.repaintEverything();

    });

    // triggered if string is changed in description field in tab "Eigenschaften"
    $("#inputUnitDescription").bind("input", function() {

        var current_unit = authorSystemContent.getUnitByUUID(currentUnitUUID);

        // update JSON structure with current input field value
        current_unit.setDescription($(this).val());
    });

    // delete unit after confirming deletion in tab "Eigenschaften"
    $("#btnDeleteUnit").on("click", function() {
        // get unit name from input field
        var unitName = $("#inputUnitName")[0].value;
        deleteUnitFromModel(unitName);
        deleteUnitFromView(unitName);
    });

    // set the trigger for if the delete button in tab "Eigenschaften" was clicked
    $("#tabBtnDeleteUnit").on("click", showDeleteUnitConfirm);
});

/**
 * Function shows delete unit confirmation modal window.
 * Triggered in tab properties after clicking the unit delete button
 */
function showDeleteUnitConfirm() {
    showModalWindow($("#modal-delete-unit-confirm"));

    // get unit name and show the unit specific text
    var unitName = $("#inputUnitName")[0].value;
    $("#tabTextUnitDeletion").html('Wollen Sie die Lerneinheit "' + unitName + '" wirklich löschen?');
}