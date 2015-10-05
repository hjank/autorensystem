/**
 * Created by Helena on 04.09.2015.
 */



/**
 * Function deletes selected unit from the working place.
 * */
function deleteUnitFromModel() {

    // get current scenario name
    var currentScenario = $("#lname")[0].innerHTML;

    // needed to find scenario in menu bar
    var liCurrentScenario;
    $("#menuScenarios").children("li").children("a").children("span.title").each(function() {
        if ( $(this)[0].innerHTML == currentScenario ) {
            liCurrentScenario = $(this).parent("a").parent("li");
        }
    });

    // update gui
    for (var j=0; j<myAuthorSystem.length; j++) {
        if (myAuthorSystem[j]["name"] == currentScenario) {
            for (var k=0; k<myAuthorSystem[j]["units"].length; k++) {

                // delete unit in state machine
                var unit = $("#inputUnitName")[0].value;

                // Note: unit deletion on working place see statemachine.js
                /*$("#stm").children("div.w").children("div.title").each(function() {
                 if (this.innerHTML == unit) {
                 $(this).parent().remove();
                 }
                 });*/

                // delete unit in JSON structure
                if (myAuthorSystem[j]["units"][k]["name"] == unit) {
                    myAuthorSystem[j]["units"].splice(k, 1);
                }

                // delete unit in menu bar
                liCurrentScenario.children("ul").children("li").each(function() {
                    if ($(this).children("a").children("span")[0].innerHTML == unit) {
                        $(this).remove();
                    }
                });
            }
        }
    }

    // all tab content invisible
    $(".tabContents").hide();
    $(".tab-Container").hide();
}