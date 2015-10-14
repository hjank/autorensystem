/**
 * Created by tobias on 14.10.15.
 */

$(function() {
    // sets the trigger for the profile modal window
    $("#showProfile").on("click", showProfile);

    // set the trigger for clicking "Passwort ändern"
    $("#showPW").on("click", showPW);
});

/**
 * Function shows the user profile modal window and sets focus to the first input field.
 */
function showProfile() {
    var modalUserElement = $("#modal-user");

    // set focus on user name input field
    modalUserElement.on("shown.bs.modal", function () {
        $("#inputUsername").focus();
    });

    showModalWindow(modalUserElement);
}

/**
 * Function makes input fields for password change visible/invisible (toggle).
 */
function showPW() {
    $(".invis").toggleClass("vis");
}