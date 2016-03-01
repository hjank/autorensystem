/**
 * Created by tobias on 14.10.15.
 */

$(function() {
    // set the trigger for the login modal window
    $("#showLogin").on("click", showLogin);
});

/**
 * Function shows the login modal window.
 */
function showLogin() {
    showModalWindow($("#modal-login"));
}