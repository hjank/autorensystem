/**
 * Created by Helena on 06.09.2015.
 */

var array_multiSelectionMetaData = [];
var counter_multiSelectionMetaData = 0;


function fillMetadataTab () {

    /* tab "Metadaten" */
    // set all needed meta data
    var array_SelectionMetaData = ["Bild", "Film", "Text", "Navigation", "Test", "Audio", "3D Umgebung"];

    // get meta data options in selection bar
    for (var i=0; i<array_SelectionMetaData.length; i++) {
        var option = $("<option>").attr("value", i.toString());
        option.html(array_SelectionMetaData[i]);
        $("#selectMetaData").append(option);
    }
    // change format: add glyphs per option
    addMetadataGlyphsToOptions();
}


function loadMetadataTabforUnit(unit) {
    // clear multi selection in meta data tab
    $("#selectMultiMetaData").empty();
    $("#selectMultiMetaData").select2("data", null);
    array_multiSelectionMetaData = [];

    // get data back in multi selection bar from a past edited learning unit
    var array_icons = $(unit).find(".unit-meta-icons");
    for (var j=0; j<array_icons.length; j++) {
        array_multiSelectionMetaData.push({"id":j, "text":$(array_icons[j])[0].title});
    }

    // change format: add icons to text
    $("#selectMultiMetaData").select2({
        formatSelection: formatMultiMetaData,
        escapeMarkup: function(m) {return m;}
    });
    // get data in multi selection bar
    $("#selectMultiMetaData").select2("data", array_multiSelectionMetaData);
}


function addMetadataGlyphsToOptions() {
    $("#selectMetaData").select2({
        formatSelection: formatMetaData,
        formatResult: formatMetaData,
        escapeMarkup: function(m) {return m;}
    });
}

// change shown format in selection bar in tab "Metadaten"
/**
 * Function
 * @param {Object} item Contains the selected option from meta data selection bar.
 * @return {String} Returns DOM string which contains a meta data specific glyph and the corresponding text.
 * */
function formatMetaData(item) {

    switch (item.text) {
        case "Bild":
            return '<b class="fui-photo"> </b>' + item.text;
        case "Film":
            return '<b class="fui-video"> </b> ' + item.text;
        case "Text":
            return '<b class="fui-document"> </b>' + item.text;
        case "Navigation":
            return '<b class="fui-location"> </b> ' + item.text;
        case "Test":
            return '<b class="fui-radio-unchecked"> </b> ' + item.text;
        case "Audio":
            return '<b class="fui-volume"> </b>' + item.text;
        case "3D Umgebung":
            return '<b class="fui-windows"> </b>' + item.text;
    }
}

// change shown format in multi selection bar in tab "Metadaten"
/**
 * Function
 * @param {Object} item Contains the selected option from meta data selection bar.
 * @return {String} Returns DOM string which contains a meta data specific glyph.
 * */
function formatMultiMetaData(item) {

    switch (item.text) {
        case "Bild":
            return '<b class="fui-photo"></b>';
        case "Film":
            return '<b class="fui-video"></b>';
        case "Text":
            return '<b class="fui-document"></b>';
        case "Navigation":
            return '<b class="fui-location"></b>';
        case "Test":
            return '<b class="fui-radio-unchecked"></b>';
        case "Audio":
            return '<b class="fui-volume"></b>';
        case "3D Umgebung":
            return '<b class="fui-windows"></b>';
    }
}