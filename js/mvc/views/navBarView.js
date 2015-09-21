/**
 * Created by Helena on 04.09.2015.
 */

// big navigation bar
$(function() {
    $("#navbarLearningUnit").css("pointer-events", "none");
    $("#navbarLearningUnit").css("color", "#aaa");
});


// events on little menu bar
$(function() {

    // menu hover --> change color
    $("#navmenu").mouseover(function() {
        $(this).css("background", "#48c9b0");
        $(this).css("cursor", "pointer");
        $("#navmenu a").css("color", "#ffffff");
    });
    $("#navmenu").mouseout(function() {
        $(this).css("background", "#ddd");
        $("#navmenu a").css("color", "#666");
    });

    // toggle menu bar
    $("#navmenu").on("click",function() {
        $( "#cssmenu" ).toggle("slide");
        $("#navmenu a").toggleClass("fui-arrow-left fui-arrow-right");
    });

    // add learning unit hover --> change color
    $("#navadd").mouseover(function() {
        $(this).css("background", "#48c9b0");
        $(this).css("color", "#ffffff");
    });
    $("#navadd").mouseout(function() {
        $(this).css("background", "#ddd");
        $(this).css("color", "#666");
    });
    $("#navadd").css("pointer-events", "none");
    $("#navadd").css("color", "rgb(150,150,150)");

    // tab bar hover --> change color
    $("#navtab").mouseover(function() {
        $(this).css("background", "#48c9b0");
        $(this).css("cursor", "pointer");
        $("#navtab a").css("color", "#ffffff");
    });
    $("#navtab").mouseout(function() {
        $(this).css("background", "#ddd");
        $("#navtab a").css("color", "#666");
    });

    // toggle tab bar
    $("#navtab").on("click",function() {
        $( ".properties" ).toggle("slide");
        $("#navtab a").toggleClass("fui-arrow-right fui-arrow-left");
    });

    // change scenario name
    $("#lname").on("click", function(e) {
        // hide label
        $(this).hide();

        // create input field
        var inputName = $("<input>").addClass("form-control");
        var scenarioName = $("#lname")[0].innerHTML;
        inputName.attr("value", scenarioName);
        //$(inputName).css("height", "100%");
        $(inputName).css("height", "30");
        $(inputName).css("width", "200");
        $(inputName).css("display", "inherit");

        // place it in parent DOM and set focus on last position
        $(this).parent().append(inputName);
        inputName.focus();
        $(inputName)[0].setSelectionRange(scenarioName.length, scenarioName.length);

        e.stopPropagation();

        // triggered if enter was clicked in input field
        $(inputName).keyup(function(e) {
            if (e.keyCode === 13) {

                // save name in JSON structure and in GUI
                saveScenarioName(inputName, scenarioName);
            }
        });

        // triggered if body is clicked
        $("body").on("click", function() {

            // only save scenario name if input field is visible
            if ($(inputName).css("display") != "none" && $(inputName).css("display") != "inherit") {

                // save name in JSON structure and in GUI
                saveScenarioName(inputName, scenarioName);
            }
        });
    });

});


// saves the current scenario name and hides input field
function saveScenarioName(inputName, scenarioName) {

    var newName = $(inputName).val();

    // get new name in label
    $("#lname").html(newName);

    // show label again
    $("#lname").show();

    // remove input field
    $(inputName).remove();

    // change name in menu bar
    changeNameInMenu(scenarioName, newName);

    // update name JSON structure
    changeScenarioName(scenarioName, newName);

}