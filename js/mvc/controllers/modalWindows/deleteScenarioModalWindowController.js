/**
 * Created by Helena on 06.09.2015.
 */


var global_arrayShowSzenarioDeletion = [];

$(function() {


    // remove elements from scenario list, add elements in delete scenario list
    $("#selectSzenarioDeletion").select2().on("select2-removed", function(e) {
        // build option DOM
        var optionScenarioDeletion = $('<option>').attr('value', e.val);
        optionScenarioDeletion.html(e.choice.text);
        optionScenarioDeletion.attr("selected", "");

        // add option to selection bar
        $("#selectSzenarioDeletion2").append(optionScenarioDeletion);
        global_arrayShowSzenarioDeletion.push({id: e.val, text: e.choice.text});
        $("#selectSzenarioDeletion2").select2("data", global_arrayShowSzenarioDeletion);

        // delete element in scenario list
        for (var i = global_dataArrayScenarios.length - 1; i >= 0; i--) {
            if (global_dataArrayScenarios[i]["id"] === e.val) {
                global_dataArrayScenarios.splice(i,1);
            }
        }
        // set label
        setLabelBtnScenarioDeletion();
    });

    // remove elements from delete scenario list, add elements in scenario list
    $("#selectSzenarioDeletion2").select2().on("select2-removed", function(e) {
        // build option DOM
        var optionSzenarioDeletion = $('<option>').attr('value', e.val);
        optionSzenarioDeletion.html(e.choice.text);
        optionSzenarioDeletion.attr("selected", "");

        // add option to selection bar
        $("#selectSzenarioDeletion").append(optionSzenarioDeletion);
        global_dataArrayScenarios.push({id: e.val, text: e.choice.text});
        $("#selectSzenarioDeletion").select2("data", global_dataArrayScenarios);

        // delete element in deletion list
        for (var i = global_arrayShowSzenarioDeletion.length - 1; i >= 0; i--) {
            if (global_arrayShowSzenarioDeletion[i]["id"] === e.val) {
                global_arrayShowSzenarioDeletion.splice(i,1);
            }
        }
        // set label
        setLabelBtnScenarioDeletion();
    });

    // add element in scenario list and immediately delete it in delete list
    $("#selectSzenarioDeletion").select2().on("select2-selecting", function(e) {

        // remove element
        for (var i = global_arrayShowSzenarioDeletion.length - 1; i >= 0; i--) {
            if (global_arrayShowSzenarioDeletion[i]["id"] == e.val) {
                global_arrayShowSzenarioDeletion.splice(i,1);
                var remove = $("#selectSzenarioDeletion2>option[value='"+ e.val +"']");
                remove.remove();
            }
        }

        // push elements in selection bar
        $("#selectSzenarioDeletion2").select2("data", global_arrayShowSzenarioDeletion);

        // set label
        setLabelBtnScenarioDeletion();
    });

    // set the trigger for the delete scenarios modal window
    $("#deleteScenario").on("click", showDeleteScenario);

    // set the trigger for opening a new modal window to confirm scenario deletion
    $("#btnDeleteSzenario").on("click", deleteScenariosConfirm);

    // set the trigger for deleting scenarios from the menu bar and clearing the state machine
    $("#deleteScenarios").on("click", deleteScenarios);

    // set the trigger for getting back to deletion overview after canceling deletion
    $("#deleteScenariosNot").on("click", deleteScenariosNot);
});


// label delete button for modal window "Delete Scenarios"
/**
 * Function get the number of scenarios which should be deleted and set the label of deletion button
 * with this number.
 * */
function setLabelBtnScenarioDeletion() {
    // get the length
    var countSelectedDelete = global_arrayShowSzenarioDeletion.length;

    // set label of the deletion button
    $("#btnDeleteSzenario").text("Löschen (" + countSelectedDelete.toString() + ")");
}

// trigger delete scenarios modal window
/**
 * Function shows the delete scenario modal window.
 * */
function showDeleteScenario() {
    showModalWindow($("#modal-delete-szenario"));
}

/**
 * Function shows the confirmation of scenario deletion modal window
 * */
function deleteScenariosConfirm() {
    $("#modal-delete-szenario-confirm").modal({
        show: true
    });
}

/**
 * Function deletes selected scenarios from menu bar. All corresponding learning units on the work place
 * were deleted was well.
 */
function deleteScenarios() {

    // delete all wished scenarios
    for (var i = global_arrayShowSzenarioDeletion.length - 1; i >= 0; i--) {
        // get scenario name
        var nameScenario = global_arrayShowSzenarioDeletion[i]["text"];
        nameScenario = nameScenario.replace(/(\r\n|\n|\r)/gm,"");       // remove return character

        // find right scenario in menu bar and remove it
        $("#menuScenarios").children("li").children("a").children("span.title").each(function() {
            if ( $(this)[0].innerHTML == nameScenario ) {
                var parent = $(this).parent("a").parent("li");
                parent.remove();
            }
        });

        // delete units in container
        $("#stm").children().remove();

        // update unit per scenario list
        for (var j=0; j<myAuthorSystem.length; j++) {
            if (myAuthorSystem[j]["name"] == nameScenario) {
                myAuthorSystem.splice(j, 1);
            }
        }

        // deletes label with currently open scenario if this one was deleted
        if ($("#lname")[0].innerText == nameScenario) {
            $("#lname").html("");
        }
    }

    // needed to clear the selection with the deleted scenarios in it
    global_arrayShowSzenarioDeletion = [];
    $("#choiceDeletionScenarios > select").empty();
    $("#choiceDeletionScenarios > select").select2("val", "");
}

/**
 * Function shows delete scenarios modal window again after canceling the confirmation.
 */
function deleteScenariosNot() {
    showModalWindow($("#modal-delete-szenario"));
}