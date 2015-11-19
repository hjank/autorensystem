/**
 * Created by Helena on 02.10.2015.
 */


function createUnit() {

    /* if loaded sceanrio */
    // generate a UUID for this new unit. This will also serve as its A-box identifier.
    var uuid = uuid4();
    var stateName = $('<input>').attr('type', 'text').css("color", "#34495e");
    // get new unit DOM
    var newState = buildUnitDOM(uuid, stateName);

    var nameSet = false;

    // if the unit name was written and enter was clicked
    stateName.keyup(function(e) {
        if (e.keyCode === 13) {

            global_currentInputUnitName = this.value;
            // prevent unnamed units
            if (global_currentInputUnitName == "") {
                alert("[Fehler] Bitte geben Sie einen Namen ein.\n");
                return false;
            }

            // set unit name
            $(this).parent().text(global_currentInputUnitName);

            // set event listeners
            activateFunctionalities(newState);

            // lname := scenario name in navBar
            var nameCurrentScenario = $("#lname")[0].innerText;

            // add learning unit in menu bar
            addUnitToMenu(nameCurrentScenario);

            // update JSON structure: get new unit in its scenario
            var newUnit = new Unit();
            newUnit.setUUID(uuid);
            newUnit.setName(global_currentInputUnitName);
            authorSystemContent.getScenario(nameCurrentScenario).addUnit(newUnit);

            // hide tabs because all units will be unmarked
            $(".tabContents").hide();
            nameSet = true;
        }

        // to set the source and target points, it is necessary to wait until the name was entered
        // --> prevent the wrong placement of the dots
        if (nameSet) {
            plumbUnit(newState);
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
 * */
function loadUnit(unit, j) {

    var newState = buildUnitDOM(unit.getUID(), unit.getName());
    var divContextIcons = newState.children(".unit-icons")[0];

    // get all context information
    var unitContextInfoList = unit.getContextData();
    for (var k in unitContextInfoList) {
        var divContextIcon = $("<div>")
            .addClass("unit-icon")
            .attr("id", unitContextInfoList[k]["name"] + k + "icon");
        var icon = unitContextInfoList[k]["icon"];

        // add icon und div to unit
        divContextIcon.append(icon);
        divContextIcons.append(divContextIcon);

        // get state of satisfiability
        if (unit.getSat() == "all") {
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
    var unitMetaData = unit.getMetaData();
    for (var l in unitMetaData) {
        var divMetaIcon = $("<div>")
            .addClass("unit-meta-icons")
            .attr("id", unit.getName() + l + "metaIcon");

        var metaIcon = chooseMetaIcon(unitMetaData[l]["name"]);
        divMetaIcon.attr("title", unitMetaData[l]["name"]);

        // add meta icon to unit DOM
        var bMetaIcon = $("<b>").addClass(metaIcon);
        divMetaIcon.append(bMetaIcon);
        newState.append(divMetaIcon);

        // change size of learning unit
        newState.css("padding-bottom", "5px");
    }

    // place unit in state machine
    $(newState).css("top", unit.getPosY() + "px");
    $(newState).css("left", unit.getPosX() + "px");

    plumbUnit(newState);

    return newState;

}

// set properties for newly created unit in jsPlumb instance
function plumbUnit(newState) {
    var ep = newState.children(".ep")[0];

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

function chooseMetaIcon(metaDataName) {
    switch (translate_metaData(metaDataName)) {
        case "Bild":
            return "fui-photo";
        case "Film":
            return "fui-video";
        case "Text":
            return "fui-document";
        case "Navigation":
            return "fui-location";
        case "Test":
            return "fui-radio-unchecked";
        case "Audio":
            return "fui-volume";
        case "3D Umgebung":
            return "fui-windows";
    }
}

/**
 * This function adds the given meta datum to the given unit's DOM element.
 * @param {String} metaDatum The meta datum's ID
 * @param {Element} unit Contains the currently clicked unit's DOM element
 * */
function addMetaDataToUnit(metaDatum, unit) {

    // update JSON structure
    var current_unit = getCurrentUnitDataModel();
    current_unit.addMetaInfo({
        name : metaDatum,
        icon : metaIcon
    });

    // create meta data DOM
    var divMetaIcon = $("<div>")
        .addClass("unit-meta-icons")
        .attr("id", current_unit.getName() + current_unit.getMetaData().length + "metaIcon");

    // choose icon symbol and add it to meta data DOM
    var metaIcon = chooseMetaIcon(metaDatum);
    divMetaIcon.attr("title", metaDatum);

    // add DOM for meta data icon (glyph)
    var bMetaIcon = $("<b>").addClass(metaIcon);

    // get icon into learning unit
    divMetaIcon.append(bMetaIcon);
    $(unit).append(divMetaIcon);

    // change size of learning unit
    $(unit).css("padding-bottom", "5px");


    // set endpoints on the right place
    inst.repaintEverything();
}

/**
 * This function removes the given meta datum from the given unit's DOM element.
 * @param {String} metaDatum The meta datum's ID
 * @param {Element} unit Contains the currently clicked unit's DOM element
 * */
function removeMetaDataFromUnit(metaDatum, unit) {

    // update JSON structure
    var current_unit = getCurrentUnitDataModel();
    var currentUnitMetaData = current_unit.getMetaData();
    for (var j in currentUnitMetaData) {
        if (currentUnitMetaData[j].name == metaDatum) {
            currentUnitMetaData.splice(j, 1);
        }
    }

    // find the right meta icon
    var metaDataIcons = $(unit).find("div.unit-meta-icons");
    metaDataIcons.each(function() {
        // remove the right icon from unit
        if ($(this)[0].title == metaDatum) {
            this.remove();
            return false;
        }
    });

    if (metaDataIcons.length == 0)
        $(unit).css("padding-bottom", "");

    // set endpoints on the right place
    inst.repaintEverything();
}

// temporary helper function: returns the data model of the currently clicked unit
function getCurrentUnitDataModel() {

    var currentScenario = authorSystemContent.getScenario($("#lname")[0].innerText);
    return currentScenario.getUnitByName(global_currentInputUnitName);

/*    // get current unit dictionary if scenario was loaded
    if (loadedData) {
        for (var q=0; q<loadedData["units"].length; q++) {
            if (loadedData["units"][q]["name"] == global_currentInputUnitName) {
                return loadedData["units"][q];
            }
        }
    }
    // get current unit dictionary
    for (var p=0; p<myAuthorSystem.length; p++) {
        if (myAuthorSystem[p]["name"] == $("#lname")[0].innerText) {
            for (var q=0; q<myAuthorSystem[p]["units"].length; q++) {
                if (myAuthorSystem[p]["units"][q]["name"] == global_currentInputUnitName) {
                    return myAuthorSystem[p]["units"][q];
                }
            }
        }
    }*/
}


// build unit DOM
function buildUnitDOM(uuid, name) {

    var newState = $('<div>')
        .attr("id", uuid)
        .addClass('w');

    var title = $('<div>').addClass('title').css("padding", "0px 7px");
    title.append(name);

    // add div for context information icons
    var divContextIcons = $("<div>").addClass("unit-icons");
    // create connection point
    var ep = $('<div>').addClass('ep');

    window.jsp = inst;
    //var windows = jsPlumb.getSelector("#stm .w");

    // add elements to unit DOM
    newState.append(divContextIcons);
    newState.append(title);
    newState.append(ep);

    // add unit DOM to state machine
    $('#stm').append(newState);

    return newState;
}