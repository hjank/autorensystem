/**
 * Created by juliushofler on 06.04.15.
 */

var array_ContextInformations = [];
var array_ContextClasses = [];

/** Structure context informations

 array_ContextInformations = [array_ContextInformation1, array_ContextInformation2, array_ContextInformation3, ...]
    array_ContextInformation = [id, array_classes, array_contextValue, array_parameter]
        array_classes = [class1, class2, ...]
        array_contextValue = [array_contextValueAttributes, array_operators, array_posVal]
            array_contextValueAttributes = [{type:value}, ({min:value}, {max:value}, {default:value})]
            array_operators = [operator1, operator2, ...]
            array_posVal = [value1, value2, ...]
        array_parameter = [array_parameterValue1, array_parameterValue2, ...]
            array_parameterValue = [id, type, array_values]
                array_values = [value1, value2, ...]
 **/

$(function() {

    // http://localhost:9998/xml/get-context-information
    // build url
    var domain = "localhost";
    var port = "9998";
    var uri = "/xml/get-context-information";
    var url = "http://" + domain + ":" + port + uri;

    // get context information from xml file
    $.ajax({
        type: "GET",
        url: "measurable-context-information.xml",
        //url: url,
        dataType: "xml",

        // if file is available parse out all information
        success: function(xml) {

            // parse all needed information from the xml file
            $('information', xml).each(function() {

                var array_ContextInformation = [];

                /* get the name of the information */
                var name = this.getAttribute("id");
                var originalName = name;
                name = translate_contextInformation(name);

                /* get the context classes from the current information */
                var array_classes = [];
                var contextClasses = $('contextClasses', this).children();

                // get all classes and put them into an array
                contextClasses.each(function() {
                    var contextClass = this.getAttribute("id");
                    contextClass = translate_contextClass(contextClass);
                    array_classes.push(contextClass);
                });
                array_classes.name = "Context Classes";


                /* get the context values from the current information */
                var contextValue = $('contextValue', this);

                // 1. type of context value
                var array_contextValueAttributes = [];
                var type = {"type": contextValue[0].getAttribute("type")};
                array_contextValueAttributes.push(type);

                // get border minimum if given
                if (contextValue[0].getAttribute("min")) {
                    var min = {"min": contextValue[0].getAttribute("min")};
                    array_contextValueAttributes.push(min);
                }

                // get border maximum if given
                if (contextValue[0].getAttribute("max")) {
                    var max = {"max": contextValue[0].getAttribute("max")};
                    array_contextValueAttributes.push(max);
                }

                // get default value if given
                if (contextValue[0].getAttribute("default")) {
                    var def = {"default": contextValue[0].getAttribute("default")};
                    array_contextValueAttributes.push(def);
                }

                // 2. all possible operators
                var array_operators = [];
                var operators = contextValue.children("operators").children().each(function() {
                    var operator = this.getAttribute("id");
                    operator = translate_operator(operator);
                    array_operators.push(operator);
                });
                array_operators.name = "Operators";

                // 3. all possible values
                var array_posVal = [];
                var possibleValues = contextValue.children("possibleValues").children().each(function() {
                    var parameter = this.innerHTML;
                    parameter = translate_contextParameter(parameter);
                    array_posVal.push(parameter);
                });
                array_posVal.name = "Possible Values";

                // push all context values into an array
                var array_contextValue = [];
                array_contextValue.push(array_contextValueAttributes, array_operators, array_posVal);
                array_contextValue.name = "Context Value";


                /* get the parameters if needed */
                var parameters = $('parameters', this);

                // if parameter section exists
                var array_parameter = [];
                if (parameters.length != 0) {

                    // all parameters
                    parameters.children("parameter").each(function() {

                        // get id of each parameter
                        var id = this.getAttribute("id");
                        id = translate_parameter(id);

                        var array_values = [];
                        var paraValue = $(this).children("parameterValue");

                        // all parameter values
                        paraValue.each(function() {

                            // get the type of each parameter value
                            var type = this.getAttribute("type");

                            var array_parameterValue = [];

                            // different types have different values
                            switch (type) {

                                case "ENUM":
                                    // get the only possible values for this parameter
                                    if (paraValue.children("possibleValues").length != 0) {
                                        paraValue.children("possibleValues").children("value").each(function() {
                                            var value = this.innerHTML;
                                            value = translate_parameterValues(value);
                                            array_values.push(value);
                                            array_values.name = "Possible Values";
                                        });
                                    }
                                    break;

                                case "FLOAT":
                                    // floats have always a minimum and maximum value
                                    var min = this.getAttribute("min");
                                    var max = this.getAttribute("max");
                                    array_values.push({"min":min, "max":max});
                                    array_values.name = "Minimum and Maximum Values";
                                    break;

                                case "INTEGER":
                                    break;

                                case "STRING":
                                    break;
                            }
                            // push all parameters into an array
                            array_parameterValue.push(id, type, array_values);
                            array_parameterValue.name = "Parameter";
                            array_parameter.push(array_parameterValue);
                        });
                    });
                }
                array_parameter.name = "Parameters (id, type, values)";

                // put all information into an array
                array_ContextInformation.push(name, array_classes, array_contextValue, array_parameter, originalName);
                array_ContextInformations.push(array_ContextInformation);
            });
            // after finishing the parsing, elements could be added into tab bar
            parsingFinished();
        }
    });

    // fill context classes array (needed for visualization)
    array_ContextClasses.push("Lernszenario", "Persönlich", "Situationsbezogen",
        "Infrastruktur", "Umwelt", "Ortung");
});

