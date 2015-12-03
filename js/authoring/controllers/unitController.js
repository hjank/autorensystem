/**
 * Created by Helena on 02.10.2015.
 */


function createUnit() {

    // lname := scenario name in navBar
    var nameCurrentScenario = $("#lname")[0].innerText;

    // generate a UUID for this new unit. This will also serve as its A-box identifier.
    var uuid = "unit" + uuid4();
    currentUnitUUID = uuid;
    var stateName = $('<input>').attr('type', 'text').css("color", "#34495e");
    // get new unit DOM
    var newState = buildUnitDOM(uuid, stateName);

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


            // update JSON structure: get new unit in its scenario
            var newUnit = new Unit();
            newUnit.setUUID(uuid);
            newUnit.setName(unitName);
            authorSystemContent.getScenario(nameCurrentScenario).addUnit(newUnit);

            // get newState id in unit list // TODO: check this list
            list_units.push(currentUnitUUID);

            // clear marking from existing learning units
            clearMarkingFromLearningUnits();

            // add learning unit in menu bar
            addUnitToMenu(nameCurrentScenario);

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

    currentUnitUUID = unit.getUUID();
    var newState = buildUnitDOM(currentUnitUUID, unit.getName());
    var divContextIcons = newState.children(".unit-icons")[0];

    // get all context information
    var unitContextInfoList = unit.getContextData();
    for (var k in unitContextInfoList) {
        var contextInfo = unitContextInfoList[k];
        var divContextIcon = $("<div>")
            .addClass("unit-icon")
            .attr("id", contextInfo.getID() + k + "icon");
        var icon = formatUnitIcons(contextInfo);

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
    for (var i in unitMetaData)
        addMetaDataToUnit(unitMetaData[i], unit);


    // place unit in state machine
    $(newState).css("top", unit.getPosY() + "px");
    $(newState).css("left", unit.getPosX() + "px");

    // clear marking from existing learning units
    clearMarkingFromLearningUnits();

    plumbUnit(newState);

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


function initUnitEventHandlers () {

    // triggered if learning unit is clicked
    $("#stm").children("div.w").click(function(event) {

        // update global variable: UUID of the clicked unit
        currentUnitUUID = $(this)[0].getAttribute("id");

        bool_unitClicked = true;

        // clear marking from all units
        clearMarkingFromLearningUnits();
        // unit is marked --> change color
        $(this).css("background", "#16a085");
        $(this).css("color", "white");
        // clear marking from label connections
        $(".aLabel").css("background-color", "");
        $(".aLabel").css("color", "");

        // show tab content of the current active tab
        var activeTab = $(".tab-Container > ul > li").children("a.active").attr("href");
        $(activeTab).fadeIn();
        $(".tab-Container").show();
        // hide tab from unit label connection
        $("#tabUnitLabel").hide();


        /* tab "Eigenschaften"*/

        // get current unit's data model
        var current_unit = authorSystemContent.getUnitByUUID(currentUnitUUID);

        // put name into the input field
        //var formObject = document.forms["formProperties"];
        $("#inputUnitName")[0].value = current_unit.getName();

        // set description field
        $("#inputUnitDescription")[0].value = current_unit.getDescription();

        /* tab "Kontextinformation" */
        loadContextTabForUnit(this);

        // prevents that underlying container is also clicked (needed for unit marking)
        event.stopPropagation();

        //console.log(myAuthorSystem);
        console.log(JSON.stringify(authorSystemContent));
    });


    // triggered if unit was dragged
    $("#stm").children("div.w").on("dragstop", function() {

        currentUnitUUID = $(this)[0].getAttribute("id");
        var current_unit = authorSystemContent.getUnitByUUID(currentUnitUUID);

        // get new positions (absolute)
        var top = $(this)[0].offsetTop;
        var left = $(this)[0].offsetLeft;

        // only set if current unit object exists
        if (current_unit) {
            current_unit.posX = left;
            current_unit.posY = top;
        }
    });
}


/**
 * This function adds the given meta datum to the given unit's DOM element.
 * @param {String} metaDatum The meta datum's ID
 * @param {Element} unit Contains the currently clicked unit's DOM element
 * */
function addMetaDataToUnit(metaDatum, unit) {

    // update JSON structure
    var current_unit = authorSystemContent.getUnitByUUID(currentUnitUUID);
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
    var current_unit = authorSystemContent.getUnitByUUID(currentUnitUUID);
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