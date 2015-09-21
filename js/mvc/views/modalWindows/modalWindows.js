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
});






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