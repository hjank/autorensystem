/**
 * Created by Helena on 04.09.2015.
 */

var currentConnectionID;

function initPlumbCanvas() {

    inst = jsPlumb.getInstance({
        Endpoint: ["Dot", {radius: 2}],
        HoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 2 },
        ConnectionOverlays: [
            [ "Arrow", {
                location: 1,
                id: "arrow",
                length: 14,
                foldback: 0.8
            } ]
                //[ "Label", { label: "connecting", id: "label", cssClass: "aLabel" }]
        ],
        Container: "stm"
    });

    // set state machine as container
    jsPlumb.setContainer($("#stm"));

    // triggered before connection is set to prevent drawing a self loop
    inst.bind("beforeDrop", function (con) {
        // source and target ID's are same

        // this doesn't work (anymore): con.sourceId returns ID of connection
        // if (con.sourceId === con.targetId) {
        return !(con.connection.source.parentElement.id === con.targetId);
    });


    // triggered if a connection was drawn between to units
    inst.bind("connection", function (con) {

        // only use if scenario name is set (don't access at loading scenario)
        if ( $("#lname")[0].innerHTML.length != 0 ) {
            // get current scenario name
            var currentScenario = $("#lname")[0].innerHTML;

            // get current scenario's JSON
            var thisScenario = authorSystemContent.getScenario(currentScenario);
            if (typeof thisScenario !== "undefined") {
                // add connection in current scenario's JSON structure
                thisScenario.addConnection(new Connection(
                    con.connection.id,
                    con.source.parentElement.id,
                    con.targetId,
                    "PRE",
                    "Voraussetzung (PRE)"));

                // add label to connection
                con.connection.addOverlay([ "Label", { label: "PRE", id: "label", cssClass: "aLabel" }]);

                // add title to label
                var label = con.connection.getOverlay("label");
                var labelID = $(label)[0].canvas.id;
                $("#" + labelID)[0].setAttribute("title", "Vorausetzung (PRE)");
            }


            /*for (var n=0; n<myAuthorSystem.length; n++) {
                if (myAuthorSystem[n].name == currentScenario) {
                    myAuthorSystem[n]["connections"].push({
                        sourceId:con.source.parentElement.id,
                        targetId:con.targetId,
                        connId:con.connection.id,
                        connLabel: "PRE",
                        connTitle: "Voraussetzung (PRE)"
                    });
                    // add label to connection
                    con.connection.addOverlay([ "Label", { label: "PRE", id: "label", cssClass: "aLabel" }]);

                    // add title to label
                    var label = con.connection.getOverlay("label");
                    var labelID = $(label)[0].canvas.id;
                    $("#" + labelID)[0].setAttribute("title", "Vorausetzung (PRE)");
                    break;
                }
            }*/
        }
    });


    // triggered if connection or label is clicked
    // c = connection element
    // e = event
    inst.bind("click", function (c, e) {

        var label = c.getOverlay("label");
        // update current label
        currentConnectionID = label.canvas.id;

        // test 'if (label.id == "label")' is obsolete since jsPlumb hands in parameter c : Connection

        // get name of source and target unit
        var sourceUnit = c.source.parentElement.innerText;
        var targetUnit = c.target.innerText;

        // add names in relations labels
        $("#preLabelRelations").html(sourceUnit + " ist eine");
        $("#postLabelRelations").html("für " + targetUnit);

        // clear markings from connection labels
        $(".aLabel").css("background-color", "");
        $(".aLabel").css("color", "");
        // set label connection mark
        $("#" + currentConnectionID).css("background-color", "#1e8151");
        $("#" + currentConnectionID).css("color", "white");

        // clear unit marking and hide unit properties
        $(".w").css("background", "");
        $(".w").css("color", "");
        $(".tabContents").hide();
        $(".tab-Container").hide();

        // show relations tab: set label connection property visible
        $("#tabUnitLabel").css("display", "block");

        // show right selection of the current label in selection bar
        $("#selectRelations").children("option").each(function() {
            if ( $(this)[0].value.toUpperCase() == label.label ) {
                $("#selectRelations").select2("data", {
                    id:$(this)[0].value,
                    text:$(this)[0].innerHTML
                });
            }
        });
        // needed to prevent clicking the container as well
        e.stopPropagation();

    });




    // deletes selected connection
    $("#btnDeleteConnection").on("click", function() {
        // get connection object
        var con = $("#" + currentConnectionID)[0]._jsPlumb.component;

        // detach connection
        inst.detach(con);

        // get id and current scenario name
        var connID = con.id;
        var currentScenario = $("#lname")[0].innerHTML;

        // get current scenario's JSON
        var thisScenario = authorSystemContent.getScenario(currentScenario);
        // delete connection in JSON structure
        thisScenario.removeConnection(thisScenario.getConnection(connID));

        // hide tab after connection was deleted
        $("#tabUnitLabel").hide();
    });


    // triggered if an option for a label connection was selected
    $("#selectRelations").select2().on("select2-selecting", function(e) {

        // set new name on label
        $("#" + currentConnectionID).html(e.val.toUpperCase());
        $("#" + currentConnectionID)[0].setAttribute("title", e.choice.text);

        // unmark label
        $("#" + currentConnectionID).css("background-color", "");
        $("#" + currentConnectionID).css("color", "");

        // hide property in tab
        $("#tabUnitLabel").hide();

        // get connection id and scenario name
        var connID = $("#" + currentConnectionID)[0]._jsPlumb.component.id;
        var currentScenario = $("#lname")[0].innerHTML;

        // get current scenario's JSON
        var thisScenario = authorSystemContent.getScenario(currentScenario);
        var thisConnection = thisScenario.getConnection(connID);
        thisConnection.setLabel(e.val.toUpperCase());
        thisConnection.setTitle(e.choice.text);

    });


    // triggered if unit container, i.e. canvas is clicked
    $("#container").on("click", function() {

        // clear marking from existing learning units
        clearMarkingFromLearningUnits();

        bool_unitClicked = false;

        // clear marking from label connections
        $(".aLabel").css("background-color", "");
        $(".aLabel").css("color", "");

        // all tab content invisible
        $(".tabContents").hide();
        $(".tab-Container").hide();
        $("#tabUnitLabel").hide();
    });


    // triggered if add unit (plus icon) or create new unit in navigation bar was clicked
    $('#navadd,#createLearnUnit').click(function(e) {

        createUnit();

        // if in state machine was scrolled, all elements have to be repainted
        $("#stm").on("scroll", function() {
            inst.repaintEverything();
        });
    });


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

        // set listener for button "Bestätigen" in tab "Kontextinformation"
        activateContextConfirmation($(this), unitSatisfiesAllContextInfos, current_unit);
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

