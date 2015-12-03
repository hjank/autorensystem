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

        fillRelationTab(c);
        // needed to prevent clicking the container as well
        e.stopPropagation();

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
        initUnitEventHandlers();

        // if in state machine was scrolled, all elements have to be repainted
        $("#stm").on("scroll", function() {
            inst.repaintEverything();
        });
    });

}



function clearMarkingFromLearningUnits () {
    for (var l in list_units) {
        $("#"+list_units[l]).css("background", "");
        $("#"+list_units[l]).css("color", "");
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