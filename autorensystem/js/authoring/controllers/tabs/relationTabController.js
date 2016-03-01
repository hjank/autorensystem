/**
 * Created by elis on 03.12.2015.
 */


$(function() {
    // triggered if an option for a label connection was selected
    $("#selectRelations").select2().on("select2-selecting", function(e) {

        // set new name on label
        $("#" + currentConnectionID).html(e.val.toUpperCase());
        $("#" + currentConnectionID)[0].setAttribute("title", e.choice.text);

        // unmark label
        $("#" + currentConnectionID).css("background-color", "");
        $("#" + currentConnectionID).css("color", "");
        connectionIsClicked = false;

        // get connection id and scenario name
        var connID = $("#" + currentConnectionID)[0]._jsPlumb.component.id;
        var currentScenario = $("#lname")[0].innerHTML;

        // get current scenario's JSON
        var thisScenario = authorSystemContent.getScenario(currentScenario);
        var thisConnection = thisScenario.getConnectionByID(connID);
        thisConnection.setLabel(e.val.toUpperCase());
        thisConnection.setTitle(e.choice.text);

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

        // delete connection in current scenario's JSON structure
        var thisScenario = authorSystemContent.getScenario(currentScenario);
        thisScenario.removeConnection(connID);

        // hide relation tab after connection was deleted
        deactivateAllTabs();
        connectionIsClicked = false;
    });
});


function fillRelationTab(connection) {
    var scenarioName = $("#lname")[0].innerHTML;
    var theScenario = authorSystemContent.getScenario(scenarioName);
    var theConnection = theScenario.getConnectionByID(connection.id);
    var sourceUnit = authorSystemContent.getUnitByUUID(theConnection.getSourceId());
    var targetUnit = authorSystemContent.getUnitByUUID(theConnection.getTargetId());

    var label = connection.getOverlay("label");
    // update current label
    currentConnectionID = label.canvas.id;

    // test 'if (label.id == "label")' is obsolete since jsPlumb hands in parameter c : Connection

    // add names in relations labels
    $("#preLabelRelations").html("\"" + sourceUnit.getName() + "\"<br> hat die");
    $("#postLabelRelations").html("\"" + targetUnit.getName() + "\".");

    // clear markings from connection labels
    clearMarkingFromConnections();
    // set label connection mark
    $("#" + currentConnectionID).css("background-color", "#1e8151");
    $("#" + currentConnectionID).css("color", "white");

    // clear unit marking
    clearMarkingFromLearningUnits();

    // show relations tab: set label connection property visible
    showRelationTab();

    // show right selection of the current label in selection bar
    $("#selectRelations").children("option").each(function() {
        if ( $(this)[0].value.toUpperCase() == label.label ) {
            $("#selectRelations").select2("data", {
                id:$(this)[0].value,
                text:$(this)[0].innerHTML
            });
        }
    });
}