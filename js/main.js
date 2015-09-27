/**
 * Created by Helena on 27.09.2015.
 */


// global unit instance
var inst;
var bool_unitClicked = false;
var list_units = [];
var contextList = new ContextInfoList();

// reloading
var loadedData;

// if jsPlumb is ready
jsPlumb.ready(function () {

    // initialize jsPlumb instance
    initCanvas();
    // initialize global context list and reload data from localStorage
    initLoader();

});