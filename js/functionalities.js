/**
 * Created by juliushofler on 13.03.15.
 */


// drag specific elements
$(function() {
    $("#state1").draggable();
    $("#state2").draggable();
    $("#state3").draggable();
});


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
        $(this).css("color", "#ffffff");
    });
    $("#navmenu").mouseout(function() {
        $(this).css("background", "#ddd");
        $(this).css("color", "#000000");
    });

    // toggel menu bar
    $("#navmenu").on("click",function() {
        $( "#cssmenu" ).toggle("slide");
    });

    // tooltip for menu icon
    $("#navmenu").tooltip({
        content: "Show/Hide Menu",
        show: {delay: 1000},
        position: {my: "left", at: "right center"}
    });

    // add learning unit hover
    $("#navadd").mouseover(function() {
        $(this).css("background", "#48c9b0");
        $(this).css("color", "#ffffff");
    });
    $("#navadd").mouseout(function() {
        $(this).css("background", "#ddd");
        $(this).css("color", "#000000");
    });

    // tooltip for add learning unit
    $("#navadd").tooltip({
        content: "Add Item",
        show: {delay: 1000},
        position: {my: "right", at: "left center"}
    });

    // tab bar hover
    $("#navtab").mouseover(function() {
        $(this).css("background", "#48c9b0");
        $(this).css("color", "#ffffff");
    });
    $("#navtab").mouseout(function() {
        $(this).css("background", "#ddd");
        $(this).css("color", "#000000");
    });
    // toggle tab bar
    $("#navtab").on("click",function() {
        $( ".properties" ).toggle("slide");
        $("#navtab a").toggleClass("fui-arrow-right fui-arrow-left")
    });
});

// tabs
$(function() {
    $(".tabContents").hide();
    $(".tabContents:first").show();
    $("#firstTab").addClass("active");
    $(".tab-Container ul li a").click(function() {
        var activeTab = $(this).attr("href");
        $(".tab-Container ul li a").removeClass("active");
        $(this).addClass("active");
        $(".tabContents").hide();
        $(activeTab).fadeIn();

        return false;
    });
});
