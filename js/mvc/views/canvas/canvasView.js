/**
 * Created by Helena on 04.09.2015.
 */

//var i = 1;


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


// delete one or more units + connections in modal window "Lernszenarien l�schen"
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