/**
 * Created by Julius Höfler on 17.03.15.
 */

var global_ScenarioCounter = 0;
var global_dataArrayScenarios = [];
//var gloabl_unitsPerScenario = [];


// reset modal windows after closing
$(function() {
    // triggered if modal window was closed
    $("body").on("hidden.bs.modal", ".modal", function() {
        // only reset modal windows if they have forms
        if ( $(this)[0].id == "modal-login"
            || $(this)[0].id == "modal-new-szenario"
            || $(this)[0].id == "modal-delete-szenario"
            || $(this)[0].id == "modal-user"
            || $(this)[0].id == "modal-contact"
        ) {
            // reset form
            $(this).find("form")[0].reset();
        }
    });

    // set the trigger for the login modal window
    $("#showLogin").on("click", showLogin);

    // sets the trigger for the profile modal window
    $("#showProfile").on("click", showProfil);

    // set the trigger for the help modal window
    $("#showHelp").on("click", showHelp);

    // set the trigger for the confirmation modal window when deleting a connection
    $("#tabBtnDeleteConnection").on("click", showDeleteConnectionConfirm);

    // set the trigger for clicking "Passwort ändern"
    $("#showPW").on("click", showPW);

    // set the trigger for the contact modal window
    $("#showContact").on("click", showContact);

    $("#getContentContact").on("click", getContentContact);
});


// trigger login modal window
/**
 * Function shows the login modal window.
 * */
function showLogin() {

    // show modal window
    $("#modal-login").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}


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
 *
 * */
function getContentContact() {
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


// trigger help modal window
/**
 * Function shows help modal window
 * */
function showHelp() {

    // show modal window
    $("#modal-help").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}

function showDeleteConnectionConfirm() {
    // show modal window
    $("#modal-delete-connection-confirm").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}

// set scenarios in selection bar
/*function setScenarios() {
    var countScenarios = $("#menuScenarios").children("li").length;
    var scenarios = $("#menuScenarios").children("li");

    // iterate over all scenarios in the menu bar and add them in the selection bar
    for (var i = 0; i < countScenarios; i++) {
        var optionClass = $('<option>').attr('value', i.toString());
        optionClass.html(scenarios[i].innerText);
        optionClass.attr("selected", "");
        $("#selectSzenarioDeletion").append(optionClass);
        global_dataArrayScenarios.push({id: i, text: scenarios[i].innerText.replace(/(\r\n|\n|\r)/gm,"")});
        global_ScenarioCounter = global_ScenarioCounter + 1;

        // get units for each scenario
        var units = [];
        if ($(scenarios[i]).children("ul").children("li").length != 0) {
            $(scenarios[i]).children("ul").children("li").each(function() {
                //units.push($(this)[0].innerText.replace(/(\r\n|\n|\r)/gm,""));
                units.push({name:$(this)[0].innerText.replace(/(\r\n|\n|\r)/gm,"")});
            });
            //gloabl_unitsPerScenario.push({id:scenarios[i].innerText.replace(/(\r\n|\n|\r)/gm,""), text:units});
            myAuthorSystem.push({name:scenarios[i].innerText.replace(/(\r\n|\n|\r)/gm,""), units:units});
        }

    }
    $("#selectSzenarioDeletion").select2("data", global_dataArrayScenarios);
}*/