function clearMarkingFromLearningUnits () {
    for (var l=0; l<list_units.length; l++) {
        $(list_units[l]).css("background", "");
        $(list_units[l]).css("color", "");
    }
}

// delete current unit + connections in tab "Eigenschaften"
function deleteUnitFromView(unitName) {

    // get current scenario name
    var currentScenario = $("#lname")[0].innerHTML;

    // needed to find scenario in menu bar
    var liCurrentScenario;
    $("#menuScenarios").children("li").children("a").children("span.title").each(function() {
        if ( $(this)[0].innerHTML == currentScenario ) {
            liCurrentScenario = $(this).parent("a").parent("li");
        }
    });
    // delete unit in menu bar
    liCurrentScenario.children("ul").children("li").each(function() {
        if ($(this).children("a").children("span")[0].innerHTML == unitName) {
            $(this).remove();
        }
    });

    // find right unit and remove it from canvas
    $("#stm").children("div.w").children("div.title").each(function() {
        if (this.innerHTML == unitName) {
            // get unit id
            var unitID = $(this).parent()[0].getAttribute("id");

            // delete all connections
            inst.detachAllConnections($("#" + unitID));

            // delete unit
            $(this).parent().remove();
        }
    });
}


// delete one or more units + connections in modal window "Lernszenarien l�schen"
function deleteSelectedUnitsFromDOM() {

    // get all selected units which should be deleted from multi selection bar
    var list_deleteableUnits = $("#selectMultiDeleteUnits").select2("data");

    for (var i=0; i<list_deleteableUnits.length; i++) {
        // get unit id
        var unitID = list_deleteableUnits[i].id;
        var uuidSelector = "[uuid="+unitID+"]";
        // delete all connections
        inst.detachAllConnections($(uuidSelector));

        // delete unit in canvas
        $(uuidSelector).remove();
    }
}