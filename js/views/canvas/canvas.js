/**
 * Created by Helena on 04.09.2015.
 */


function clearMarkingFromLearningUnits () {
    for (var l=0; l<list_units.length; l++) {
        $(list_units[l]).css("background", "");
        $(list_units[l]).css("color", "");
    }
}