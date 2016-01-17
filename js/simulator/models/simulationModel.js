/**
 * Created by Helena on 15.01.2016.
 */

const STOPPED = 0, STARTED = 1, PAUSED = 2;

function Simulation () {

    this._title = "";
    this._description = "";

    this._playBackSpeed = 3000; // default speed = 3 seconds per step
    this._status = STOPPED;

    this._scenario = {};

    this._simulatedContextList = new ContextInfoList();

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


Simulation.prototype.start = function () {
    this._status = STARTED;

    // TODO: 1. generate rules --> 2. start adaptation engine
};

Simulation.prototype.restart = function () {
    this._
};