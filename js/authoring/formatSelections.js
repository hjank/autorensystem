/**
 * Created by juliushofler on 10.05.15.
 */

function formatGlobalElements() {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="checkbox"]').radiocheck();
    $('[data-toggle="switch"]').bootstrapSwitch();
    $("select").select2({dropdownCssClass: "dropdown-inverse"});
}

var contextIconSrcDictionary = {
    // scenario (Lernszenario)
    "CI_CURRENT_LEARNING_UNIT" : "img/icons-context-information/ci-scenario-current-learning-unit.png",
    "CI_FINISHED_LEARNING_UNIT" : "img/icons-context-information/ci-scenario-learning-unit-completed.png",
    "CI_EXPECTED_TIME_NEEDED_FOR_COMPLETION" : "img/icons-context-information/ci-scenario-time-for-completion.png",

    // personal (Persönlich)
    "CI_USER_DID_PERFORM_ACTION" : "img/icons-context-information/ci-personal-user.png",
    "CI_USER_AGE" : "img/icons-context-information/ci-personal-user.png",
    "CI_USER_CURRENT_LEARNING_STYLE_INPUT" : "img/icons-context-information/ci-personal-knowledge.png",
    "CI_USER_CURRENT_LEARNING_STYLE_PERCEPTION" : "img/icons-context-information/ci-personal-knowledge.png",
    "CI_USER_CURRENT_LEARNING_STYLE_PROCESSING" : "img/icons-context-information/ci-personal-knowledge.png",
    "CI_USER_CURRENT_LEARNING_STYLE_UNDERSTANDING" : "img/icons-context-information/ci-personal-knowledge.png",
    "CI_USER_ROLE" : "img/icons-context-information/ci-personal-role.png",
    "CI_USER_STATE_OF_MIND" : "img/icons-context-information/ci-personal-user-state-of-mind.png",

    // situational (Situationsbezogen)
    "CI_CURRENT_APPOINTMENT" : "img/icons-context-information/ci-situational-appointment.png",
    "CI_NEXT_APPOINTMENT" : "img/icons-context-information/ci-situational-appointment.png",
    "CI_TIME_UNTIL_TIMESTAMP" : "img/icons-context-information/ci-situational-timeduration.png",

    // technical (Infrastruktur)
    "CI_AUDIO_OUTPUT_AVAILABLE" : "img/icons-context-information/ci-technical-audio-available.png",
    "CI_DEVICE_TYPE" : "img/icons-context-information/ci-technical-device-type.png",
    "CI_DISPLAY_RESOLUTION" : "img/icons-context-information/ci-technical-display-resolution.png",
    "CI_EXTERNAL_DISPLAY_AVAILABLE" : "img/icons-context-information/ci-technical-display-available.png",
    "CI_HAS_SCREEN_READER_FUNCTIONALITY" : "img/icons-context-information/ci-technical-screenreader-available.png",
    "CI_MICROPHONE_AVAILABLE" : "img/icons-context-information/ci-technical-micropone-available.png",
    "CI_PHOTO_CAMERA_AVAILABLE" : "img/icons-context-information/ci-technical-photo-camera-available.png",
    "CI_PRINTER_AVAILABLE" : "img/icons-context-information/ci-technical-printer-available.png",
    "CI_VIDEO_CAMERA_AVAILABLE" : "img/icons-context-information/ci-technical-video-camera-available.png",
    //missing but important" : battery status

    // physical (Umwelt)
    "CI_CURRENT_AIR_PRESSURE" : "img/icons-context-information/ci-physical-air-pressure2.png",
    "CI_CURRENT_AMBIENT_NOISE" : "img/icons-context-information/ci-physical-ambient-noise.png",
    "CI_CURRENT_HUMIDITY" : "img/icons-context-information/ci-physical-humidity.png",
    "CI_CURRENT_LUMINOSITY" : "img/icons-context-information/ci-physical-luminosity.png",
    "CI_CURRENTLY_RAINING" : "img/icons-context-information/ci-physical-raining.png",
    "CI_CURRENTLY_SUNNY" : "img/icons-context-information/ci-physical-sunny.png",
    "CI_CURRENT_TEMPERATURE" : "img/icons-context-information/ci-physical-temperature.png",
    "CI_CURRENT_TIME" : "img/icons-context-information/ci-physical-time.png",

    // location (Ortung)
    "CI_USER_DESTINATION" : "img/icons-context-information/ci-location-goal.png",
    "CI_DID_ARRIVE_AT_LOCATION" : "img/icons-context-information/ci-location-arrived.png",
    "CI_DID_LEAVE_LOCATION" : "img/icons-context-information/ci-location-goal-mirrored.png",
    "CI_IS_AT_LOCATION" : "img/icons-context-information/ci-location-location.png",
    "CI_USER_LOCATION_ADDRESS" : "img/icons-context-information/ci-location-address.png",
    "CI_USER_LOCATION_BUILDING" : "img/icons-context-information/ci-location-building.png",
    "CI_USER_LOCATION_COUNTRY" : "img/icons-context-information/ci-location-country.png",
    "CI_USER_LOCATION_DISTANCE" : "img/icons-context-information/ci-location-distance.png",
    "CI_USER_LOCATION_LATITUDE" : "img/icons-context-information/ci-location-latlng.png",
    "CI_USER_LOCATION_LONGITUDE" : "img/icons-context-information/ci-location-latlng.png",
    "CI_USER_LOCATION_REGION" : "img/icons-context-information/ci-location-region.png",
    "CI_USER_MEANS_OF_TRANSPORTATION" : "img/icons-context-information/ci-location-transport.png",
    "CI_USER_MOVEMENT_SPEED" : "img/icons-context-information/ci-location-speed.png"
};


