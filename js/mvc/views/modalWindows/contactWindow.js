/**
 * Created by Helena on 06.09.2015.
 */


// trigger contact modal window
/**
 * Function shows the contact modal window.
 * */
function showContact() {

    // show modal window
    $("#modal-contact").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}



// get all content of the input fields and send a mail
/**
 * Function reads out the input fields in the contact modal window after clicking the send button.
 * @parma {Object} f form object from contact modal window
 * */
function getContentContact(f) {
    var name = f.userName.value;
    var mail = f.userMail.value;
    var text = f.userText.value;

    //var subject = "Authorensystem Frage";

    alert("Name:" + name + ", Mail:" + mail + ", Text:" + text);

    /*$(location).attr("href", "mailto:airj@gmx.net?"
     + "subject=" + encodeURIComponent(subject)
     + "&body=" + encodeURIComponent(text)
     );*/
}