/**
 * Created by Helena on 15.01.2016.
 */


function Simulation () {

    this._title = "Unbenannt";
    this._description = "";

    this._playBackSpeed = 3000; // default speed = 3 seconds per step
    this._isRunning = false;

    this._scenario = {};
    this._simulatedContextList = new ContextInfoList();

    this._timeline = {};

    return this;
}

Simulation.prototype.getTitle = function () {
    return this._title;
};
Simulation.prototype.getDescription = function () {
    return this._description;
};
Simulation.prototype.getPlayBackSpeed = function () {
    return this._playBackSpeed;
};
Simulation.prototype.getStatus = function () {
    return this._playBackSpeed;
};
Simulation.prototype.getScenario = function () {
    return this._scenario;
};
Simulation.prototype.getSimulatedContextList = function () {
    return this._simulatedContextList;
};
Simulation.prototype.getTimeline = function() {
    return this._timeline;
};

Simulation.prototype.setTitle = function (title) {
    this._title = title;
};
Simulation.prototype.setDescription = function (description) {
    this._description = description;
};
Simulation.prototype.setPlayBackSpeed = function (speed) {
    this._playBackSpeed = speed;
};
Simulation.prototype.setScenario = function (scenario) {
    this._scenario = scenario;
};
Simulation.prototype.setTimeline = function (timeline) {
    this._timeline = timeline;
};

Simulation.prototype.addContextItem = function (contextInfo) {
    this._simulatedContextList.addItem(contextInfo);
    this._timeline.addColumn(contextInfo);
};


Simulation.prototype.start = function (callback) {
    this._isRunning = true;


    // TODO: 1. generate rules --> 2. start adaptation engine
};

Simulation.prototype.pause = function (callback) {
    this._isRunning = false;
};

Simulation.prototype.restart = function (callback) {
    this._isRunning = true;
};