// format in selection context information
/**
 * Function sets format for the context information in the selection bar (icon + text).
 * @param {Object} item Context information which was selected in selection bar
 * @return {String} Concatenation of an img (icon) and span (text) DOM, if no icon available return text only
 * */
function formatContextInfos(item) {

    // find the right context information
    for (var key in contextInfoDictionary) {
        if (contextInfoDictionary[key] == item.text) {
            return '<img src="' + contextIconSrcDictionary[key] + '" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        }
    }
    return item.text;
}

// format for multi selection context information
/**
 * Function sets format for the context information in the multi selection bar (icon only).
 * @param {Object} item Context information which was selected
 * @return {String} img DOM if icon available, else text only
 * */
function formatMultiContextInfos(item) {

    // find the right context information
    for (var key in contextInfoDictionary) {
        if (contextInfoDictionary[key] == item.text) {
            return '<img src="' + contextIconSrcDictionary[key] + '" width="17" height="17" title="' + item.text + '">';
        }
    }
    return item.text;
}

// format icons in units
/**
 * Function sets format for the context information in the learning units (icon only).
 * @param {Object} selectedInfo The selected context information
 * @return {String} specific img DOM if icon available, else context class icon
 * */
function formatUnitIcons(selectedInfo) {

    var selectedInfoID = selectedInfo.getID();
    // get corresponding context class
    var contextClasses = contextList.getClasses();
    var classIndex = getFirstMatchingClassIndex(selectedInfo, contextClasses);
    var classNameTranslation = translate_contextClass(contextClasses[classIndex]);

    return (
        // find the right context information in icon dictionary
        '<img src="' + contextIconSrcDictionary[selectedInfoID] + '" width="15" height="15" title="' +
                translate_contextInformation(selectedInfoID) + '" contextInfoID="' + selectedInfoID + '">'
        ||
    // no icon was found --> return context class icon
    '<img src="img/context-classes/' + classNameTranslation + '.png" width="15" height="15" title="' +
    translate_contextInformation(selectedInfoID) + '" contextInfoID="' + selectedInfoID + '">'
    );
}