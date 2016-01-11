/**
 * Created by Helena on 03.10.2015.
 */


// check if all needed fields were filled with information
/**
 * Function checks whether all visible selections and input fields are not empty
 * @return {Array} Returns and array which includes the string with the missing content and which an object with selected infos.
 * */
function checkInformation() {

    var missing_content = ""; // displayed to user if something is missing

    var selectedInfoID = $("#selectContextInfos").select2("data");
    var selectedOperator = $("#selectOperator").select2("data");
    var selectedContextInfo;


    // check selection bar "Kontextinformationen"
    if ( selectedInfoID == null ) {
        // if selection bar context information is empty, concatenate it in missing_content string
        missing_content += " - Kontextinformation\n";
    } else {
        // create a copy of the selected context info's JSON structure
        selectedContextInfo = $.extend(true, new ContextInformation(), contextList.getItem(selectedInfoID.id));


        /*    // only addable if context info doesn't exist already
         for (var h=0; h<current_unit["contextInformations"].length; h++) {
         if (selectedContextInfo["text"] == current_unit["contextInformations"][h]["name"]) {
         alert(selectedContextInfo["text"] + " existiert bereits!");

         // if already exist return with error code
         return ["Error999", {}];
         }
         }*/

        // check selection bar "Operator"
        if ( selectedOperator == null ) {
            // if selection bar operator is empty, concatenate it in missing_content string
            missing_content += " - Operator\n";
        } else {
            // update JSON structure
            selectedContextInfo.setChosenOperator(selectedContextInfo.getOperators()[selectedOperator.id]);
        }

        // check and get context value
        var contextValue;
        switch(selectedContextInfo.getType()) {
            case "FLOAT":
            case "INTEGER":
            case "STRING":
                var inputField = $("#inputContextValue");
                // if input field context value is empty, concatenate it in missing_content string
                if ( inputField[0].value == "" ) {
                    missing_content += " - Wert\n";
                    inputField.parent().addClass("has-error");
                } else {
                    inputField.parent().removeClass("has-error");
                    contextValue = inputField[0].value;
                }
                break;
            case "ENUM":
            case "BOOLEAN":
                var selected = $("#selectPossibleValues").select2("data");
                // if selection bar context value is empty, concatenate it in missing_content string
                if ( selected["text"] == "\r" ) {
                    missing_content += " - Wert\n";
                }
                contextValue = selectedContextInfo.getEnums()[selected.id];
                break;
        }
        // update JSON structure
        selectedContextInfo.setChosenValue(contextValue);

        // check and get parameters (if existent)
        var selectedInfoParameters = selectedContextInfo.getParameters();
        var chosenParameterList = [];
        for (var i in selectedInfoParameters) {
            var parameter = $.extend(true, new Parameter(), selectedInfoParameters[i]);
            var parameterElement = $("#parameter"+i);
            var parameterDiv = parameterElement.parent();
            var paramValue;
            switch (parameter.getType()) {
                case "FLOAT":
                case "INTEGER":
                case "STRING":
                    // if input field is empty, concatenate it in missing_content string
                    if ( parameterElement[0].value == "" ) {
                        missing_content += " - " + translate_parameter(parameter.getID()) + "\n";
                        parameterDiv.addClass("has-error");
                    }
                    else {
                        parameterDiv.removeClass("has-error");
                        paramValue = parameterElement[0].value;
                    }
                    break;
                case "ENUM":
                case "BOOLEAN":
                    var selected = parameterElement.select2("data");
                    // if selection bar parameter is empty, concatenate it in missing_content string
                    if (selected["text"] == "\r") {
                        missing_content += " - " + translate_parameter(parameter.getID()) + "\n";
                    }
                    else
                        paramValue = parameter.getEnums()[selected.id];
                    break;
            }
            // update JSON structure
            parameter.setChosenValue(paramValue);
            chosenParameterList.push(parameter);
        }
        // replace context info's (inherited) parameters with chosen
        selectedContextInfo.setParameters(chosenParameterList);
    }

    // if content is missing do not accept adding of the context information
    if (!!missing_content) {
        alert("[Fehler] Bitte setzen Sie Werte in den folgenden Feldern:\n" + missing_content);
        return false;
    } else {
        // return selected context info object
        return selectedContextInfo;
    }
}
