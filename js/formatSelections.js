/**
 * Created by juliushofler on 10.05.15.
 */

// format in selection context information
function formatContextInfos(item) {
    switch (item.text) {

        // scenario (Lernszenario)
        case dictionary_optionsContextInfos.CI_CURRENT_LEARNING_UNIT:
            return '<img src="img/icons-context-information/ci-scenario-current-learning-unit.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_FINISHED_LEARNING_UNIT:
            return '<img src="img/icons-context-information/ci-scenario-learning-unit-completed.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_EXPECTED_TIME_NEEDED_FOR_COMPLETION:
            return '<img src="img/icons-context-information/ci-scenario-time-for-completion.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';

        // personal (Persönlich)
        case dictionary_optionsContextInfos.CI_USER_DID_PERFORM_ACTION:
            return '<img src="img/icons-context-information/ci-personal-user.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_USER_AGE:
            return '<img src="img/icons-context-information/ci-personal-user.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_USER_CURRENT_LEARNING_STYLE_INPUT:
            return '<img src="img/icons-context-information/ci-personal-knowledge.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_USER_CURRENT_LEARNING_STYLE_PERCEPTION:
            return '<img src="img/icons-context-information/ci-personal-knowledge.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_USER_CURRENT_LEARNING_STYLE_PROCESSING:
            return '<img src="img/icons-context-information/ci-personal-knowledge.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_USER_CURRENT_LEARNING_STYLE_UNDERSTANDING:
            return '<img src="img/icons-context-information/ci-personal-knowledge.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_USER_ROLE:
            return '<img src="img/icons-context-information/ci-personal-role.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_USER_STATE_OF_MIND:
            return '<img src="img/icons-context-information/ci-personal-user-state-of-mind.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';

        // situational (Situationsbezogen)
        case dictionary_optionsContextInfos.CI_CURRENT_APPOINTMENT:
            return '<img src="img/icons-context-information/ci-situational-appointment.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_NEXT_APPOINTMENT:
            return '<img src="img/icons-context-information/ci-situational-appointment.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_TIME_UNTIL_TIMESTAMP:
            return '<img src="img/icons-context-information/ci-situational-timeduration.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';

        // technical (Infrastruktur)
        case dictionary_optionsContextInfos.CI_AUDIO_OUTPUT_AVAILABLE:
            return '<img src="img/icons-context-information/ci-technical-audio-available.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_DEVICE_TYPE:
            return '<img src="img/icons-context-information/ci-technical-device-type.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_DISPLAY_RESOLUTION:
            return '<img src="img/icons-context-information/ci-technical-display-resolution.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_EXTERNAL_DISPLAY_AVAILABLE:
            return '<img src="img/icons-context-information/ci-technical-display-available.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_HAS_SCREEN_READER_FUNCTIONALITY:
            return '<img src="img/icons-context-information/ci-technical-screenreader-available.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_MICROPHONE_AVAILABLE:
            return '<img src="img/icons-context-information/ci-technical-micropone-available.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_PHOTO_CAMERA_AVAILABLE:
            return '<img src="img/icons-context-information/ci-technical-photo-camera-available.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_PRINTER_AVAILABLE:
            return '<img src="img/icons-context-information/ci-technical-printer-available.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_VIDEO_CAMERA_AVAILABLE:
            return '<img src="img/icons-context-information/ci-technical-video-camera-available.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';

        // physical (Umwelt)
        case dictionary_optionsContextInfos.CI_CURRENT_AIR_PRESSURE:
            return '<img src="img/icons-context-information/ci-physical-air-pressure2.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_CURRENT_AMBIENT_NOISE:
            return '<img src="img/icons-context-information/ci-physical-ambient-noise.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_CURRENT_HUMIDITY:
            return '<img src="img/icons-context-information/ci-physical-humidity.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_CURRENT_LUMINOSITY:
            return '<img src="img/icons-context-information/ci-physical-luminosity.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_CURRENTLY_RAINING:
            return '<img src="img/icons-context-information/ci-physical-raining.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_CURRENTLY_SUNNY:
            return '<img src="img/icons-context-information/ci-physical-sunny.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_CURRENT_TEMPERATURE:
            return '<img src="img/icons-context-information/ci-physical-temperature.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_CURRENT_TIME:
            return '<img src="img/icons-context-information/ci-physical-time.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';

        // location (Ortung)
        case dictionary_optionsContextInfos.CI_USER_DESTINATION:
            return '<img src="img/icons-context-information/ci-location-goal.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_DID_ARRIVE_AT_LOCATION:
            return '<img src="img/icons-context-information/ci-location-arrived.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_DID_LEAVE_LOCATION:
            return '<img src="img/icons-context-information/ci-location-goal-mirrored.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_IS_AT_LOCATION:
            return '<img src="img/icons-context-information/ci-location-location.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_USER_LOCATION_ADDRESS:
            return '<img src="img/icons-context-information/ci-location-address.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_USER_LOCATION_BUILDING:
            return '<img src="img/icons-context-information/ci-location-building.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_USER_LOCATION_COUNTRY:
            return '<img src="img/icons-context-information/ci-location-country.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_USER_LOCATION_DISTANCE:
            return '<img src="img/icons-context-information/ci-location-distance.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_USER_LOCATION_LATITUDE:
            return '<img src="img/icons-context-information/ci-location-latlng.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_USER_LOCATION_LONGITUDE:
            return '<img src="img/icons-context-information/ci-location-latlng.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_USER_LOCATION_REGION:
            return '<img src="img/icons-context-information/ci-location-region.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_USER_MEANS_OF_TRANSPORTATION:
            return '<img src="img/icons-context-information/ci-location-transport.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
        case dictionary_optionsContextInfos.CI_USER_MOVEMENT_SPEED:
            return '<img src="img/icons-context-information/ci-location-speed.png" width="17" height="17">' +
                '<span class="formatIconText">' + item.text + '</span>';
    }
    return item.text;
}

