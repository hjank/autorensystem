/**
 * Created by Helena on 06.09.2015.
 */


$(function() {

    $("#btnDeleteUnit").click(function() {
        // delete unit after confirming deletion in tab "Eigenschaften"
        deleteUnitFromModel();
        deleteUnitFromView();
    });

    // set the trigger for if the delete button in tab "Eigenschaften" was clicked
    $("#tabBtnDeleteUnit").on("click", showDeleteUnitConfirm);
});


// triggered if delete button in tab "Eigenschaften" was clicked
/**
 * Function shows delete unit confirmation modal window.
 * Triggered in tab properties after clicking the unit delete button
 * */
function showDeleteUnitConfirm() {

    // show modal window
    $("#modal-delete-unit-confirm").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });

    // get unit name and show the unit specific text
    var unitName = $("#inputUnitName")[0].value;
    $("#tabTextUnitDeletion").html('Wollen Sie die Lerneinheit "' + unitName + '" wirklich l�schen?');
}