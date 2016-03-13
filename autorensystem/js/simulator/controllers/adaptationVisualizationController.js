/**
 * Created by Helena on 13.03.2016.
 */



function showAdaptationEngineSelection(unitUUID) {
    lightboxUnit(unitUUID);

    selectedUnits.push(unitUUID);
}

/**
 * This function highlights the given unit element by using a lightbox.
 * The background is dimmed with the unit "lifted" on top of it in a light color.
 *
 * @param unitUUID The ID of the DOM Element representing the selected unit.
 */
function lightboxUnit(unitUUID) {

    selectedUnits.forEach(function (unit) {
        var unitElt = $("#" + unit);
        if (!$(unitElt).hasClass("selected-unit"))
            $(unitElt).addClass("prev-selected-unit");
    });

    var containerElt = $("#container");
    if($(containerElt).find(".lightbox-overlay").length == 0)
        $(containerElt).prepend($("<div>").addClass("lightbox-overlay")
                .on("mousedown", function (e) {
                    $(this).remove();
                })
        );

    $("#" + unitUUID)
        .removeClass("prev-selected-unit")
        .addClass("selected-unit").css({
            "background": "", "color": ""
        });

}

function getSelectedUnits() {
    var units = [];
    selectedUnits.forEach(function (unitUUID) {
        if ($("#" + unitUUID).hasClass("selected-unit"))
            units.push(unitUUID);
    });
    return units;
}


function undoLightboxing() {
    $("div.lightbox-overlay").remove();
    $(".selected-unit").removeClass("selected-unit");
    $(".prev-selected-unit").removeClass("prev-selected-unit");
}