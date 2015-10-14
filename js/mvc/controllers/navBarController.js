/**
 * Created by Helena on 04.09.2015.
 */

$(function() {
    var navMenuElement = $("#navmenu");
    var navAddElement = $("#navadd");

    $("#navbarLearningUnit").css({
        "pointer-events": "none",
        "color": "#aaa"}
    );

    // menu hover --> change color
    navMenuElement.mouseover(function() {
        $(this).css({
            background: "#48c9b0",
            cursor: "pointer"
        });
        $(this).find("a").css("color", "#ffffff");
    });

    navMenuElement.mouseout(function() {
        $(this).css("background", "#ddd");
        $(this).find("a").css("color", "#666");
    });

    // toggle menu bar
    navMenuElement.on("click",function() {
        $( "#cssmenu" ).toggle("slide");
        $(this).find("a").toggleClass("fui-arrow-left fui-arrow-right");
    });

    // add learning unit hover --> change color
    navAddElement.mouseover(function() {
        $(this).css("background", "#48c9b0");
        $(this).css("color", "#ffffff");
    });

    navAddElement.mouseout(function() {
        $(this).css("background", "#ddd");
        $(this).css("color", "#666");
    });

    navAddElement.css({
        "pointer-events": "none",
        color: "rgb(150,150,150)"
    });

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

/**
 * Saves the current scenario name and hides input field.
 *
 * @param inputName
 * @param scenarioName
 */
function saveScenarioName(inputName, scenarioName) {
    var newName = $(inputName).val();

    // get new name in label
    $("#lname").html(newName);

    // show label again
    $("#lname").show();

    // remove input field
    $(inputName).remove();

    // change name in menu bar
    changeScenarioNameInMenu(scenarioName, newName);

    // update name JSON structure
    changeScenarioName(scenarioName, newName);
}