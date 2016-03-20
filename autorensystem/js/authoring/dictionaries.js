/**
 * Created by Helena on 28.09.2015.
 */

// translate context information into german
var contextInfoDictionary = {
	"CI_NTP_REQUIRED" : "NTP benötigt",
    "CI_AVAILABLE_DEVICE" : "Thermo-Gerät verfügbar",
    "CI_WIFI_UI" : "Stil des WLAN-UI",
    "CI_AVAILABLE_NTP" : "NTP verfügbar",
    "CI_SUPPORT_KEYWORD" : "Support-Stichwort",
    "CI_CURRENT_LEARNING_UNIT" : "Momentane Lerneinheit",
    "CI_CURRENT_WFP_LOCATION" : "Aktuelle Indoor Position",
    "CI_IS_HEADSET_PLUGGED_IN" : "Headset eingesteckt",
    "CI_QR_CODE_CONTENT" : "QR Code Inhalt",
    "CI_FINISHED_LEARNING_UNIT" : "Absolvierte Lerneinheit",
    "CI_USER_DID_PERFORM_ACTION" : "Benutzer (Aktion)",
    "CI_AUDIO_OUTPUT_AVAILABLE": "Ton verfügbar",
    "CI_CURRENT_AIR_PRESSURE": "Aktueller Luftdruck",
    "CI_CURRENT_AMBIENT_NOISE": "Aktuelle Umgebungsgeräusche",
    "CI_CURRENT_APPOINTMENT": "Aktueller Termin",
    "CI_CURRENT_HUMIDITY": "Aktuelle Luftfeuchtigkeit",
    "CI_CURRENT_LUMINOSITY": "Aktuelle Lichtstärke",
    "CI_CURRENTLY_RAINING": "Regnerisch",
    "CI_CURRENTLY_SUNNY": "Sonnig",
    "CI_CURRENT_TEMPERATURE": "Aktuelle Temperatur",
    "CI_CURRENT_TIME": "Aktuelle Uhrzeit",
    "CI_DEVICE_TYPE": "Gerätetyp",
    "CI_DISPLAY_RESOLUTION": "Displayauflösung",
    "CI_EXPECTED_TIME_NEEDED_FOR_COMPLETION": "Erwartete benötigte Restzeit",
    "CI_EXTERNAL_DISPLAY_AVAILABLE": "Externer Bildschirm verfügbar",
    "CI_HAS_SCREEN_READER_FUNCTIONALITY": "Hat Screenreader Funktionalität",
    "CI_MICROPHONE_AVAILABLE": "Mikrofon verfügbar",
    "CI_NEXT_APPOINTMENT": "Nächster Termin",
    "CI_PHOTO_CAMERA_AVAILABLE": "Fotokamera verfügbar",
    "CI_PRINTER_AVAILABLE": "Drucker verfügbar",
    "CI_TIME_UNTIL_TIMESTAMP": "Zeit bis zum Zeitstempel",
    "CI_USER_AGE": "Alter des Benutzers",
    "CI_USER_CURRENT_LEARNING_STYLE_INPUT": "Momentaner Benutzerlernstil",
    "CI_USER_CURRENT_LEARNING_STYLE_PERCEPTION": "Momentaner Benutzerstilempfindung",
    "CI_USER_CURRENT_LEARNING_STYLE_PROCESSING": "Momentaner Benutzerstilverarbeitung",
    "CI_USER_CURRENT_LEARNING_STYLE_UNDERSTANDING": "Momentaner Benutzerstilverständnis",
    "CI_USER_DESTINATION": "Ziel des Benutzers",
    "CI_DID_ARRIVE_AT_LOCATION": "An Standort angekommen",
    "CI_DID_LEAVE_LOCATION": "Standort verlassen",
    "CI_IS_AT_LOCATION": "Ist am Standort",
    "CI_USER_LOCATION_ADDRESS": "Adresse am Standort",
    "CI_USER_LOCATION_BUILDING": "Gebäude am Standort",
    "CI_USER_LOCATION_COUNTRY": "Land am Standort",
    "CI_USER_LOCATION_DISTANCE": "Abstand zum Standort",
    "CI_USER_LOCATION_LATITUDE": "Standort Breitengrad",
    "CI_USER_LOCATION_LONGITUDE": "Standort Längengrad",
    "CI_USER_LOCATION_REGION": "Region am Standort",
    "CI_USER_MEANS_OF_TRANSPORTATION": "Transportmittel des Benutzers",
    "CI_USER_MOVEMENT_SPEED": "Fortgebewegungsgeschw. des Benutzers",
    "CI_USER_ROLE": "Benutzerrolle",
    "CI_VIDEO_CAMERA_AVAILABLE": "Videokamera verfügbar",
    "CI_USER_STATE_OF_MIND": "Gemütszustand des Benutzers"
};

