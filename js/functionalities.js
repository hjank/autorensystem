/**
 * Created by juliushofler on 13.03.15.
 */

/** -- JSON Structure for the personal author system data --
 *  myAuthorSystem = [scenario1, scenario2, ..., scenarioN, options]
 *      scenario = {name:name, units:[unit1, unit2, ...], connections:[connect1, connect2, ...]}
 *          unit = {name:name, description:text,
 *            contextInformations:[contextInformation1, contextInformation2, ...],
 *            sat:choice,
 *            metaData:[metaData1, metaData2, ...],
 *
 *            posX:number,
 *            posY:number
 *          }
 *              contextInformation = {name:name, operator:name, value:value,
 *                input1:value, input2:value, inputString:value,
 *                parameter1:value, parameter2:value,
 *                icon:path
 *              }
 *              metaData = {name:name, icon:path}
 *      options = {option1:text, option2:text, ...}
 *  **/

var myAuthorSystem = [];


// slider
var valueSlider, scaleSlider, diffSlider;
$(function() {

    // slider properties and functionalities
    $(".slider").slider({max:8, min:0, value:4, orientation: "vertical", step:1,
        // default properties
        create: function() {
            valueSlider = 4;
            scaleSlider = 1;
        },
        // if slider is used, change size of all elements in working place
        change: function(event, ui) {
            diffSlider = ui.value - valueSlider;
            scaleSlider = scaleSlider + (0.1 * diffSlider);     // scale factor
            $("#stm div").css({
                "-webkit-transform":"scale(" + scaleSlider + ")",
                "-moz-transform":"scale(" + scaleSlider + ")",
                "-ms-transform":"scale(" + scaleSlider + ")",
                "-o-transform":"scale(" + scaleSlider + ")",
                "transform":"scale(" + scaleSlider + ")"
            });
            $("#stm svg").css({
                "-webkit-transform":"scale(" + scaleSlider + ")",
                "-moz-transform":"scale(" + scaleSlider + ")",
                "-ms-transform":"scale(" + scaleSlider + ")",
                "-o-transform":"scale(" + scaleSlider + ")",
                "transform":"scale(" + scaleSlider + ")"
            });
            jsPlumb.setZoom(scaleSlider);
            valueSlider = ui.value;
            inst.repaintEverything();
        }})
        // add pips and label to slider
        .slider("pips", {first:"label", last:"label", labels:{"first":"-", "last":"+"}});
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
    $("#lname").on("click", function() {
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

        // triggered if enter was clicked in input field
        $(inputName).keyup(function(e) {
            if (e.keyCode === 13) {
                // get new name in label
                $("#lname").html($(inputName).val());

                // show label again
                $("#lname").show();

                // remove input field
                $(inputName).remove();

                // change name in menu bar
                $("#menuScenarios").children("li").children("a").children("span.title").each(function() {
                    if ( $(this)[0].innerHTML == scenarioName ) {
                        $(this).html($("#lname")[0].innerHTML);
                    }
                });

                // update name JSON structure
                for (var m=0; m<myAuthorSystem.length; m++) {
                    if (myAuthorSystem[m].name == scenarioName) {
                        myAuthorSystem[m].name = $("#lname")[0].innerHTML;
                    }
                }
            }
        });
    });
});

// tabs
$(function() {

    // default hide tabs
    $(".tab-Container").hide();
    $(".tabContents").hide();
    $("#firstTab").addClass("active");

    // if one tab is clicked show this one
    $(".tab-Container ul li a").click(function() {

        // hide other tab content
        var activeTab = $(this).attr("href");
        $(".tab-Container ul li a").removeClass("active");
        $(this).addClass("active");
        $(".tabContents").hide();

        // only show tab content if a unit is clicked
        if (bool_unitClicked) {
            $(activeTab).fadeIn();
        }

        return false;
    });
});

