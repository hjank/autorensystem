/**
 * Created by Helena on 06.09.2015.
 */


$(function() {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="checkbox"]').radiocheck();
    $('[data-toggle="switch"]').bootstrapSwitch();
    $("select").select2({dropdownCssClass: "dropdown-inverse"});

    //setScenarios();     // only needed if scenarios already exist at program start
    setLabelBtnScenarioDeletion();
});


// opens new modal window to confirm scenario deletion
/**
 * Function shows the confirmation of scenario deletion modal window
 * */
function deleteScenariosConfirm() {

    // show modal window
    $("#modal-delete-szenario-confirm").modal({
        show: true
    });
}


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


// delete scenarios from menu bar and clears state machine
/**
 * Function deletes selected scenarios from menu bar. All corresponding learning units on the work place
 * were deleted was well.
 * */
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
        if ( $("#lname")[0].innerText == nameScenario ) {
            $("#lname").html("");
        }
    }

    // needed to clear the selection with the deleted scenarios in it
    global_arrayShowSzenarioDeletion = [];
    $("#choiceDeletionScenarios > select").empty();
    $("#choiceDeletionScenarios > select").select2("val", "");
}


// get back to deletion overview after canceling deletion
/**
 * Function shows delete scenarios modal window again after canceling the confirmation.
 * */
function deleteScenariosNot() {

    // show modal window
    $("#modal-delete-szenario").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}