var contextClassDictionary = {
    "CC_SCENARIO" : "Lernszenario",          // color: #3287C8
    "CC_PERSONAL" : "Persönlich",            // color: #AF46C8
    "CC_SITUATIONAL" : "Situationsbezogen",  // color: #91F52D
    "CC_TECHNICAL" : "Infrastruktur",        // color: #969696
    "CC_PHYSICAL" : "Umwelt",                // color: #FADC3C
    "CC_LOCATION" : "Ortung"                 // color: #F03C32
};

var contextOperatorDictionary = {
    "CONTAINS" : "beinhaltet",
    "IS" : "ist",
    "IS_NOT" : "ist nicht",
    "NO_VALUE" : "hat keinen Wert",
    "GREATER_THEN" : "ist größer als",
    "LESS_THEN" : "ist kleiner als"
};

var contextParameterDictionary = {
	"CP_DEVICE" : "Gerät",
    "CP_CONNECTION_TYPE" : "Verbindungstyp",
    "CP_ACTION_START_TIMESTAMP" : "Startzeit",
    "CP_ACTION_END_TIMESTAMP" : "Endzeit",
    "CP_ACTION_REFERNCED_LEARNING_NUGGET" : "Referenzierte Lerneinheit",
    "CP_APPOINTMENT_DETAIL" : "Termindetails",
    "CP_PRESSURE_UNIT" : "Luftdruck Einheit",
    "CP_TEMPERATURE_SCALE" : "Temperaturskala",
    "CP_TIME_COMPONENT" : "Zeitstelle",
    "CP_RESOLUTION_COMPONENT" : "Auflösungsmaß",
    "CP_RESOLUTION_UNIT" : "Auflösungseinheit",
    "CP_LEARNING_UNIT_ID" : "Lerneinheits-ID",
    "CP_TARGET_LATITUDE" : "Breitengrad",
    "CP_TAGET_LATITUDE" : "Breitengrad",
    "CP_TARGET_LONGITUDE" : "Längengrad",
    "CP_LATITUDE" : "Breitengrad",
    "CP_LONGITUDE" : "Längengrad",
    "CP_DISTANCE_UNIT" : "Distanzeinheit",
    "CP_VELOCITY_UNIT" : "Geschwindigkeitseinheit",
    "CP_STATE_OF_MIND" : "Gemütszustand"
};

