/**
 * Created by juliushofler on 13.03.15.
 */


function initLoader() {

    // after finishing the parsing, elements could be added into tab bar
    fillContextTab();
    fillMetadataTab();
    //setScenarios();     // only needed if scenarios already exist at program start
    formatGlobalElements();

    // get URL parameter
    var paramURL = location.search.substr(1);
    paramURL = paramURL.replace(/%20/g, " ");

    // get saved scenario data from loading process
    var savedData = JSON.parse(localStorage.getItem("saveData"));

    // get current scenario data
    if (savedData != null && paramURL == savedData.name) {
        loadedData = savedData;

        // load scenario from JSON file
        loadScenario(loadedData);

        // update scenario list
        updateScenario(loadedData.name);
        myAuthorSystem.splice(-1);
    }

    // only needed for testing
    if (paramURL == "Testszenario") {

        jQuery.get('Testszenario.json', function (data) {
            console.log(data);
            //loadedData = data[0];
            loadedData = data;

            // load scenario from JSON file
            loadScenario(loadedData);

            // update scenario list
            updateScenario(loadedData.name);
            myAuthorSystem.splice(-1);
        });
    }

    // update label
    setLabelBtnScenarioDeletion();
}


/**
 * Function loads a scenario which contains all units, connections und functions.
 * @param {Object} data Contains all data from a scenario
 * */
function loadScenario(data) {

    // get scenario in myAuthorSystem
    myAuthorSystem.push(data);

    /* get scenario in menu */
    // create new container to see new scenario in menu bar
    var liScenario;
    if (data["units"].length != 0) {
        liScenario = $('<li>').addClass('has-sub');
        liScenario.addClass("active");
    } else {
        liScenario = $('<li>').addClass('last');
    }
    liScenario.attr("id", "menu-scenario-load");
    var aClass = $('<a>').attr('href', '#');
    var spanClass = $('<span>').addClass('title');

    // append container in html file
    spanClass.append(data.name);
    aClass.append(spanClass);
    liScenario.append(aClass);
    $("#cssmenu > ul").append(liScenario);

    // get the functionalities into the menu bar
    /*liScenario.children("a").click(function() {
        $(this).removeAttr('href');
        var element = $(this).parent('li');

        if (element.hasClass('open')) {
            element.removeClass('open');
            element.find('li').removeClass('open');
            element.find('ul').slideUp();
        }
        else {
            element.addClass('open');
            element.children('ul').slideDown();
            element.siblings('li').children('ul').slideUp();
            element.siblings('li').removeClass('open');
            element.siblings('li').find('li').removeClass('open');
            element.siblings('li').find('ul').slideUp();
        }
    });*/

    // get units in menu
    if (liScenario.hasClass("has-sub")) {

        // append a holder to toggle the menu bar
        liScenario.children("a").append('<span class="holder"></span>');

        ulScenario = $("<ul>").attr("style", "display:none");

        // put all units in scenario in menu bar
        for (var i=0; i<data["units"].length; i++) {
            var ulScenario;
            var liUnit = $("<li>").addClass("last");
            var aUnit = $("<a>").attr("href", "#");
            var spanUnit = $("<span>");

            // append content name on DOM
            spanUnit[0].innerText = data["units"][i].name;
            aUnit.append(spanUnit);
            liUnit.append(aUnit);
            ulScenario.append(liUnit);
        }
        liScenario.append(ulScenario);
    }

    // set container
    jsPlumb.setContainer($("#stm"));

    // load units from scenario
    for (var j=0; j<data["units"].length; j++) {
        var unit = loadUnit(data["units"][j], (j+1).toString(), inst);

        // set event listeners
        activateFunctionalities(unit);
    }

    // set connections
    for (var k=0; k<data["connections"].length; k++) {
        var c = inst.connect({
            source: data["connections"][k].sourceId,
            target: data["connections"][k].targetId,
            anchors: ["Continuous", "Continuous"],
            //overlays: [["Label", {label: "PRE", id: "label", cssClass: "aLabel" }]]
            overlays: [["Label", {
                label: data["connections"][k].connLabel,
                id: "label",
                cssClass: "aLabel" }]]
        });
        // set title for label
        var label = c.getOverlay("label");
        var labelID = $(label)[0].canvas.id;
        $("#" + labelID)[0].setAttribute("title", data["connections"][k].connTitle);
    }

    // activate quick add learning unit button (little navbar right)
    $("#navadd").css("pointer-events", "");
    $("#navadd").css("color", "rgb(102,102,102)");

    // activate learning unit dropdown menu (big navigation bar)
    $("#navbarLearningUnit").css("pointer-events", "");
    $("#navbarLearningUnit").css("color", "");

    // get name in current scenario label
    $("#lname").html(data.name);
}


