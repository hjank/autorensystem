/**
 * Created by Helena on 04.09.2015.
 */


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


// add jQuery UI Sliders with flat design
$(function() {
    var $verticalSlider = $('.slider');
    if ($verticalSlider.length) {
        $verticalSlider.slider({
            min: 0,
            max: 8,
            value: 4,
            orientation: 'vertical',
            step: 1,
            range: 'min'
        });
    }
});
