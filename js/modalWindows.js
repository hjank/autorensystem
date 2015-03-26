/**
 * Created by juliushofler on 17.03.15.
 */

var global_ScenarioCounter = 0;
var global_dataArrayScenarios = [];
var global_arrayShowSzenarioDeletion = [];
var global_ScenarioLiNumber = 0;

/* OLD
// modal windows
$(function() {
    $("#i1").click(function() {
        $.pgwModal({
            title: "Einstellungen",
            content: 'My content',
            close: true,
            maxWidth: 500
        });
    });
});
*/

// get scenario name from input field
/*$(function() {
    $("#sname").keyup(function() {
        ssname = $("#sname").val();
    });
});*/

// triggered after clicking save button in scenario creation
function saveCloseSzenario() {

    // write scenario name on the little navigation bar
    $("#lname").html(ssname);

    global_ScenarioLiNumber = global_ScenarioLiNumber + 1;

    // create nur container to see new sceario in menu bar
    var liClass = $('<li>').addClass('last');
    liClass.attr("id", "menu-scenario-" + global_ScenarioLiNumber);
    var aClass = $('<a>').attr('href', '#');
    var spanClass = $('<span>').addClass('title');

    // append container in html file
    spanClass.append(ssname);
    aClass.append(spanClass);
    liClass.append(aClass);
    $("#cssmenu > ul").append(liClass);

    // update scenario list and panel
    updateScenario(ssname);
    setLabelBtnScenarioDeletion();

}

// write any typed character in ssname
var ssname = "";
function logKey(k) {
    ssname = k.value;
}

// triggered after clicking "Passwort ändern"
function showPW() {
    $(".invis").toggleClass("vis");
}

// trigger profile modal window
function showProfil() {
    /*$.pgwModal({
        title: "Profil",
        target: ".modal-user",
        close: true,
        closeOnEscape: true,
        closeOnBackgroundClick: true
    });*/

    $("#modal-user").on("hidden", function() {
        $("#modal-user").remove();
    });

    $("#modal-user").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}

// trigger contact modal window
function showContact() {
    /*$.pgwModal({
        title: "Kontakt",
        target: ".modal-contact"
    });*/

    $("#modal-contact").on("hidden", function() {
        $("#modal-contact").remove();
    });

    $("#modal-contact").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}

// get all content of the input fields ans send a mail
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

    $.pgwModal("close");
}

// trigger login modal window
function showLogin() {
    /*$.pgwModal({
        title: "Login",
        target: ".modal-login",
        close: true,
        closeOnEscape: true,
        closeOnBackgroundClick: true
    });*/

    $("#modal-login").on("hidden", function() {
        $("#modal-login").remove();
    });

    $("#modal-login").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}

// trigger new scenario modal window
function showNewSzenario() {
    /*$.pgwModal({
     title: "Neues Szenario erstellen",
     target: ".modal-new-szenario",
     close: true
     });*/

    $("#modal-new-szenario").on("shown.bs.modal", function () {
        $("#sname").focus();
    });

    $("#modal-new-szenario").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });

}

// trigger delete scenarios modal window
function showDeleteSzenario() {
    /*$.pgwModal({
        title: "Szenarien löschen",
        target: ".modal-delete-szenario",
        close: true
    });*/

    $("#modal-delete-szenario").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}

// trigger delete scenarios modal window
function showDeleteUnits() {
    $.pgwModal({
        title: "Lerneinheiten löschen",
        target: ".modal-delete-units",
        close: true
    });
}

// trigger help modal window
function showHelp() {
    /*$.pgwModal({
        title: "Hilfe",
        target: ".modal-help",
        close: true
    });*/

    $("#modal-help").on("hidden", function() {
        $("#modal-help").remove();
    });

    $("#modal-help").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}

// set scenarios in selection bar
function setScenarios() {
    var countScenarios = $("#menuScenarios").children("li").length;
    var scenarios = $("#menuScenarios").children("li");

    // iterate over all scenarios in the menu bar ans add them in the selection bar
    for (var i = 0; i < countScenarios; i++) {
        var optionClass = $('<option>').attr('value', i.toString());
        optionClass.html(scenarios[i].innerText);
        optionClass.attr("selected", "");
        $("#selectSzenarioDeletion").append(optionClass);
        global_dataArrayScenarios.push({id: i, text: scenarios[i].innerText});
        global_ScenarioCounter = global_ScenarioCounter + 1;
    }
    $("#selectSzenarioDeletion").select2("data", global_dataArrayScenarios);
}