// format for multi selection context information
function formatMultiContextInfos(item) {
    switch (item.text) {

        // scenario (Lernszenario)
        case dictionary_optionsContextInfos.CI_CURRENT_LEARNING_UNIT:
            return '<img src="img/icons-context-information/ci-scenario-current-learning-unit.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_FINISHED_LEARNING_UNIT:
            return '<img src="img/icons-context-information/ci-scenario-learning-unit-completed.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_EXPECTED_TIME_NEEDED_FOR_COMPLETION:
            return '<img src="img/icons-context-information/ci-scenario-time-for-completion.png" width="17" height="17" title="' +
                item.text + '">';

        // personal (Persönlich)
        case dictionary_optionsContextInfos.CI_USER_DID_PERFORM_ACTION:
            return '<img src="img/icons-context-information/ci-personal-user.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_USER_AGE:
            return '<img src="img/icons-context-information/ci-personal-user.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_USER_CURRENT_LEARNING_STYLE_INPUT:
            return '<img src="img/icons-context-information/ci-personal-knowledge.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_USER_CURRENT_LEARNING_STYLE_PERCEPTION:
            return '<img src="img/icons-context-information/ci-personal-knowledge.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_USER_CURRENT_LEARNING_STYLE_PROCESSING:
            return '<img src="img/icons-context-information/ci-personal-knowledge.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_USER_CURRENT_LEARNING_STYLE_UNDERSTANDING:
            return '<img src="img/icons-context-information/ci-personal-knowledge.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_USER_ROLE:
            return '<img src="img/icons-context-information/ci-personal-role.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_USER_STATE_OF_MIND:
            return '<img src="img/icons-context-information/ci-personal-user-state-of-mind.png" width="17" height="17" title="' +
                item.text + '">';

        // situational (Situationsbezogen)
        case dictionary_optionsContextInfos.CI_CURRENT_APPOINTMENT:
            return '<img src="img/icons-context-information/ci-situational-appointment.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_NEXT_APPOINTMENT:
            return '<img src="img/icons-context-information/ci-situational-appointment.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_TIME_UNTIL_TIMESTAMP:
            return '<img src="img/icons-context-information/ci-situational-timeduration.png" width="17" height="17" title="' +
                item.text + '">';

        // technical (Infrastruktur)
        case dictionary_optionsContextInfos.CI_AUDIO_OUTPUT_AVAILABLE:
            return '<img src="img/icons-context-information/ci-technical-audio-available.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_DEVICE_TYPE:
            return '<img src="img/icons-context-information/ci-technical-device-type.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_DISPLAY_RESOLUTION:
            return '<img src="img/icons-context-information/ci-technical-display-resolution.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_EXTERNAL_DISPLAY_AVAILABLE:
            return '<img src="img/icons-context-information/ci-technical-display-available.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_HAS_SCREEN_READER_FUNCTIONALITY:
            return '<img src="img/icons-context-information/ci-technical-screenreader-available.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_MICROPHONE_AVAILABLE:
            return '<img src="img/icons-context-information/ci-technical-micropone-available.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_PHOTO_CAMERA_AVAILABLE:
            return '<img src="img/icons-context-information/ci-technical-photo-camera-available.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_PRINTER_AVAILABLE:
            return '<img src="img/icons-context-information/ci-technical-printer-available.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_VIDEO_CAMERA_AVAILABLE:
            return '<img src="img/icons-context-information/ci-technical-video-camera-available.png" width="17" height="17" title="' +
                item.text + '">';

        // physical (Umwelt)
        case dictionary_optionsContextInfos.CI_CURRENT_AIR_PRESSURE:
            return '<img src="img/icons-context-information/ci-physical-air-pressure2.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_CURRENT_AMBIENT_NOISE:
            return '<img src="img/icons-context-information/ci-physical-ambient-noise.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_CURRENT_HUMIDITY:
            return '<img src="img/icons-context-information/ci-physical-humidity.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_CURRENT_LUMINOSITY:
            return '<img src="img/icons-context-information/ci-physical-luminosity.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_CURRENTLY_RAINING:
            return '<img src="img/icons-context-information/ci-physical-raining.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_CURRENTLY_SUNNY:
            return '<img src="img/icons-context-information/ci-physical-sunny.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_CURRENT_TEMPERATURE:
            return '<img src="img/icons-context-information/ci-physical-temperature.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_CURRENT_TIME:
            return '<img src="img/icons-context-information/ci-physical-time.png" width="17" height="17" title="' +
                item.text + '">';

        // location (Ortung)
        case dictionary_optionsContextInfos.CI_USER_DESTINATION:
            return '<img src="img/icons-context-information/ci-location-goal.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_DID_ARRIVE_AT_LOCATION:
            return '<img src="img/icons-context-information/ci-location-arrived.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_DID_LEAVE_LOCATION:
            return '<img src="img/icons-context-information/ci-location-goal-mirrored.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_IS_AT_LOCATION:
            return '<img src="img/icons-context-information/ci-location-location.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_USER_LOCATION_ADDRESS:
            return '<img src="img/icons-context-information/ci-location-address.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_USER_LOCATION_BUILDING:
            return '<img src="img/icons-context-information/ci-location-building.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_USER_LOCATION_COUNTRY:
            return '<img src="img/icons-context-information/ci-location-country.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_USER_LOCATION_DISTANCE:
            return '<img src="img/icons-context-information/ci-location-distance.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_USER_LOCATION_LATITUDE:
            return '<img src="img/icons-context-information/ci-location-latlng.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_USER_LOCATION_LONGITUDE:
            return '<img src="img/icons-context-information/ci-location-latlng.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_USER_LOCATION_REGION:
            return '<img src="img/icons-context-information/ci-location-region.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_USER_MEANS_OF_TRANSPORTATION:
            return '<img src="img/icons-context-information/ci-location-transport.png" width="17" height="17" title="' +
                item.text + '">';
        case dictionary_optionsContextInfos.CI_USER_MOVEMENT_SPEED:
            return '<img src="img/icons-context-information/ci-location-speed.png" width="17" height="17" title="' +
                item.text + '">';
    }
    return item.text;
}

