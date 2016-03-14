/**
 * Created by Helena on 13.03.2016.
 */


var selectedUnits = [];


function showAdaptationEngineSelection(unitUUID) {
    lightboxUnit(unitUUID);

    if (selectedUnits.indexOf(unitUUID) == -1)
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

function undoLightboxing() {
    $("div.lightbox-overlay").remove();
    $(".selected-unit").removeClass("selected-unit");
    $(".prev-selected-unit").removeClass("prev-selected-unit");
}



function showSimulationMatchNotification() {
    var notificationModal = $(".modal.simulation-match-notification");

    if (selectedUnits.length == 0) {
        $(notificationModal).find(".found-matches").hide();
        $(notificationModal).find(".found-no-matches").show();
    }
    else {
        $(notificationModal).find(".found-no-matches").hide();
        $(notificationModal).find(".found-matches").show();
        var matches = $(notificationModal).find(".selected-units-list").empty();

        selectedUnits.forEach(function (unitUUID) {
            matches.append(authorSystemContent.getUnitByUUID(unitUUID).getName() + "<br>");
        });
    }
    $(notificationModal).modal("show");

    emptySelectedUnits();
}

function hideSimulationMatchNotification() {
    var notificationModal = $(".modal.simulation-match-notification");
    $(notificationModal).modal("hide");

    emptySelectedUnits();
}



function emptySelectedUnits() {
    selectedUnits = [];
}
