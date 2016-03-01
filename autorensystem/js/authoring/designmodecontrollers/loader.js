

$( document ).ready(function() {
	
	$("#saveScenario").on("click", function() {
		//save();
	});
	
});


function save() {
	console.log('Autorensystem: ' + JSON.stringify(authorSystemContent));
	var savecontent = {};
	savecontent.authorsystem = authorSystemContent;
	savecontent.guis = guis;
	savecontent.authorname = $("#username-dropdown").text();
	//console.log('autorensystem: ' + JSON.stringify(savecontent));
	$.post("http://localhost:3000/save", JSON.stringify(savecontent), function(data){       
		if(data=='OK') {
            //$('username-dropdown').text(username);
			alert(OK);
        } else {
			alert(NO);
		}
    });
}
/*
function openScenario() {
	


}

function loading(loadedAuthorsystem) {
	var scenarios = loadedAuthorsystem.getScenarios();
	for (sc in scenarios) {
		createScenarioLoading();
	}
}




// Lade szenarien 
// Julius' Version
function createScenarioLoading(scenarioName) {
    var stateMachineContainerElement = $("#stm");
    var navbarAddLearningUnitButtonElement = $("#navadd");
    var learningUnitDropdownMenuElement = $("#navbarLearningUnit");

    // get name from input field
    //var scenarioName = $("#sname").val();

    // write scenario name on the little navigation bar
    $("#lname").html(scenarioName);

    // count number of scenarios (needed for different ids)
    //global_ScenarioLiNumber++;

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
*/