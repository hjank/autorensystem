/**
 * Created by Helena on 15.01.2016.
 */

function Simulation () {

    this._title = "";
    this._description = "";
    this._playBackSpeed = 3000; // default speed = 3 seconds per step
    this._timeline = {};
    this._scenario = {};

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
Simulation.prototype.getTimeline = function () {
    return this._timeline;
};
Simulation.prototype.getScenario = function () {
    return this._scenario;
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
Simulation.prototype.setTimeline = function (timeline) {
    this._timeline = timeline;
};
Simulation.prototype.setScenario = function (scenario) {
    this._scenario = scenario;
};