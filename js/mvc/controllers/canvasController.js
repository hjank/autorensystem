/**
 * Created by Helena on 04.09.2015.
 */


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

            // add connection in JSON structure
            for (var n=0; n<myAuthorSystem.length; n++) {
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
            }
        }
    });


    var current_labelConnection;
    // triggered if connection or label is clicked
    // c = connection element
    // e = event
    inst.bind("click", function (c, e) {

        var label = c.getOverlay("label");

        // if label was clicked show tab information --> test is obsolete since jsPlumb hands in parameter c : Connection
        if (label.id == "label") {

            // get name of source and target unit
            var sourceUnit = c.source.parentElement.innerText;
            var targetUnit = c.target.innerText;

            // add names in relations labels
            $("#preLabelRelations").html(sourceUnit + " ist eine");
            $("#postLabelRelations").html("für " + targetUnit);

            // update current label
            current_labelConnection = label.canvas.id;

            // clear marking from label connections
            $(".aLabel").css("background-color", "");
            $(".aLabel").css("color", "");

            // set label connection mark
            $("#" + current_labelConnection).css("background-color", "#1e8151");
            $("#" + current_labelConnection).css("color", "white");

            // clear unit marking and hide unit properties
            $(".w").css("background", "");
            $(".w").css("color", "");
            $(".tabContents").hide();
            $(".tab-Container").hide();

            // set label connection property visible
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
        }
    });


    // deletes selected connection
    $("#btnDeleteConnection").on("click", function() {
        // get connection object
        var con = $("#" + current_labelConnection)[0]._jsPlumb.component;

        // detach connection
        inst.detach(con);

        // get id and current scenario name
        var connID = con.id;
        var currentScenario = $("#lname")[0].innerHTML;

        // delete connection in JSON structure
        for (var n=0; n<myAuthorSystem.length; n++) {
            if (myAuthorSystem[n].name == currentScenario) {
                for (var l=0; l<myAuthorSystem[n]["connections"].length; l++) {
                    if (myAuthorSystem[n]["connections"][l].connId == connID) {
                        myAuthorSystem[n]["connections"].splice(l, 1);
                        break;
                    }
                }
                break;
            }
        }
        // hide tab after connection was deleted
        $("#tabUnitLabel").hide();
    });


    // triggered if an option for a label connection was selected
    $("#selectRelations").select2().on("select2-selecting", function(e) {
        // set new name on label
        $("#" + current_labelConnection).html(e.val.toUpperCase());
        $("#" + current_labelConnection)[0].setAttribute("title", e.choice.text);

        // unmark label
        $("#" + current_labelConnection).css("background-color", "");
        $("#" + current_labelConnection).css("color", "");

        // hide property in tab
        $("#tabUnitLabel").hide();

        // get connection id and scenario name
        var connID = $("#" + current_labelConnection)[0]._jsPlumb.component.id;
        var currentScenario = $("#lname")[0].innerHTML;

        // put label text in JSON structure
        for (var m=0; m<myAuthorSystem.length; m++) {
            if (myAuthorSystem[m].name == currentScenario) {
                for (var p=0; p<myAuthorSystem[m]["connections"].length; p++) {
                    if (myAuthorSystem[m]["connections"][p].connId == connID) {
                        myAuthorSystem[m]["connections"][p].connLabel = e.val.toUpperCase();
                        myAuthorSystem[m]["connections"][p].connTitle = e.choice.text;
                        break;
                    }
                }
            }
        }
    });


    // triggered if unit container, i.e. canvas is clicked
    $("#container").on("click", function() {

        // clear marking from existing learning units
        clearMarkingFromLearningUnits();

        bool_unitClicked = false;

        // clear marking from label connections
        $(".aLabel").css("background-color", "");
        $(".aLabel").css("color", "");

        // clear multi selection bar "Metadaten"
        $("#selectMultiMetaData").empty();
        array_multiSelectionMetaData = [];
        $("#selectMultiMetaData").select2("data", array_multiSelectionMetaData);

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

}


function clearMarkingFromLearningUnits () {
    for (var l=0; l<list_units.length; l++) {
        $(list_units[l]).css("background", "");
        $(list_units[l]).css("color", "");
    }
}


// delete current unit + connections in tab "Eigenschaften"
function deleteUnitFromView() {

    // get unit name from input field
    var unitName = $("#inputUnitName")[0].value;
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


// delete one or more units + connections in modal window "Lernszenarien löschen"
function deleteSelectedUnitsFromDOM() {

    // get all selected units which should be deleted from multi selection bar
    var list_deleteableUnits = $("#selectMultiDeleteUnits").select2("data");

    for (var i=0; i<list_deleteableUnits.length; i++) {
        // get unit id
        var unitID = list_deleteableUnits[i].id;

        // delete all connections
        inst.detachAllConnections($("#" + unitID));

        // delete unit in canvas
        $("#" + unitID).remove();
    }
};