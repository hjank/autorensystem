/**
 * Created by Helena on 04.09.2015.
 */

var currentConnectionID;
var connectionIsClicked = false;

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
    inst.bind("connection", function (con, e) {
        e.stopPropagation();

        // only use if scenario name is set (don't access at loading scenario)
        if ( $("#lname")[0].innerHTML.length != 0 ) {
            // get current scenario name
            var currentScenario = $("#lname")[0].innerHTML;

            // get current scenario's JSON
            var thisScenario = authorSystemContent.getScenario(currentScenario);
            if (typeof thisScenario !== "undefined") {
                // add connection in current scenario's JSON structure
                thisScenario.addConnection(new Connection().with(
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

                activateConnection(con.connection);
            }
        }
    });


    // triggered if connection or label is clicked
    // c = connection element
    // e = event
    inst.bind("click", function (c, e) {
        activateConnection(c);
        // needed to prevent clicking the container as well
        e.stopPropagation();

    });


    // triggered if unit container, i.e. canvas is clicked
    $("#container").on("click", function() {
        if (connectionIsClicked)
            return false;

        // clear marking from existing learning units
        clearMarkingFromLearningUnits();
        // clear marking from label connections
        clearMarkingFromConnections();

        bool_unitClicked = false;
        connectionIsClicked = false;

        // all tab content invisible
        showScenarioTab();

    });


    // triggered if add unit (plus icon) or create new unit in navigation bar was clicked
    $('#navadd,#createLearnUnit').click(createUnit);

    // if in state machine was scrolled, all elements have to be repainted
    $("#stm").on("scroll", function() {
        inst.repaintEverything();
    });
}

function activateConnection(conn) {
    // for tab bar
    connectionIsClicked = true;
    bool_unitClicked = false;
    fillRelationTab(conn);
}

function clearMarkingFromLearningUnits () {
    $("#stm").children("div.w").css("background", "").css("color", "");
}

function clearMarkingFromConnections () {
    // clear marking from label connections
    $(".aLabel").css("background-color", "").css("color", "");
}


// remove unit and all its connections from canvas
function removeUnitFromCanvas(unitUUID) {
    // delete all connections
    inst.empty(unitUUID);
    inst.remove(unitUUID);
}