// translate context information into german
var dictionary_optionsContextInfos = {};
/**
 * Functions translate context information into german.
 * @param {String} ci Contains a context information
 * return translated context information
 * */
function translate_contextInformation(ci) {

    switch (ci) {
        case "CI_CURRENT_LEARNING_UNIT":
            ci = "Momentane Lerneinheit";
            dictionary_optionsContextInfos.CI_CURRENT_LEARNING_UNIT = ci;
            break;
        case "CI_FINISHED_LEARNING_UNIT":
            ci = "Lerneinheit abgeschlossen";
            dictionary_optionsContextInfos.CI_FINISHED_LEARNING_UNIT = ci;
            break;
        case "CI_USER_DID_PERFORM_ACTION":
            ci = "Benutzer (Aktion)";
            dictionary_optionsContextInfos.CI_USER_DID_PERFORM_ACTION = ci;
            break;
        case "CI_AUDIO_OUTPUT_AVAILABLE":
            ci = "Ton verfügbar";
            dictionary_optionsContextInfos.CI_AUDIO_OUTPUT_AVAILABLE = ci;
            break;
        case "CI_CURRENT_AIR_PRESSURE":
            ci = "Aktueller Luftdruck";
            dictionary_optionsContextInfos.CI_CURRENT_AIR_PRESSURE = ci;
            break;
        case "CI_CURRENT_AMBIENT_NOISE":
            ci = "Aktuelle Umgebungsgeräusche";
            dictionary_optionsContextInfos.CI_CURRENT_AMBIENT_NOISE = ci;
            break;
        case "CI_CURRENT_APPOINTMENT":
            ci = "Aktueller Termin";
            dictionary_optionsContextInfos.CI_CURRENT_APPOINTMENT = ci;
            break;
        case "CI_CURRENT_HUMIDITY":
            ci = "Aktuelle Luftfeuchtigkeit";
            dictionary_optionsContextInfos.CI_CURRENT_HUMIDITY = ci;
            break;
        case "CI_CURRENT_LUMINOSITY":
            ci = "Aktuelle Lichtstärke";
            dictionary_optionsContextInfos.CI_CURRENT_LUMINOSITY = ci;
            break;
        case "CI_CURRENTLY_RAINING":
            ci = "Regnerisch";
            dictionary_optionsContextInfos.CI_CURRENTLY_RAINING = ci;
            break;
        case "CI_CURRENTLY_SUNNY":
            ci = "Sonnig";
            dictionary_optionsContextInfos.CI_CURRENTLY_SUNNY = ci;
            break;
        case "CI_CURRENT_TEMPERATURE":
            ci = "Aktuelle Temperatur";
            dictionary_optionsContextInfos.CI_CURRENT_TEMPERATURE = ci;
            break;
        case "CI_CURRENT_TIME":
            ci = "Aktuelle Uhrzeit";
            dictionary_optionsContextInfos.CI_CURRENT_TIME = ci;
            break;
        case "CI_DEVICE_TYPE":
            ci = "Gerätetyp";
            dictionary_optionsContextInfos.CI_DEVICE_TYPE = ci;
            break;
        case "CI_DISPLAY_RESOLUTION":
            ci = "Displayauflösung";
            dictionary_optionsContextInfos.CI_DISPLAY_RESOLUTION = ci;
            break;
        case "CI_EXPECTED_TIME_NEEDED_FOR_COMPLETION":
            ci = "Erwartete benötigte Restzeit";
            dictionary_optionsContextInfos.CI_EXPECTED_TIME_NEEDED_FOR_COMPLETION = ci;
            break;
        case "CI_EXTERNAL_DISPLAY_AVAILABLE":
            ci = "Externer Bildschirm verfügbar";
            dictionary_optionsContextInfos.CI_EXTERNAL_DISPLAY_AVAILABLE = ci;
            break;
        case "CI_HAS_SCREEN_READER_FUNCTIONALITY":
            ci = "Hat Screenreader Funktionalität";
            dictionary_optionsContextInfos.CI_HAS_SCREEN_READER_FUNCTIONALITY = ci;
            break;
        case "CI_MICROPHONE_AVAILABLE":
            ci = "Mikrofon verfügbar";
            dictionary_optionsContextInfos.CI_MICROPHONE_AVAILABLE = ci;
            break;
        case "CI_NEXT_APPOINTMENT":
            ci = "Nächster Termin";
            dictionary_optionsContextInfos.CI_NEXT_APPOINTMENT = ci;
            break;
        case "CI_PHOTO_CAMERA_AVAILABLE":
            ci = "Fotokamera verfügbar";
            dictionary_optionsContextInfos.CI_PHOTO_CAMERA_AVAILABLE = ci;
            break;
        case "CI_PRINTER_AVAILABLE":
            ci = "Drucker verfügbar";
            dictionary_optionsContextInfos.CI_PRINTER_AVAILABLE = ci;
            break;
        case "CI_TIME_UNTIL_TIMESTAMP":
            ci = "Zeit bis zum Zeitstempel";
            dictionary_optionsContextInfos.CI_TIME_UNTIL_TIMESTAMP = ci;
            break;
        case "CI_USER_AGE":
            ci = "Alter des Benutzers";
            dictionary_optionsContextInfos.CI_USER_AGE = ci;
            break;
        case "CI_USER_CURRENT_LEARNING_STYLE_INPUT":
            ci = "Momentaner Benutzerlernstil";
            dictionary_optionsContextInfos.CI_USER_CURRENT_LEARNING_STYLE_INPUT = ci;
            break;
        case "CI_USER_CURRENT_LEARNING_STYLE_PERCEPTION":
            ci = "Momentaner Benutzerstilempfindung";
            dictionary_optionsContextInfos.CI_USER_CURRENT_LEARNING_STYLE_PERCEPTION = ci;
            break;
        case "CI_USER_CURRENT_LEARNING_STYLE_PROCESSING":
            ci = "Momentaner Benutzerstilverarbeitung";
            dictionary_optionsContextInfos.CI_USER_CURRENT_LEARNING_STYLE_PROCESSING = ci;
            break;
        case "CI_USER_CURRENT_LEARNING_STYLE_UNDERSTANDING":
            ci = "Momentaner Benutzerstilverständnis";
            dictionary_optionsContextInfos.CI_USER_CURRENT_LEARNING_STYLE_UNDERSTANDING = ci;
            break;
        case "CI_USER_DESTINATION":
            ci = "Ziel des Benutzers";
            dictionary_optionsContextInfos.CI_USER_DESTINATION = ci;
            break;
        case "CI_DID_ARRIVE_AT_LOCATION":
            ci = "An Standort angekommen";
            dictionary_optionsContextInfos.CI_DID_ARRIVE_AT_LOCATION = ci;
            break;
        case "CI_DID_LEAVE_LOCATION":
            ci = "Standort verlassen";
            dictionary_optionsContextInfos.CI_DID_LEAVE_LOCATION = ci;
            break;
        case "CI_IS_AT_LOCATION":
            ci = "Ist am Standort";
            dictionary_optionsContextInfos.CI_IS_AT_LOCATION = ci;
            break;
        case "CI_USER_LOCATION_ADDRESS":
            ci = "Adresse am Standort";
            dictionary_optionsContextInfos.CI_USER_LOCATION_ADDRESS = ci;
            break;
        case "CI_USER_LOCATION_BUILDING":
            ci = "Gebäude am Standort";
            dictionary_optionsContextInfos.CI_USER_LOCATION_BUILDING = ci;
            break;
        case "CI_USER_LOCATION_COUNTRY":
            ci = "Land am Standort";
            dictionary_optionsContextInfos.CI_USER_LOCATION_COUNTRY = ci;
            break;
        case "CI_USER_LOCATION_DISTANCE":
            ci = "Abstand zum Standort";
            dictionary_optionsContextInfos.CI_USER_LOCATION_DISTANCE = ci;
            break;
        case "CI_USER_LOCATION_LATITUDE":
            ci = "Standort Breitengrad";
            dictionary_optionsContextInfos.CI_USER_LOCATION_LATITUDE = ci;
            break;
        case "CI_USER_LOCATION_LONGITUDE":
            ci = "Standort Längengrad";
            dictionary_optionsContextInfos.CI_USER_LOCATION_LONGITUDE = ci;
            break;
        case "CI_USER_LOCATION_REGION":
            ci = "Region am Standort";
            dictionary_optionsContextInfos.CI_USER_LOCATION_REGION = ci;
            break;
        case "CI_USER_MEANS_OF_TRANSPORTATION":
            ci = "Transportmittel des Benutzers";
            dictionary_optionsContextInfos.CI_USER_MEANS_OF_TRANSPORTATION = ci;
            break;
        case "CI_USER_MOVEMENT_SPEED":
            ci = "Fortgebewegungsgeschw. des Benutzers";
            dictionary_optionsContextInfos.CI_USER_MOVEMENT_SPEED = ci;
            break;
        case "CI_USER_ROLE":
            ci = "Benutzerrolle";
            dictionary_optionsContextInfos.CI_USER_ROLE = ci;
            break;
        case "CI_VIDEO_CAMERA_AVAILABLE":
            ci = "Videokamera verfügbar";
            dictionary_optionsContextInfos.CI_VIDEO_CAMERA_AVAILABLE = ci;
            break;
        case "CI_USER_STATE_OF_MIND":
            ci = "Gemütszustand des Benutzers";
            dictionary_optionsContextInfos.CI_USER_STATE_OF_MIND = ci;
            break;
    }
    return ci;
}

