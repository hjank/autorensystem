/**
 * Created by tobias on 14.10.15.
 */

$(function() {
    // set the trigger for the help modal window
    $("#showHelp").on("click", showHelp);
});

/**
 * Function shows help modal window
 */
function showHelp() {
    showModalWindow($("#modal-help"));
}
