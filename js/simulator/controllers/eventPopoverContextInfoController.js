/**
 * Created by Helena on 06.02.2016.
 */


function fillPopoverContextValue(ci, scenario, inputContextValueElement, selectPossibleValuesElement) {

    selectPossibleValuesElement.empty();

    // if a unit is expected as value (a unit's UUID, that is, which will be entered on confirm)
    if (expectsLearningUnit(ci) && scenario.constructor == Scenario) {
        inputContextValueElement.css("display", "none"); // make input field invisible

        // add all units of the current scenario
        scenario.getUnits().forEach(function (unit, index) {
            selectPossibleValuesElement.append($("<option>")
                .attr("value", index.toString())
                .html(unit.getName()));
        });
        return;
    }

    switch (ci.getType()) {

        case "FLOAT":
        case "INTEGER":
            selectPossibleValuesElement.remove();
            inputContextValueElement.attr("type", "number");
            setMinMaxDefault(ci.getMin(), ci.getMax(), ci.getDefault(), inputContextValueElement);

            break;

        case "STRING":
            selectPossibleValuesElement.remove();
            inputContextValueElement.attr("type", "text");

            break;

        case "ENUM":
            inputContextValueElement.css("display", "none");         // make input field invisible

            // fill selection bar
            var enums = ci.getEnums();
            for (var i in enums) {
                var option = $("<option>").attr("value", i.toString());
                option.html(translate_possibleValue(enums[i]));
                selectPossibleValuesElement.append(option);
            }

            break;

        case "BOOLEAN":
            inputContextValueElement.css("display", "none");      // and input field invisible

            // get the two possible values true and false in selection bar
            selectPossibleValuesElement.append($("<option>").attr("value", 1).html("ist wahr"));
            selectPossibleValuesElement.append($("<option>").attr("value", 0).html("ist falsch"));

            break;
    }
}

function fillPopoverParameterSelection(cp, divContextParams) {

    // in case there are coordinates to be set
    var divMaps = $("#divMaps");
    var coordsExpected = false;
    var lat, long;
    // remove all parameter fields from previous editing (except maps div)
    $("#divMapsTemplate").append(divMaps);

    divContextParams.empty();

    // iterate through all parameters
    for (var i in cp) {

        // get each parameter's ID, translated name, and previously chosen value (given we are in edit mode)
        var thisParam = cp[i];
        var parameterOriginal = thisParam.getID();
        var parameterTranslation = translate_parameter(parameterOriginal);
        var chosenValue = thisParam.getChosenValue(); // "" if not chosen previously

        var id = "popoverParameter"+i;
        var div = $("<div>").addClass("popover-parameter");
        var child;

        switch (thisParam.getType()) {

            // type enum needs a drop down selection for only possible values
            case "ENUM":
                div.append(createParameterLabelDOM(id, parameterTranslation));
                child = createNamedDOMElement("select", id)
                    .addClass("form-control select select-primary select-block mbl");

                // append all possible values
                var enums = thisParam.getEnums();
                enums.forEach(function(val, index) {
                    child.append($("<option>").attr("value", index.toString()).html(translate_parameterValue(val)));
                });
                div.append(child);
                divContextParams.append(div);

                $("#" + id).select2();
                // decision depends on mode we are in: new info --> empty, edit mode --> previous choice
                if (chosenValue == "")
                    $("#" + id).select2("data", {id:"\r",text:"\r"});
                else
                    $("#" + id).select2("data", {
                        id:enums.indexOf(chosenValue),
                        text:translate_parameterValue(chosenValue)
                    });

                break;


            // type float or integer each need an input field and a specific label
            case "INTEGER":
            case "FLOAT":
                // if coordinates are expected, set lat and long to either "" (new info) or previously input values
                if (/CP_.*LONGITUDE/.test(parameterOriginal)) {
                    long = chosenValue;
                    coordsExpected = true;
                }
                if (/CP_.*LATITUDE/.test(parameterOriginal)) {
                    lat = chosenValue;
                    coordsExpected = true;
                }

                div.addClass("parameter-input").append(createParameterLabelDOM(id, parameterTranslation));
                child = createNamedDOMElement("input", id).addClass("form-control")
                    .attr("type", "number")
                    .on("keyup", function (event) {
                        getParameterInput(event, coordsExpected);
                    });
                setMinMaxDefault(thisParam.getMin(), thisParam.getMax(), thisParam.getDefault(), child);

                // if we are in edit mode: previously saved value, else ""
                child.val(chosenValue);
                div.append(child);
                divContextParams.append(div);

                // display google maps if both lat and long have been set
                if (typeof lat != "undefined" && typeof long != "undefined") {

                    // put the map in a visible spot and render it correctly (hopefully)
                    divContextParams.append(divMaps);

                    // put marker where it has been placed before (i.e. we are in edit mode)
                    if (chosenValue != "") {
                        var latlng = new google.maps.LatLng(lat, long);
                        replaceMarker(latlng);
                        //resetMapToCenter(latlng);
                    } else
                        resizeMap();
                }
                break;

            // type string needs an input field and a specific label
            case "STRING":
                div.append(createParameterLabelDOM(id, parameterTranslation));
                child = createNamedDOMElement("input", id).addClass("form-control").attr("type", "text");
                // if we are in edit mode: previously saved value, else ""
                child.val(chosenValue);
                div.append(child);
                divContextParams.append(div);
                break;
        }
    }
}


function confirmPopoverContent(contextInfoDiv, contextInfo, scenario) {

    var inputElement = $(contextInfoDiv).children("input.popover-value");
    var inputValue = $(inputElement).val();
    var selectedValueID = $(contextInfoDiv).children(".select.popover-value").select2("val");

    // case value is one of ENUM or LEARNING_UNIT
    if (typeof selectedValueID != "undefined") {
        var enums = contextInfo.getEnums();
        if (enums.length != 0)
            inputValue = enums[selectedValueID];
        else if (expectsLearningUnit(contextInfo) && scenario.constructor == Scenario) {
            var units = scenario.getUnits();
            if (units.length > 0)
                inputValue = units[selectedValueID].getUUID();
        }
    }

    if (typeof inputValue != "undefined" && inputValue != "") contextInfo.setChosenValue(inputValue);
    else {
        $(inputElement).parent().addClass("has-error");
        return false;
    }

    var parameters = contextInfo.getParameters();
    for (var index in parameters) {
        var param = parameters[index];
        var paramElement = $(contextInfoDiv).find("#popoverParameter"+index);
        var paramValue;
        if (param.getType() == "ENUM")
            paramValue = param.getEnums()[$(paramElement).select2("val")];
        else
            paramValue = $(paramElement).val();

        if (typeof paramValue != "undefined" && paramValue != "") param.setChosenValue(paramValue);
        else {
            $(paramElement).parent().addClass("has-error");
            return false;
        }
    }

    return true;
}


function expectsLearningUnit(contextInfo) {
    return (contextInfo.getID().indexOf("LEARNING_UNIT") != -1);
}