// translate context classes into german
/**
 * Functions translate context class into german.
 * @param {String} cc Contains a context class
 * return translated context class
 * */
function translate_contextClass(cc) {

    switch (cc) {
        case "CC_SCENARIO":
            cc = "Lernszenario";    // color: #3287C8
            break;
        case "CC_PERSONAL":
            cc = "Persönlich";      // color: #AF46C8
            break;
        case "CC_SITUATIONAL":
            cc = "Situationsbezogen";   // color: #91F52D
            break;
        case "CC_TECHNICAL":
            cc = "Infrastruktur";   // color: #969696
            break;
        case "CC_PHYSICAL":
            cc = "Umwelt";        // color: #FADC3C
            break;
        case "CC_LOCATION":
            cc = "Ortung";      // color: #F03C32
            break;
    }
    return cc;
}

// translate operator into german
/**
 * Functions translate operator into german.
 * @param {String} op Contains a operator
 * return translated operator
 * */
function translate_operator(op) {

    switch (op) {
        case "CONTAINS":
            op = "Beinhaltet";
            break;
        case "IS":
            op = "Ist";
            break;
        case "IS_NOT":
            op = "Ist nicht";
            break;
        case "NO_VALUE":
            op = "Hat keinen Wert";
            break;
        case "GREATER_THEN":
            op = "Ist größer als";
            break;
        case "LESS_THEN":
            op = "Ist kleiner als";
            break;
    }
    return op;
}

