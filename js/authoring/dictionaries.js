/**
 * Created by Helena on 28.09.2015.
 */

// translate context information into german
var contextInfoDictionary = {
    "CI_CURRENT_LEARNING_UNIT" : "Momentane Lerneinheit",
    "CI_FINISHED_LEARNING_UNIT" : "Lerneinheit abgeschlossen",
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
    "FALSE" : "falsch"
};

var contextParameterValueDictionary = {
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
    if (!isNaN(cv)) valueString = parseFloat(cv).toFixed(3);
    else valueString = contextValueDictionary[cv] || cv;
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
    if (!isNaN(pv)) valueString = parseFloat(pv).toFixed(3);
    else valueString = contextParameterValueDictionary[pv] || pv;
    return valueString;
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