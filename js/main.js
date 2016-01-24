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
    getContextInfoList(false); // false = not from URL, but from local server
});

/**
 * This callback gets called once the contextInfoList has been loaded.
 */
function contextInfoListLoadedCallback () {
    // initialize jsPlumb instance
    initPlumbCanvas();
    // reload data from localStorage
    initLoader();
    // init simulator
    //initSimulator();
    handleSimulatorNavBarMenuEvents();
}