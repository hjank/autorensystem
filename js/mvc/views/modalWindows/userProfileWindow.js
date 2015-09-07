/**
 * Created by Helena on 06.09.2015.
 */


// trigger profile modal window
/**
 * Function shows the user profile modal window and sets focus to the first input field.
 * */
function showProfil() {

    // set focus on user name input field
    $("#modal-user").on("shown.bs.modal", function () {
        $("#inputUsername").focus();
    });

    // show modal window
    $("#modal-user").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}


// triggered after clicking "Passwort ändern"
/**
 * Function makes input fields for password change visible/invisible (toggle).
 * */
function showPW() {
    $(".invis").toggleClass("vis");
}