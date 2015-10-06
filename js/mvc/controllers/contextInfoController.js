/**
 * Created by Helena on 03.10.2015.
 */


// check if all needed fields were filled with information
/**
 * Function checks whether all visible selections and input fields are not empty
 * @param {Object} current_unit Contains the current selected unit.
 * @return {Array} Returns and array which includes the string with the missing content and which an object with selected infos.
 * */
function checkInformation(current_unit) {

    var selectedInfo = {};
    var missing_content = ""; // displayed to user if something is missing

    var selectedContextInfo = $("#selectContextInfos").select2("data");
    var selectedOperator = $("#selectOperator").select2("data");

    var contextInfoInArray = contextList.getItem(selectedContextInfo.id);


    // check selection bar "Kontextinformationen"
    if ( selectedContextInfo == null ) {
        // if selection bar context information is empty, concatenate it in missing_content string
        missing_content += " - Kontextinformation\n";
    } else {
        // update JSON structure
        selectedInfo.id = contextInfoInArray.name;
        selectedInfo.name = translate_contextInformation(contextInfoInArray.name);
    }

    /*    // only addable if context info doesn't exist already
     for (var h=0; h<current_unit["contextInformations"].length; h++) {
     if (selectedContextInfo["text"] == current_unit["contextInformations"][h]["name"]) {
     alert(selectedContextInfo["text"] + " existiert bereits!");

     // if already exist return with error code
     return ["Error999", {}];
     }
     }*/

    // check selection bar "Operator"
    if ( selectedOperator["text"] == "\r" ) {
        // if selection bar operator is empty, concatenate it in missing_content string
        missing_content += " - Operator\n";
    } else {
        // update JSON structure
        selectedInfo.operator = contextInfoInArray.value.operators[selectedOperator.id];
    }

    // check input "Wert" is visible AND filled with information
    if ( $("#inputContextValue")[0].style.display == "block" &&
        $("#inputContextValue")[0].disabled == false ) {

        // if input field context value is empty, concatenate it in missing_content string
        if ( $("#inputContextValue")[0].value == "" ) {
            missing_content += " - Wert\n";
            $("#inputContextValue").parent().addClass("has-error");

        } else if ($("#inputContextValue").parent().hasClass("has-error")) {
            $("#inputContextValue").parent().removeClass("has-error");
        }

        // update JSON structure
        selectedInfo.value = $("#inputContextValue")[0].value;

        // check if selection bar "Wert" is visible AND filled with information
    } else if ( $("#selectPossibleValues")[0].style.display == "block" &&
        $("#selectPossibleValues")[0].disabled != true ) {

        // if selection bar context value is empty, concatenate it in missing_content string
        if ( $("#selectPossibleValues").select2("data")["text"] == "\r" ) {
            missing_content += " - Wert\n";
        }

        // update JSON structure
        selectedInfo.value = contextInfoInArray.value.enums[$("#selectPossibleValues").select2("data").id];
    }

    // check selection bar "Parameter" is visible
    if ( $("#divParameterSelection1")[0].style.display == "block") {

        // if selection bar parameter is empty, concatenate it in missing_content string
        if ($("#selectParameter").select2("data")["text"] == "\r") {
            missing_content += " - " + $("#selectParameter")[0].labels[0].innerHTML + "\n";
        }

        // update JSON structure
        selectedInfo.parameter1 = contextInfoInArray.parameters.values[$("#selectParameter").select2("data").id];
    }
    // check selection bar "Parameter" is visible
    if ( $("#divParameterSelection2")[0].style.display == "block") {

        // if selection bar parameter is empty, concatenate it in missing_content string
        if ($("#selectParameter2").select2("data")["text"] == "\r") {
            missing_content += " - " + $("#selectParameter2")[0].labels[0].innerHTML + "\n";
        }

        // update JSON structure
        selectedInfo.parameter2 = contextInfoInArray.parameters.values[$("#selectParameter2").select2("data").id];
    }
    // check input context parameter 1 is visible
    if ( $("#divParameterInput1")[0].style.display == "table-cell" ) {

        // if input field context parameter is empty, concatenate it in missing_content string
        if ($("#inputContextParameter1")[0].value == "") {
            missing_content += " - " + $("#inputContextParameter1")[0].labels[0].innerHTML + "\n";
            $("#inputContextParameter1").parent().addClass("has-error");

        } else if ($("#inputContextParameter1").parent().hasClass("has-error")) {
            $("#inputContextParameter1").parent().removeClass("has-error");
        }

        // update JSON structure
        selectedInfo.input1 = $("#inputContextParameter1")[0].value;
    }
    // check input context parameter 2 is visible
    if ( $("#divParameterInput2")[0].style.display == "table-cell" ) {

        // if input field context parameter is empty, concatenate it in missing_content string
        if ($("#inputContextParameter2")[0].value == "") {
            missing_content += " - " + $("#inputContextParameter2")[0].labels[0].innerHTML + "\n";
            $("#inputContextParameter2").parent().addClass("has-error");

        } else if ($("#inputContextParameter2").parent().hasClass("has-error")) {
            $("#inputContextParameter2").parent().removeClass("has-error");
        }

        // update JSON structure
        selectedInfo.input2 = $("#inputContextParameter2")[0].value;
    }
    // check input context parameter string is visible
    if ( $("#divParameterString")[0].style.display == "block" ) {

        // if input field context parameter is empty, concatenate it in missing_content string
        if ($("#inputParameterString")[0].value == "") {
            missing_content += " - " + $("#inputParameterString")[0].labels[0].innerHTML + "\n";
            $("#inputParameterString").parent().addClass("has-error");

        } else if ($("#inputParameterString").parent().hasClass("has-error")) {
            $("#inputParameterString").parent().removeClass("has-error");
        }

        // update JSON structure
        selectedInfo.inputString = $("#inputParameterString")[0].value;
    }

    // create return array
    return [missing_content, selectedInfo];
}