var contextValueDictionary = {
	"Galaxy-S4-Android-5" : "Samsung Galaxy S4, Android 5",
    "Galaxy-S6-edge-Android-5" : "Samsung Galaxy S6 edge, Android 5",
    "Galaxy-Nexus-Android-4" : "Samsung Galaxy Nexus, Android 4",
    "Rainbow-Jam-Android-5" : "Wiko Rainbow Jam, Android 5",
    "Unknown-device" : "Unbekannt",
    "ACTIVATE_ACTION" : "aktiviert",
    "CHOOSE_ACTION" : "wählt",
    "DEACTIVATE_ACTION" : "deaktiviert",
    "RESUME_ACTION" : "setzt fort",
    "SUSPEND_ACTION" : "unterbricht",
    "WATCH_ACTION" : "beobachtet",
    "VIEW_ACTION" : "sieht",
    "USE_ACTION" : "benutzt",
    "LISTEN_ACTION" : "hört",
    "READ_ACTION" : "liest",
    "FEATURE_PHONE" : "Handy",
    "TABLET_COMPUTER" : "Tablet",
    "SMARTPHONE" : "Smartphone",
    "SMARTWATCH" : "Smartwatch",
    "AFOOT" : "zu Fuß",
    "BY_BIKE" : "mit dem Fahrrad",
    "STUDENT" : "Student/Lernender",
    "TEACHER" : "Lehrer",
    "UNKNOWN" : "Unbekannt",
    "TRANSPORTATION" : "Auto/Öffentliche Verkehrsmittel",
    "TRUE" : "wahr",
    "FALSE" : "nicht wahr"
};

var contextParameterValueDictionary = {
	"TROVIS_5573" : "Trovis 5573",
    "CONTROLLER" : "Controller",
    "ROUTER" : "FritzBox",
    "CONNECTION_WIFI" : "WLAN",
    "CONNECTION_CELL" : "Mobilfunk",
    "BAR" : "Bar",
    "MILLIMETER_OF_MERCURY" : "Millimeter in Quecksilbersäule",
    "PASCAL" : "Pascal",
    "TORR" : "Torr",
    "DATE" : "Datum",
    "LOCATION" : "Ort",
    "NOTES" : "Anmerkung",
    "TIME" : "Uhrzeit",
    "TITLE" : "Titel",
    "CELSIUS" : "Celsius",
    "FAHRENHEIT" : "Fahrenheit",
    "KELVIN" : "Kelvin",
    "HOURS" : "Stunde",
    "MINUTES" : "Minute",
    "SECONDS" : "Sekunde",
    "WIDTH" : "Breite",
    "HEIGHT" : "Höhe",
    "PIXELS" : "Pixel",
    "POINTS" : "Punkte",
    "CENTIMETERS" : "Centimeter",
    "KILOMETERS" : "Kilometer",
    "MILES" : "Meilen",
    "KILOMETERS_PER_HOUR" : "km/h",
    "MILES2_PER_HOUR" : "mph",
    "ANGER" : "Verärgert",
    "BOREDOM" : "Gelangweilt",
    "CONCENTRATION" : "Konzentriert",
    "CONFUSION" : "Verwirrt",
    "CURIOSITY" : "Neugierig",
    "DISTRACTION" : "Abgelenkt",
    "HAPPINESS" : "Fröhlich",
    "OPTIMISM" : "Optimistisch",
    "SADNESS" : "Traurig",
    "TIREDNESS" : "Erschöpft"
};

var metaDataDictionary = {
    "MD_IMAGE" : "Bild",
    "MD_FILM" : "Film",
    "MD_TEXT" : "Text",
    "MD_NAVIGATION" : "Navigation",
    "MD_TEST" : "Test",
    "MD_AUDIO" : "Audio",
    "MD_3D_ENVIRONMENT" : "3D Umgebung"
};

