/**
 * Created by juliushofler on 13.03.15.
 */


function initLoader() {
    // after finishing the parsing, elements could be added into tab bar
    setContextTabListeners();
    //setScenarios();     // only needed if scenarios already exist at program start
    formatGlobalElements();

    $.ajax({
        url: "/loadData",
        type: "POST",
        success: function(response) {
            // saved data was found
            if (response != "NO_SAVED_DATA") {
                var loadedData = JSON.parse(response);

                loadedData["_scenarioList"].forEach(function(theScenarioData) {
                    var theScenario = new Scenario().fromJSON(theScenarioData);

                    // load the scenario into the model
                    loadSavedScenario(theScenario);

                    // update scenario list
                    updateScenario(theScenario.getName());

                    // TODO: Find out why this should be necessary. Seems inefficient, if not useless. EDIT: Agreed! (tobias).
                    // authorSystemContent.removeScenario(theScenario.getName());
                });

                authorSystemContent.setGUIs(loadedData["_guis"]);
                guis = loadedData["_guis"];
            }
        }
    });
}


/**
 * TODO: This whole function needs to be adjusted to changes in "data".
 * Function loads a scenario which contains all units, connections und functions.
 * @param {Scenario} theScenario Contains all data from a scenario
 * */
function loadSavedScenario(theScenario) {
    // get scenario in myAuthorSystem
    authorSystemContent.addScenario(theScenario);

    /* get scenario in menu */
    // create new container to see new scenario in menu bar
    var liScenario;
    if (theScenario.hasUnits()) {
        liScenario = $('<li>').addClass('has-sub');
        liScenario.addClass("active");
    } else {
        liScenario = $('<li>').addClass('last');
    }
    liScenario.attr("id", "menu-scenario-load");
    var aClass = $('<a>').attr('href', '#');
    var spanClass = $('<span>').addClass('title');

    // append container in html file
    spanClass.append(theScenario.getName());
    aClass.append(spanClass);
    liScenario.append(aClass);
    $("#cssmenu > ul").append(liScenario);

    // get the functionalities into the menu bar
    liScenario.children("a").click(function() {
        $(this).removeAttr('href');
        var element = $(this).parent('li');

        if (element.hasClass('open')) {
            element.removeClass('open');
            element.find('li').removeClass('open');
            element.find('ul').slideUp();
        } else {
            element.addClass('open');
            element.children('ul').slideDown();
            element.siblings('li').children('ul').slideUp();
            element.siblings('li').removeClass('open');
            element.siblings('li').find('li').removeClass('open');
            element.siblings('li').find('ul').slideUp();
        }
    });

    // get units in menu
    if (liScenario.hasClass("has-sub")) {
        // append a holder to toggle the menu bar
        liScenario.children("a").append('<span class="holder"></span>');

        var ulScenario = $("<ul>").attr("style", "display:none");

        // put all units in scenario in menu bar
        theScenario.getUnits().forEach(function(theUnit) {
            var liUnit = $("<li>");
            var aUnit = $("<a>").attr("href", "#");
            var spanUnit = $("<span>");

            // append content name on DOM
            spanUnit[0].innerText = theUnit.getName();
            aUnit.append(spanUnit);
            liUnit.append(aUnit);
            ulScenario.append(liUnit);

            var ulUnit = $("<ul>").attr("style", "display:block");

            // add context information
            theUnit.getContextData().forEach(function(theContextData) {
                ulUnit.append("<li><a class='fui-info-circle'> "+theContextData.getTranslatedID()+"</a></li>");
                liUnit.addClass("has-sub");
            });

            // add source relations
            theScenario.getSourceConnectionsForUnitByUUID(theUnit.getUUID()).forEach(function(theConnection) {
                ulUnit.append("<li><a class='fui-arrow-left'> "+theScenario.getUnitByUUID(theConnection.getTargetId()).getName()+" ("+theConnection.getLabel()+")</a></li>");
                liUnit.addClass("has-sub");
            });

            // add target relations
            theScenario.getTargetConnectionsForUnitByUUID(theUnit.getUUID()).forEach(function(theConnection) {
                ulUnit.append("<li><a class='fui-arrow-right'> "+theScenario.getUnitByUUID(theConnection.getSourceId()).getName()+" ("+theConnection.getLabel()+")</a></li>");
                liUnit.addClass("has-sub");
            });

            liUnit.append(ulUnit);
        });


        liScenario.append(ulScenario);
    }

    // set container
    jsPlumb.setContainer($("#stm"));

    // load units from the scenario
    var unitsList = theScenario.getUnits();
    for (var j in unitsList) {
        loadUnit(unitsList[j], (j+1).toString());
    }

    // load connections from the scenario
    theScenario.getConnections().forEach(function(theConnection) {
        var c = inst.connect({
            source: theConnection.getSourceId(),
            target: theConnection.getTargetId(),
            anchors: ["Continuous", "Continuous"],
            paintStyle: {
                strokeStyle: "#5c96bc",
                lineWidth: 1,
                outlineColor: "transparent",
                outlineWidth: 4
            },
            overlays: [
                ["Label", {
                    label: theConnection.getLabel(),
                    id: "label",
                    cssClass: "aLabel"
                }]
            ]
        });

        // set title for label
        var label = c.getOverlay("label");
        var labelID = $(label)[0].canvas.id;
        $("#" + labelID)[0].setAttribute("title", theConnection.getTitle());

        theConnection.setID(c.id);
    });

    // activate quick add learning unit button (little navbar right)
    $("#navadd").css("pointer-events", "");
    $("#navadd").css("color", "rgb(102,102,102)");

    // activate learning unit dropdown menu (big navigation bar)
    $("#navbarLearningUnit").css("pointer-events", "");
    $("#navbarLearningUnit").css("color", "");

    // get name in current scenario label
    $("#lname").html(theScenario.getName());
}