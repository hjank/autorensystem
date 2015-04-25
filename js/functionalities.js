/**
 * Created by juliushofler on 13.03.15.
 */

/** -- JSON Structure for the personal author system data --
 *  myAuthorSystem = [scenario1, scenario2, ..., scenarioN, options]
 *      scenario = {name:name, units:[unit1, unit2, ...]}
 *          unit = {name:name, description:text,
 *            contextInformations:[contextInformation1, contextInformation2, ...],
 *            sat:choice,
 *            metaData:[metaData1, metaData2, ...],
 *            connections:[connect1, connect2, ...]
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

// drag specific elements
/*$(function() {
    $("#state1").draggable();
    $("#state2").draggable();
    $("#state3").draggable();
});*/


// slider
var valueSlider, scaleSlider, diffSlider;
$(function() {
    //$(".slider").slider({max:10}).slider("pips", {first:"pip", last:"pip"});
    $(".slider").slider({max:8, min:0, value:4, orientation: "vertical", step:1,
        create: function(event, ui) {
            valueSlider = 4;
            scaleSlider = 1;
        },
        change: function(event, ui) {
            diffSlider = ui.value - valueSlider;
            scaleSlider = scaleSlider + (0.2 * diffSlider);
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
        }})
        .slider("pips", {first:"label", last:"label", labels:{"first":"-", "last":"+"}});
});

// events on little menu bar
$(function() {

    // menu hover
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

    // tooltip for menu icon
    /*$("#navmenu").tooltip({
        content: "Show/Hide Menu",
        show: {delay: 1000},
        position: {my: "left", at: "right center"}
    });*/

    // add learning unit hover
    $("#navadd").mouseover(function() {
        $(this).css("background", "#48c9b0");
        $(this).css("color", "#ffffff");
    });
    $("#navadd").mouseout(function() {
        $(this).css("background", "#ddd");
        $(this).css("color", "#666");
    });

    // tooltip for add learning unit
    /*$("#navadd").tooltip({
        content: "Add Item",
        show: {delay: 1000},
        position: {my: "right", at: "left center"}
    });*/

    // tab bar hover
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
});

// tabs
$(function() {
    $(".tabContents").hide();
    //$(".tabContents:first").show();
    $("#firstTab").addClass("active");

    $(".tab-Container ul li a").click(function() {

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
    $("#container").on("click", function() {

        // clear marking from existing learning units
        for (var l=0; l<list_units.length; l++) {
            $(list_units[l]).css("background", "");
            $(list_units[l]).css("color", "");
        }
        bool_unitClicked = false;

        // clear multi selection bar "Metadaten"
        $("#selectMultiMetaData").empty();
        array_multiSelectionMetaData = [];
        $("#selectMultiMetaData").select2("data", array_multiSelectionMetaData);

        // all tab content invisible
        $(".tabContents").hide();

    });
});

// big navigation bar
/*$(function() {
    $("#navHeadStatistic").mouseover(function() {
        $("#navHeadStatistic>a>img").attr("src", "img/Icons/iconmonstr-bar-chart-icon-32_green.png").fadeIn();
    });
    $("#navHeadStatistic").mouseout(function() {
        $("#navHeadStatistic>a>img").attr("src", "img/Icons/iconmonstr-bar-chart-icon-32.png").fadeIn();
    });
});*/
