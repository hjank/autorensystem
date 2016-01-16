/**
 * Created by Helena on 27.09.2015.
 */


// global unit instance
var inst;
var bool_unitClicked = false;
var currentUnitUUID = "";
var contextList = new ContextInfoList();
var authorSystemContent = new AuthorSystemContent();

// reloading
var loadedData;

// if jsPlumb is ready (wrapper for jQuery.ready which means DOM is fully loaded)
jsPlumb.ready(function () {

    // initialize global context list
    contextList.initClasses();
    parseContextInfoXML();
    // initialize jsPlumb instance
    initPlumbCanvas();
    // reload data from localStorage
    initLoader();
    // init simulator
    initSimulator();
});