/**
 * Created by Helena on 13.03.2016.
 *
 * @fileOverview This file contains functions for visualizing adaptation during simulation.
 */


/**
 * Record of all units selected during a simulation run.
 * @type {Array} An array of unitUUID : String.
 * @todo Could be extended into a map of stepID: [unitUUIDs].
 */
var selectedUnits = [];


/**
 * The callback function used as selectLearningUnitCallback by the Adaptation Engine.
 * @param unitUUID
 */
function showAdaptationEngineSelection(unitUUID) {
    lightboxUnit(unitUUID);

    if (selectedUnits.indexOf(unitUUID) == -1)
        selectedUnits.push(unitUUID);
}

/**
 * This function highlights the given unit element by using a lightbox pattern:
 * the background is dimmed with the currently selected unit "lifted" on top of it in a light color and bright border.
 *
 * @param unitUUID The unit's UUID which corresponds to the ID of the DOM Element representing the selected unit.
 */
function lightboxUnit(unitUUID) {

    // highlight current unit as selected
    $("#" + unitUUID)
        .removeClass("prev-selected-unit")
        .addClass("selected-unit").css({
            "background": "", "color": ""
        });
}

/**
 * Previously selected units stay highlighted but with a darker border color.
 */
function highlightSelectionHistory() {
    selectedUnits.forEach(function (unit) {
        var unitElt = $("#" + unit);
        if (!$(unitElt).hasClass("selected-unit"))
            $(unitElt).addClass("prev-selected-unit");
    });
}

/**
 * Add overlay for dimming effect.
 */
function addBackgroundDimmingOverlay(){
    var containerElt = $("#container");
    if($(containerElt).find(".lightbox-overlay").length == 0)
        $(containerElt).prepend($("<div>").addClass("lightbox-overlay")
                .off("mousedown").on("mousedown", function (e) {
                    $(this).remove();
                })
        );
}


/**
 * Revokes all lightboxing effects.
 */
function undoLightboxing() {
    $("div.lightbox-overlay").remove();
    $(".selected-unit").removeClass("selected-unit");
    $(".prev-selected-unit").removeClass("prev-selected-unit");
}


/**
 * Reporting function:
 * displays a modal window listing all units selected during simulation and empties their record.
 */
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
            matches.append(translate_unitUUIDToName(unitUUID) + "<br>");
        });
    }
    $(notificationModal).modal("show");

    emptySelectedUnits();
}


function showNoMatchNotification() {
    if ($(".selected-unit").length == 0) {

        var notificationModal = $(".modal.simulation-match-notification");
        $(notificationModal).find(".found-matches").hide();
        $(notificationModal).find(".found-no-matches").show();
        $(notificationModal).modal("show");
    }
}


/**
 * Hides the modal report window and empties record of selected units (to be sure).
 */
function hideSimulationMatchNotification() {
    var notificationModal = $(".modal.simulation-match-notification");
    $(notificationModal).modal("hide");

    emptySelectedUnits();
}


/**
 * Empties the record of selected units.
 */
function emptySelectedUnits() {
    selectedUnits = [];
}