var relationDictionary = {
    "PRE" : "Prerequisite",
    "ALT" : "Alternative",
    "BAS" : "Basis",
    "REF" : "Reference",
    "EXT" : "Extension",
    "HLP" : "Help"
};

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
	"CI_NTP_REQUIRED" : "img/icons-context-information/ci-situational-ntp-required.png",
    "CI_SUPPORT_KEYWORD" : "img/icons-context-information/ci-situational-support.png",
    "CI_CURRENT_APPOINTMENT" : "img/icons-context-information/ci-situational-appointment.png",
    "CI_NEXT_APPOINTMENT" : "img/icons-context-information/ci-situational-appointment.png",
    "CI_TIME_UNTIL_TIMESTAMP" : "img/icons-context-information/ci-situational-timeduration.png",

    // technical (Infrastruktur)
	"CI_AVAILABLE_DEVICE" : "img/icons-context-information/ci-technical-available-device.png",
    "CI_WIFI_UI" : "img/icons-context-information/ci-technical-wifi-ui.png",
    "CI_AVAILABLE_NTP" : "img/icons-context-information/ci-technical-available-ntp.png",
    "CI_AUDIO_OUTPUT_AVAILABLE" : "img/icons-context-information/ci-technical-audio-available.png",
    "CI_DEVICE_TYPE" : "img/icons-context-information/ci-technical-device-type.png",
    "CI_DISPLAY_RESOLUTION" : "img/icons-context-information/ci-technical-display-resolution.png",
    "CI_EXTERNAL_DISPLAY_AVAILABLE" : "img/icons-context-information/ci-technical-display-available.png",
    "CI_HAS_SCREEN_READER_FUNCTIONALITY" : "img/icons-context-information/ci-technical-screenreader-available.png",
    "CI_MICROPHONE_AVAILABLE" : "img/icons-context-information/ci-technical-micropone-available.png",
    "CI_PHOTO_CAMERA_AVAILABLE" : "img/icons-context-information/ci-technical-photo-camera-available.png",
    "CI_PRINTER_AVAILABLE" : "img/icons-context-information/ci-technical-printer-available.png",
    "CI_VIDEO_CAMERA_AVAILABLE" : "img/icons-context-information/ci-technical-video-camera-available.png",
    //TODO: missing but important : battery status

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

/**
 * Functions translate context information into german.
 * @param {String} ci Contains a context information name
 * return translated context information name
 * */
function translate_contextInformation(ci) {
    return contextInfoDictionary[ci] || ci;
}

// translate context classes into german
/**
 * Functions translate context class into german.
 * @param {String} cc Contains a context class
 * return translated context class
 * */
function translate_contextClass(cc) {
    return contextClassDictionary[cc] || cc;
}

// translate operator into german
/**
 * Functions translate operator into german.
 * @param {String} op Contains a operator
 * return translated operator
 * */
function translate_operator(op) {
    return contextOperatorDictionary[op] || op;
}

// translate context value enums into german
/**
 * Function translates context value into german.
 * @param {String} cv Contains a possible context value
 * return translated context value
 * */
function translate_possibleValue(cv) {
    var valueString;
    if (!isNaN(cv)) valueString = parseFloat(parseFloat(cv).toFixed(3)); // convert to number -> truncate decimals -> lose "0"s
    // if the value is not a number, look it up in the dictionary; if it's not there, see if it's a unit; if not return it as it is
    else valueString = contextValueDictionary[cv] || translate_unitUUIDToName(cv);
    return valueString;
}

// translate parameter into german
/**
 * Functions translate parameter into german.
 * @param {String} p Contains a parameter
 * return translated parameter
 * */
function translate_parameter(p) {
    return contextParameterDictionary[p] || p;
}

// translate parameter values into german
/**
 * Functions translate parameter values into german.
 * @param {String} pv Contains a parameter value
 * return translated parameter value
 * */
function translate_parameterValue(pv) {
    var valueString;
    if (!isNaN(pv)) valueString = parseFloat(parseFloat(pv).toFixed(3)); // convert to number -> truncate decimals -> lose "0"s
    // if the value is not a number, look it up in the dictionary; if it's not there, see if it's a unit; if not return it as it is
    else valueString = contextParameterValueDictionary[pv] || translate_unitUUIDToName(pv);
    return valueString;
}

function translate_unitUUIDToName(unitUUID) {
    var unit = authorSystemContent.getUnitByUUID(unitUUID);
    return unit ? unit.getName() : unitUUID;
}

function translate_metaData(md) {
    return metaDataDictionary[md] || md;
}

function translate_relationLabelForward(label) {
    return "kno:has"+relationDictionary[label];
}

function translate_relationLabelBackward(label) {
    return "kno:is"+relationDictionary[label]+"Of";
}