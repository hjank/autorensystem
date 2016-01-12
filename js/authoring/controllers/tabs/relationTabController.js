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

    var label = connection.getOverlay("label");
    // update current label
    currentConnectionID = label.canvas.id;

    // test 'if (label.id == "label")' is obsolete since jsPlumb hands in parameter c : Connection

    // get name of source and target unit
    var sourceUnit = connection.source.parentElement.innerText;
    var targetUnit = connection.target.innerText;

    // add names in relations labels
    $("#preLabelRelations").html(sourceUnit + " ist eine");
    $("#postLabelRelations").html("für " + targetUnit);

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
    var thisScenario = authorSystemContent.getScenario($("#lname")[0].innerHTML);
    var thisConnection = thisScenario.getConnectionByID(connection.connection.id);
    $("#selectRelations").children("option").each(function() {
        if ( $(this)[0].value.toUpperCase() == thisConnection.getLabel().toLowerCase() ) {
            $("#selectRelations").select2("data", {
                id:$(this)[0].value,
                text:$(this)[0].innerHTML
            });
        }
    });
}