// translate context parameter into german
/**
 * Functions translate context parameter into german.
 * @param {String} cp Contains a context parameter
 * return translated context parameter
 * */
function translate_contextParameter(cp) {

    switch (cp) {
        case "ACTIVATE_ACTION":
            cp = "aktiviert";
            break;
        case "CHOOSE_ACTION":
            cp = "wählt";
            break;
        case "DEACTIVATE_ACTION":
            cp = "deaktiviert";
            break;
        case "RESUME_ACTION":
            cp = "setzt fort";
            break;
        case "SUSPEND_ACTION":
            cp = "unterbricht";
            break;
        case "WATCH_ACTION":
            cp = "beobachtet";
            break;
        case "VIEW_ACTION":
            cp = "sieht";
            break;
        case "USE_ACTION":
            cp = "benutzt";
            break;
        case "LISTEN_ACTION":
            cp = "hört";
            break;
        case "READ_ACTION":
            cp = "liest";
            break;
        case "FEATURE_PHONE":
            cp = "Handy";
            break;
        case "TABLET_COMPUTER":
            cp = "Tablet";
            break;
        case "SMARTPHONE":
            cp = "Smartphone";
            break;
        case "SMARTWATCH":
            cp = "Smartwatch";
            break;
        case "AFOOT":
            cp = "Zu Fuß";
            break;
        case "BY_BIKE":
            cp = "Mit dem Fahrrad";
            break;
        case "STUDENT":
            cp = "Student/Lernender";
            break;
        case "TEACHER":
            cp = "Lehrer";
            break;
        case "UNKNOWN":
            cp = "Unbekannt";
            break;
        case "TRANSPORTATION":
            cp = "Auto/Öffentliche Verkehrsmittel";
            break;
    }
    return cp;
}

