/**
 * Created by tobias on 14.10.15.
 */

$(function() {
    // set the trigger for the confirmation modal window when deleting a connection
    $("#tabBtnDeleteConnection").on("click", showDeleteConnectionConfirm);
});

function showDeleteConnectionConfirm() {
    showModalWindow($("#modal-delete-connection-confirm"));
}