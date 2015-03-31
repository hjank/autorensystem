/**
 * Created by juliushofler on 30.03.15.
 */

var global_currentInputUnitName = "";

$(function() {

    $("#inputUnitName").bind("input", function() {
        var val = $(this).val();
        if ($("#opened").children("div").hasClass("title")) {
            $("#opened div.title")[0].innerText = val;
        }
    });

});

// get name into tab properties
function activateFunctionalities(newState) {

    var id = newState[0].getAttribute("id");
    var unit = document.getElementById(id);
    var name = "";

    $(unit).click(function() {

        if ($(unit).children("div").hasClass("title")) {
            name = (this).innerText.replace(/(\r\n|\n|\r)/gm,"");
        }

        var formObject = document.forms["formProperties"];
        formObject.elements["unitName"].value = name;
        global_currentInputUnitName = name;
    });

    $("#inputUnitName").bind("input", function() {
        var val = $(this).val();

        if (name == global_currentInputUnitName) {
            $(unit).children("div.title")[0].innerText = val;
            name = $(unit).children("div.title")[0].innerText;
            global_currentInputUnitName = val;
        }


    });


}