// translate parameter into german
/**
 * Functions translate parameter into german.
 * @param {String} p Contains a parameter
 * return translated parameter
 * */
function translate_parameter(p) {

    switch (p) {
        case "CP_ACTION_START_TIMESTAMP":
            p = "Startzeit";
            break;
        case "CP_ACTION_END_TIMESTAMP":
            p = "Endzeit";
            break;
        case "CP_ACTION_REFERNCED_LEARNING_NUGGET":
            p = "Referenzierter Lernklumpen";
            break;
        case "CP_APPOINTMENT_DETAIL":
            p = "Termindetails";
            break;
        case "CP_PRESSURE_UNIT":
            p = "Luftdruck Einheit";
            break;
        case "CP_TEMPERATURE_SCALE":
            p = "Temperaturskala";
            break;
        case "CP_TIME_COMPONENT":
            p = "Zeitstelle";
            break;
        case "CP_RESOLUTION_COMPONENT":
            p = "Auflösungsmaß";
            break;
        case "CP_RESOLUTION_UNIT":
            p = "Auflösungseinheit";
            break;
        case "CP_LEARNING_UNIT_ID":
            p = "Lerneinheits-ID";
            break;
        case "CP_TARGET_LATITUDE":
            p = "Breitengrad";
            break;
        case "CP_TAGET_LATITUDE":
            p = "Breitengrad";
            break;
        case "CP_TARGET_LONGITUDE":
            p = "Längengrad";
            break;
        case "CP_LATITUDE":
            p = "Breitengrad";
            break;
        case "CP_LONGITUDE":
            p = "Längengrad";
            break;
        case "CP_DISTANCE_UNIT":
            p = "Distanzeinheit";
            break;
        case "CP_VELOCITY_UNIT":
            p = "Geschwindigkeitseinheit";
            break;
        case "CP_STATE_OF_MIND":
            p = "Gemütszustand";
            break;
    }
    return p;
}

// translate parameter values into german
/**
 * Functions translate parameter values into german.
 * @param {String} pv Contains a parameter value
 * return translated parameter value
 * */
function translate_parameterValues(pv) {

    switch (pv) {
        case "BAR":
            pv = "Bar";
            break;
        case "MILLIMETER_OF_MERCURY":
            pv = "Milimeter in Quecksilbersäule";
            break;
        case "PASCAL":
            pv = "Pascal";
            break;
        case "TORR":
            pv = "Torr";
            break;
        case "DATE":
            pv = "Datum";
            break;
        case "LOCATION":
            pv = "Ort";
            break;
        case "NOTES":
            pv = "Anmerkung";
            break;
        case "TIME":
            pv = "Uhrzeit";
            break;
        case "TITLE":
            pv = "Titel";
            break;
        case "CELSIUS":
            pv = "Celsius";
            break;
        case "FAHRENHEIT":
            pv = "Fahrenheit";
            break;
        case "KELVIN":
            pv = "Kelvin";
            break;
        case "HOURS":
            pv = "Stunde";
            break;
        case "MINUTES":
            pv = "Minute";
            break;
        case "SECONDS":
            pv = "Sekunde";
            break;
        case "WIDTH":
            pv = "Breite";
            break;
        case "HEIGHT":
            pv = "Höhe";
            break;
        case "PIXELS":
            pv = "Pixel";
            break;
        case "POINTS":
            pv = "Punkte";
            break;
        case "CENTIMETERS":
            pv = "Centimeter";
            break;
        case "KILOMETERS":
            pv = "Kilometer";
            break;
        case "MILES":
            pv = "Meilen";
            break;
        case "KILOMETERS_PER_HOUR":
            pv = "km/h";
            break;
        case "MILES2_PER_HOUR":
            pv = "mph";
            break;
        case "ANGER":
            pv = "Verärgert";
            break;
        case "BOREDOM":
            pv = "Gelangweilt";
            break;
        case "CONCENTRATION":
            pv = "Konzentriert";
            break;
        case "CONFUSION":
            pv = "Verwirrt";
            break;
        case "CURIOSITY":
            pv = "Neugierig";
            break;
        case "DISTRACTION":
            pv = "Abgelenkt";
            break;
        case "HAPPINESS":
            pv = "Fröhlich";
            break;
        case "OPTIMISM":
            pv = "Optimistisch";
            break;
        case "SADNESS":
            pv = "Traurig";
            break;
        case "TIREDNESS":
            pv = "Erschöpft";
            break;
    }
    return pv;
}
