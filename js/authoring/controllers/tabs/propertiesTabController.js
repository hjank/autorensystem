/**
 * Created by Helena on 06.09.2015.
 */

$(function() {
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