// add scenario as a select option
function updateScenario(name) {
    var j = global_ScenarioCounter;
    var optionClass = $('<option>').attr('value', j.toString());
    optionClass.html(name);
    optionClass.attr("selected", "");
    $("#selectSzenarioDeletion").append(optionClass);
    global_dataArrayScenarios.push({id: j, text: name});
    $("#selectSzenarioDeletion").select2("data", global_dataArrayScenarios);
    global_ScenarioCounter = global_ScenarioCounter + 1;
}

// label delete button for modal window "Delete Scenarios"
function setLabelBtnScenarioDeletion() {
    var countSelectedDelete = $("#selectSzenarioDeletion2 option:selected").length;
    $("#btnDeleteSzenario").text("Löschen (" + countSelectedDelete.toString() + ")");
}

$(function() {

    // remove elements from scenario list, add elements in delete scenario list
    $("#selectSzenarioDeletion").select2().on("select2-removed", function(e) {
        //alert("Removed: " + e.val + ", choice: " + e.choice.text);
        var optionSzenarioDeletion = $('<option>').attr('value', e.val);
        optionSzenarioDeletion.html(e.choice.text);
        optionSzenarioDeletion.attr("selected", "");
        $("#selectSzenarioDeletion2").append(optionSzenarioDeletion);
        global_arrayShowSzenarioDeletion.push({id: e.val, text: e.choice.text});
        $("#selectSzenarioDeletion2").select2("data", global_arrayShowSzenarioDeletion);

        for (var i = global_dataArrayScenarios.length - 1; i >= 0; i--) {
            if (global_dataArrayScenarios[i]["id"] === e.val) {
                global_dataArrayScenarios.splice(i,1);
            }
        }
        setLabelBtnScenarioDeletion();
    });

    // remove elements from delete scenario list, add elements in scenario list
    $("#selectSzenarioDeletion2").select2().on("select2-removed", function(e) {
        var optionSzenarioDeletion = $('<option>').attr('value', e.val);
        optionSzenarioDeletion.html(e.choice.text);
        optionSzenarioDeletion.attr("selected", "");
        $("#selectSzenarioDeletion").append(optionSzenarioDeletion);
        global_dataArrayScenarios.push({id: e.val, text: e.choice.text});
        $("#selectSzenarioDeletion").select2("data", global_dataArrayScenarios);

        for (var i = global_arrayShowSzenarioDeletion.length - 1; i >= 0; i--) {
            if (global_arrayShowSzenarioDeletion[i]["id"] === e.val) {
                global_arrayShowSzenarioDeletion.splice(i,1);
            }
        }
        setLabelBtnScenarioDeletion();
    });

    // add element in scenario list and immediately delete it in delete list
    $("#selectSzenarioDeletion").select2().on("select2-selecting", function(e) {

        for (var i = global_arrayShowSzenarioDeletion.length - 1; i >= 0; i--) {
            if (global_arrayShowSzenarioDeletion[i]["id"] == e.val) {
                global_arrayShowSzenarioDeletion.splice(i,1);
                var remove = $("#selectSzenarioDeletion2>option[value='"+ e.val +"']");
                remove.remove();
            }
        }

        $("#selectSzenarioDeletion2").select2("data", global_arrayShowSzenarioDeletion);
        setLabelBtnScenarioDeletion();
    });

    /*
    // add element in deletion list and immediately delete it in scenario list
    $("#selectSzenarioDeletion2").select2().on("select2-selecting", function(e) {

        for (var i = global_dataArrayScenarios.length - 1; i >= 0; i--) {
            if (global_dataArrayScenarios[i]["id"] == e.val) {
                global_dataArrayScenarios.splice(i,1);
                var remove = $("#selectSzenarioDeletion>option[value='"+ e.val +"']");
                remove.remove();
            }
        }

        $("#selectSzenarioDeletion").select2("data", global_dataArrayScenarios);
        setLabelBtnScenarioDeletion();
    });*/
})

// delete scenarios from menu bar
function deleteScenarios() {

    for (var i = global_arrayShowSzenarioDeletion.length - 1; i >= 0; i--) {
        var nameScenario = global_arrayShowSzenarioDeletion[i]["text"];
        nameScenario = nameScenario.replace(/(\r\n|\n|\r)/gm,"");       // remove return character

        var liScenario = $("span:contains('" + nameScenario + "')");
        liScenario = liScenario.parent("a").parent("li");
        liScenario.remove();
    }
}