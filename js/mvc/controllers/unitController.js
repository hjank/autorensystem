/**
 * Created by Helena on 02.10.2015.
 */


function createUnit() {

    /* if loaded sceanrio */
    // get last id number
    var max = 0;
    $("#stm").children("div.w").each(function() {
        var id = parseInt($(this)[0].getAttribute("id").slice(-1));
        if (id > max) {
            max = id;
        }
    });
    // prevent that two unit have the same id
    max = max + 1;

    // build unit DOM
    var newState = $('<div>').attr('id', 'state' + max).addClass('w');
    var title = $('<div>').addClass('title').css("padding", "0px 7px");

    var stateName = $('<input>').attr('type', 'text').css("color", "#34495e");
    title.append(stateName);

    // add div for context information icons
    var divContextIcons = $("<div>").addClass("unit-icons");

    // create connection point
    var ep = $('<div>').addClass('ep');

    window.jsp = inst;
    var windows = jsPlumb.getSelector("#stm .w");

    // add elements to unit DOM
    newState.append(divContextIcons);
    newState.append(title);
    newState.append(ep);

    // add unit DOM to state machine
    $('#stm').append(newState);

    var nameSet = false;

    // if the unit name was written and enter was clicked
    stateName.keyup(function(e) {
        if (e.keyCode === 13) {

            var unitName = this.value;
            // prevent unnamed units
            if (unitName == "") {
                alert("[Fehler] Bitte geben Sie einen Namen ein.\n");
                return false;
            }

            // set unit name
            $(this).parent().text(unitName);

            // set event listeners
            activateFunctionalities(newState);

            // set the new unit as current unit name
            global_currentInputUnitName = unitName;

            // lname := scenario name in navBar
            var nameCurrentScenario = $("#lname")[0].innerText;
            // add learning unit in menu bar
            addUnitToMenu(nameCurrentScenario)
            // update JSON structure: get new unit in its scenario
            addUnitToScenarioModel(nameCurrentScenario, unitName);

            // hide tabs because all units will be unmarked
            $(".tabContents").hide();
            nameSet = true;
        }

        // to set the source and target points, it is necessary to wait until the name was entered
        // --> prevent the wrong placement of the dots
        if (nameSet) {
            plumbUnit(newState, ep);
            nameSet = false;
        }
    });
    // set focus on input field
    stateName.focus();
}


/**
 * Function loads
 * Hint: The website will be new loaded.
 * @param {Object} unit Contains all information about the unit
 * @param {String} j Contains the running ID number
 * @return {Object} Contains the unit DOM element
 * */
function loadUnit(unit, j) {

    window.jsp = inst;

    // build unit DOM
    var newState = $('<div>').attr('id', 'state' + j).addClass('w');
    var title = $('<div>').addClass('title').css("padding", "0px 7px");
    title.html(unit.name);
    var ep = $('<div>').addClass('ep');

    // add div for context information icons
    var divContextIcons = $("<div>").addClass("unit-icons");

    // add elements to unit DOM
    newState.append(divContextIcons);
    newState.append(title);
    newState.append(ep);

    // add unit to state machine
    $('#stm').append(newState);

    // get all context information
    for (var k= 0; k<unit["contextInformations"].length; k++) {
        var divContextIcon = $("<div>")
            .addClass("unit-icon")
            .attr("id", unit["contextInformations"][k]["name"] + k + "icon");
        var icon = unit["contextInformations"][k]["icon"];

        // add icon und div to unit
        divContextIcon.append(icon);
        divContextIcons.append(divContextIcon);

        // get state of satisfiability
        if (unit["sat"] == "all") {
            divContextIcons.css("border", "2px solid #adadad");
            divContextIcons.attr("ci", "all");
        } else {
            divContextIcons.css("border", "2px dotted #adadad");
            divContextIcons.attr("ci", "one");
        }

        // design for icons
        divContextIcons.css("border-radius", "4px");
        newState.css("padding-top", "10px");
        divContextIcons.css("height", "23px");
        divContextIcons.css("display", "inline-block");
    }

    // get all meta data
    for (var l= 0; l<unit["metaData"].length; l++) {
        var divMetaIcon = $("<div>").addClass("unit-meta-icons").attr("id", unit["name"] + l + "metaIcon");

        var metaIcon = chooseMetaIcon(unit["metaData"][l]["name"]);
        divMetaIcon.attr("title", unit["metaData"][l]["name"]);

        // add meta icon to unit DOM
        var bMetaIcon = $("<b>").addClass(metaIcon);
        divMetaIcon.append(bMetaIcon);
        newState.append(divMetaIcon);

        // change size of learning unit
        newState.css("padding-bottom", "5px");
    }

    // place unit in state machine
    $(newState).css("top", unit.posY + "px");
    $(newState).css("left", unit.posX + "px");

    plumbUnit(newState, ep);

    return newState;

}


function plumbUnit(newState, ep) {

    // make the unit draggable
    inst.draggable(newState, {
        //containment: 'parent'
        containment: '.body'
    });

    // set target point
    inst.makeTarget(newState, {
        anchor: "Continuous",
        dropOptions: { hoverClass: "dragHover" },
        allowLoopback: false
    });

    // set source point
    inst.makeSource(ep, {
        parent: newState,
        anchor: "Continuous",
        connector: [ "StateMachine", { curviness: 20 } ],
        connectorStyle: {
            strokeStyle: "#5c96bc",
            lineWidth: 2,
            outlineColor: "transparent",
            outlineWidth: 4
        }
    });
}