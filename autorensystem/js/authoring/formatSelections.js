/**
 * Created by juliushofler on 10.05.15.
 */

function formatGlobalElements() {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="checkbox"]').radiocheck();
    $('[data-toggle="switch"]').bootstrapSwitch();
    $("select").select2({dropdownCssClass: "dropdown-inverse"});
}

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

    return typeof contextIconSrcDictionary[selectedInfoID] != "undefined" ? '<img src="' + contextIconSrcDictionary[selectedInfoID] + '" width="15" height="15" title="' +
    translate_contextInformation(selectedInfoID) + '" contextInfoID="' + selectedInfoID + '">' : '<img src="img/context-classes/' + classNameTranslation + '.png" width="15" height="15" title="' +
    translate_contextInformation(selectedInfoID) + '" contextInfoID="' + selectedInfoID + '">';
}



function chooseMetaIcon(metaDataName) {
    switch (translate_metaData(metaDataName)) {
        case "Bild":
            return "fui-photo";
        case "Film":
            return "fui-video";
        case "Text":
            return "fui-document";
        case "Navigation":
            return "fui-location";
        case "Test":
            return "fui-radio-unchecked";
        case "Audio":
            return "fui-volume";
        case "3D Umgebung":
            return "fui-windows";
    }
}



// get the specific color for each context class
/**
 * Function finds specific color of a context class.
 * @param {String} cc Contains a context class.
 * @return {String} Returns the specific color.
 * */
function getColor(cc) {
    switch (cc) {
        case "Lernszenario":
            return "#3287C8";
        case "Persönlich":
            return "#AF46C8";
        case "Situationsbezogen":
            return "#91F52D";
        case "Infrastruktur":
            return "#969696";
        case "Umwelt":
            return "#FADC3C";
        case "Ortung":
            return "#F03C32";
    }
}


// get the color of each context class' label (depending on background color)
function getClassNameColor(classText) {
    // a little bit cumbersome but slightly easier to maintain
    switch (classText) {
        case "Lernszenario":
        case "Persönlich":
        case "Infrastruktur":
        case "Ortung":
            return "white";
        case "Situationsbezogen":
        case "Umwelt":
            return "#555555";
    }
}