/**
 * Created by tobias on 14.10.15.
 */

$(function() {
    // set the trigger for the contact modal window
    $("#showContact").on("click", showContact);

    // set the trigger for reading the content of the contact form
    $("#getContentContact").on("click", getContentContact);
});

/**
 * Function shows the contact modal window.
 */
function showContact() {
    $("#modal-contact").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}

/**
 * Function reads out the input fields in the contact modal window after clicking the send button.
 *
 */
function getContentContact() {
    // collect form data as object
    var f = $('#modalContactForm').serializeArray().reduce(function(obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    var name = f.userName;
    var mail = f.userMail;
    var text = f.userText;

    //var subject = "Authorensystem Frage";

    alert("Name:" + name + ", Mail:" + mail + ", Text:" + text);

    /*$(location).attr("href", "mailto:airj@gmx.net?"
     + "subject=" + encodeURIComponent(subject)
     + "&body=" + encodeURIComponent(text)
     );*/
}