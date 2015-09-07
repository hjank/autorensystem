/**
 * Created by Julius Höfler on 17.03.15.
 */

var global_ScenarioCounter = 0;
var global_dataArrayScenarios = [];
var global_arrayShowSzenarioDeletion = [];
var global_ScenarioLiNumber = 0;
//var gloabl_unitsPerScenario = [];


$(function() {

    // make sure that after clicking enter in modal window "Neues Szenario erstellen"
    // the same steps were gone like clicking on the create button
    $("#modal-new-szenario").keypress(function(e) {
        if (e.keyCode == 13) {
            saveCloseSzenario();
            $('#modal-new-szenario').modal('hide');
            return true;
        }
    });

    // make sure that after clicking enter in input "Neues Szenario erstellen"
    // the same steps were gone like clicking on the create button
    $("#sname").keypress(function(e) {
        if (e.keyCode == 13) {
            saveCloseSzenario();
            $('#modal-new-szenario').modal('hide');
            return false;
        }
    });

    // triggered if load button was clicked in modal window load scenario
    $("#btnLoadScenario").on("click", function() {

        // get name of the selected scenario
        var selectedScenario = $("#s2id_listLoadScenarios")[0].innerText.slice(0, -1);

        // find right scenario
        for (var i=0; i<myAuthorSystem.length; i++) {
            if (myAuthorSystem[i].name == selectedScenario) {
                // save scenario object in JSON structure
                localStorage.setItem("saveData", JSON.stringify(myAuthorSystem[i]));

                // add name in URL
                $(location).attr("href", "?" + selectedScenario);
            }
        }

        // only for testing
        if (selectedScenario == "Testszenario") {

            // add name in URL
            $(location).attr("href", "?" + selectedScenario);
        }

    });
});







// trigger delete scenarios modal window
/**
 * Function shows the delete scenario modal window.
 * */
function showDeleteScenario() {

    // show modal window
    $("#modal-delete-szenario").modal({
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

// add scenario as a select option
/**
 * Function
 * @param {String} name Name of the new Scenario
 * */
function updateScenario(name) {
    var j = global_ScenarioCounter;

    // add scenario as an option in selection bar
    var optionClass = $('<option>').attr('value', j.toString());
    optionClass.html(name);
    optionClass.attr("selected", "");
    $("#selectSzenarioDeletion").append(optionClass);

    // get scenario data in multi selection bar
    global_dataArrayScenarios.push({id: j, text: name});
    $("#selectSzenarioDeletion").select2("data", global_dataArrayScenarios);
    global_ScenarioCounter = global_ScenarioCounter + 1;

    // update list with units per scenario
    myAuthorSystem.push({name: name, units:[], connections:[]});
}


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

});





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

})