// format icons in units
function formatUnitIcons(item, optgroup, ccID) {
    switch (item.text) {

        // scenario (Lernszenario)
        case dictionary_optionsContextInfos.CI_CURRENT_LEARNING_UNIT:
            return '<img src="img/icons-context-information/ci-scenario-current-learning-unit.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_FINISHED_LEARNING_UNIT:
            return '<img src="img/icons-context-information/ci-scenario-learning-unit-completed.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_EXPECTED_TIME_NEEDED_FOR_COMPLETION:
            return '<img src="img/icons-context-information/ci-scenario-time-for-completion.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';

        // personal (Persönlich)
        case dictionary_optionsContextInfos.CI_USER_DID_PERFORM_ACTION:
            return '<img src="img/icons-context-information/ci-personal-user.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_USER_AGE:
            return '<img src="img/icons-context-information/ci-personal-user.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_USER_CURRENT_LEARNING_STYLE_INPUT:
            return '<img src="img/icons-context-information/ci-personal-knowledge.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_USER_CURRENT_LEARNING_STYLE_PERCEPTION:
            return '<img src="img/icons-context-information/ci-personal-knowledge.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_USER_CURRENT_LEARNING_STYLE_PROCESSING:
            return '<img src="img/icons-context-information/ci-personal-knowledge.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_USER_CURRENT_LEARNING_STYLE_UNDERSTANDING:
            return '<img src="img/icons-context-information/ci-personal-knowledge.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_USER_ROLE:
            return '<img src="img/icons-context-information/ci-personal-role.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_USER_STATE_OF_MIND:
            return '<img src="img/icons-context-information/ci-personal-user-state-of-mind.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';

        // situational (Situationsbezogen)
        case dictionary_optionsContextInfos.CI_CURRENT_APPOINTMENT:
            return '<img src="img/icons-context-information/ci-situational-appointment.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_NEXT_APPOINTMENT:
            return '<img src="img/icons-context-information/ci-situational-appointment.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_TIME_UNTIL_TIMESTAMP:
            return '<img src="img/icons-context-information/ci-situational-timeduration.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';

        // technical (Infrastruktur)
        case dictionary_optionsContextInfos.CI_AUDIO_OUTPUT_AVAILABLE:
            return '<img src="img/icons-context-information/ci-technical-audio-available.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_DEVICE_TYPE:
            return '<img src="img/icons-context-information/ci-technical-device-type.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_DISPLAY_RESOLUTION:
            return '<img src="img/icons-context-information/ci-technical-display-resolution.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_EXTERNAL_DISPLAY_AVAILABLE:
            return '<img src="img/icons-context-information/ci-technical-display-available.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_HAS_SCREEN_READER_FUNCTIONALITY:
            return '<img src="img/icons-context-information/ci-technical-screenreader-available.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_MICROPHONE_AVAILABLE:
            return '<img src="img/icons-context-information/ci-technical-micropone-available.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_PHOTO_CAMERA_AVAILABLE:
            return '<img src="img/icons-context-information/ci-technical-photo-camera-available.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_PRINTER_AVAILABLE:
            return '<img src="img/icons-context-information/ci-technical-printer-available.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_VIDEO_CAMERA_AVAILABLE:
            return '<img src="img/icons-context-information/ci-technical-video-camera-available.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';

        // physical (Umwelt)
        case dictionary_optionsContextInfos.CI_CURRENT_AIR_PRESSURE:
            return '<img src="img/icons-context-information/ci-physical-air-pressure2.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_CURRENT_AMBIENT_NOISE:
            return '<img src="img/icons-context-information/ci-physical-ambient-noise.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_CURRENT_HUMIDITY:
            return '<img src="img/icons-context-information/ci-physical-humidity.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_CURRENT_LUMINOSITY:
            return '<img src="img/icons-context-information/ci-physical-luminosity.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_CURRENTLY_RAINING:
            return '<img src="img/icons-context-information/ci-physical-raining.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_CURRENTLY_SUNNY:
            return '<img src="img/icons-context-information/ci-physical-sunny.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_CURRENT_TEMPERATURE:
            return '<img src="img/icons-context-information/ci-physical-temperature.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_CURRENT_TIME:
            return '<img src="img/icons-context-information/ci-physical-time.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';

        // location (Ortung)
        case dictionary_optionsContextInfos.CI_USER_DESTINATION:
            return '<img src="img/icons-context-information/ci-location-goal.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_DID_ARRIVE_AT_LOCATION:
            return '<img src="img/icons-context-information/ci-location-arrived.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_DID_LEAVE_LOCATION:
            return '<img src="img/icons-context-information/ci-location-goal-mirrored.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_IS_AT_LOCATION:
            return '<img src="img/icons-context-information/ci-location-location.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_USER_LOCATION_ADDRESS:
            return '<img src="img/icons-context-information/ci-location-address.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_USER_LOCATION_BUILDING:
            return '<img src="img/icons-context-information/ci-location-building.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_USER_LOCATION_COUNTRY:
            return '<img src="img/icons-context-information/ci-location-country.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_USER_LOCATION_DISTANCE:
            return '<img src="img/icons-context-information/ci-location-distance.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_USER_LOCATION_LATITUDE:
            return '<img src="img/icons-context-information/ci-location-latlng.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_USER_LOCATION_LONGITUDE:
            return '<img src="img/icons-context-information/ci-location-latlng.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_USER_LOCATION_REGION:
            return '<img src="img/icons-context-information/ci-location-region.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_USER_MEANS_OF_TRANSPORTATION:
            return '<img src="img/icons-context-information/ci-location-transport.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
        case dictionary_optionsContextInfos.CI_USER_MOVEMENT_SPEED:
            return '<img src="img/icons-context-information/ci-location-speed.png" width="15" height="15" title="' +
                item.text + '" ccID="' + ccID + '">';
    }
    return '<img src="img/context-classes/' + optgroup + '.png" width="15" height="15" title="' +
        item.text + '" ccID="' + ccID + '">';
}