// container
$(function() {
    // triggered if unit container is clicked
    $("#container").on("click", function() {

        // clear marking from existing learning units
        for (var l=0; l<list_units.length; l++) {
            $(list_units[l]).css("background", "");
            $(list_units[l]).css("color", "");
        }
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
});

// reloading
var loadedData;
$(function() {
    jQuery.get('Testszenario.json', function(data) {
        console.log(data);
        //loadedData = data[0];
        loadedData = data;

        // load scenario from JSON file
        loadScenario(loadedData);

        // update scenario list
        updateScenario(loadedData.name);
        myAuthorSystem.splice(-1);

        // update label
        setLabelBtnScenarioDeletion();
    });
});

/**
 * Function loads a scenario which contains all units, connections und functions.
 * @param {Object} data Contains all data from a scenario
 * */
function loadScenario(data) {

    // get scenario in myAuthorSystem
    myAuthorSystem.push(data);

    /* get scenario in menu */
    // create new container to see new scenario in menu bar
    var liScenario;
    if (data["units"].length != 0) {
        liScenario = $('<li>').addClass('has-sub');
        liScenario.addClass("active");
    } else {
        liScenario = $('<li>').addClass('last');
    }
    liScenario.attr("id", "menu-scenario-load");
    var aClass = $('<a>').attr('href', '#');
    var spanClass = $('<span>').addClass('title');

    // append container in html file
    spanClass.append(data.name);
    aClass.append(spanClass);
    liScenario.append(aClass);
    $("#cssmenu > ul").append(liScenario);

    // get the functionalities into the menu bar
    liScenario.children("a").click(function() {
        $(this).removeAttr('href');
        var element = $(this).parent('li');

        if (element.hasClass('open')) {
            element.removeClass('open');
            element.find('li').removeClass('open');
            element.find('ul').slideUp();
        }
        else {
            element.addClass('open');
            element.children('ul').slideDown();
            element.siblings('li').children('ul').slideUp();
            element.siblings('li').removeClass('open');
            element.siblings('li').find('li').removeClass('open');
            element.siblings('li').find('ul').slideUp();
        }
    });

    // get units in menu
    if (liScenario.hasClass("has-sub")) {

        // append a holder to toggle the menu bar
        liScenario.children("a").append('<span class="holder"></span>');

        ulScenario = $("<ul>").attr("style", "display:none");

        // put all units in scenario in menu bar
        for (var i=0; i<data["units"].length; i++) {
            var ulScenario;
            var liUnit = $("<li>").addClass("last");
            var aUnit = $("<a>").attr("href", "#");
            var spanUnit = $("<span>");

            // append content name on DOM
            spanUnit[0].innerText = data["units"][i].name;
            aUnit.append(spanUnit);
            liUnit.append(aUnit);
            ulScenario.append(liUnit);
        }
        liScenario.append(ulScenario);
    }

    // set container
    jsPlumb.setContainer($("#stm"));

    // load units from scenario
    for (var j=0; j<data["units"].length; j++) {
        var unit = loadUnit(data["units"][j], (j+1).toString(), inst);

        // set event listeners
        activateFunctionalities(unit);
    }

    // set connections
    for (var k=0; k<data["connections"].length; k++) {
        var c = inst.connect({
            source: data["connections"][k].sourceId,
            target: data["connections"][k].targetId,
            anchors: ["Continuous", "Continuous"],
            //overlays: [["Label", {label: "PRE", id: "label", cssClass: "aLabel" }]]
            overlays: [["Label", {label: data["connections"][k].connLabel, id: "label", cssClass: "aLabel" }]]
        });
        // set title for label
        var label = c.getOverlay("label");
        var labelID = $(label)[0].canvas.id;
        $("#" + labelID)[0].setAttribute("title", data["connections"][k].connTitle);
    }

    // activate quick add learning unit button (little navbar right)
    $("#navadd").css("pointer-events", "");
    $("#navadd").css("color", "rgb(102,102,102)");

    // get name in current scenario label
    $("#lname").html(data.name);
}

// global unit instance
var inst;
// initialize jsPlumb instance if jsPlumb is ready
jsPlumb.ready(function () {
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
});
