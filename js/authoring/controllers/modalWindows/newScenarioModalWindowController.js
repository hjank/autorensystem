/**
 * Created by Helena on 06.09.2015.
 */

var global_ScenarioLiNumber = 0;

$(function() {
    // make sure that after pressing enter in input or modal window "Neues Szenario erstellen"
    // the same steps were gone like clicking on the create button
    $("#modal-new-szenario, #sname").on("keyup", checkScenarioName );

    // set the trigger for the new scenario modal window
    $("#showNewScenario").on("click", showNewScenario);

    // set the trigger for after clicking the save button in scenario creation
    $("#btnSE").on("click", createScenario);
});

// checks if a valid name was entered, and in that case calls scenario creation
function checkScenarioName(e) {
    if (e.keyCode == 13) {
        if (!/[A-Z]+[0-9]*/i.test($("#sname").val()))
            alert("[Fehler] Bitte geben Sie einen g�ltigen Namen ein. Zul�ssig sind Buchstaben und (optional) Zahlen.\n");
        createScenario();
        $('#modal-new-szenario').modal('hide');
        return (e.target.id != "sname");
    }
    return true;
}

/**
 * Function shows the new scenario modal window.
 */
function showNewScenario() {
    var newScenarioElement = $("#modal-new-szenario");

    newScenarioElement.submit(function(e){
        e.preventDefault();
    });

    // set focus to scenario name input field
    newScenarioElement.on("shown.bs.modal", function () {
        $("#sname").focus();
    });

    showModalWindow(newScenarioElement);
}

/**
 * Function creates a new scenario.
 * It adds the name in the menu bar and in the header above the working place.
 * Is Triggered after clicking save button in modal window scenario creation.
 */
function createScenario() {
    var stateMachineContainerElement = $("#stm");
    var navbarAddLearningUnitButtonElement = $("#navadd");
    var learningUnitDropdownMenuElement = $("#navbarLearningUnit");

    // get name from input field
    var scenarioName = $("#sname").val();

    // write scenario name on the little navigation bar
    $("#lname").html(scenarioName);

    // count number of scenarios (needed for different ids)
    global_ScenarioLiNumber++;

    // create new container to see new scenario in menu bar
    var liClass = $('<li>').addClass('last');
    liClass.attr("id", "menu-scenario-" + global_ScenarioLiNumber);
    var aClass = $('<a>').attr('href', '#');
    var spanClass = $('<span>').addClass('title');

    // append container in html file
    spanClass.append(scenarioName);
    aClass.append(spanClass);
    liClass.append(aClass);
    $("#cssmenu > ul").append(liClass);

    // update scenario list and canvas
    updateScenario(scenarioName);
    setLabelBtnScenarioDeletion();

    // remove all units from state machine container
    stateMachineContainerElement.empty();

    // defines DOM as jsPlump container
    jsPlumb.setContainer(stateMachineContainerElement);

    // activate quick add learning unit button (little navbar right)
    navbarAddLearningUnitButtonElement.css("pointer-events", "");
    navbarAddLearningUnitButtonElement.css("color", "rgb(102,102,102)");

    // activate learning unit dropdown menu (big navigation bar)
    learningUnitDropdownMenuElement.css("pointer-events", "");
    learningUnitDropdownMenuElement.css("color", "");
}

/**
 * Add scenario as a select option.
 *
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
    global_ScenarioCounter++;

    // update list with units per scenario
    //myAuthorSystem.push({name: name, units:[], connections:[]});

    var newScenario = new Scenario();
    newScenario.setName(name);
    authorSystemContent.addScenario(newScenario);
}