/**
 * Created by Helena on 15.01.2016.
 */


function Timeline () {

    this._simulation = {};

    this._steps = [];
    this._columns = [];

    this._events = [];

    return this;
}

Timeline.prototype.getSimulation = function () {
    return this._simulation;
};
Timeline.prototype.getSteps = function () {
    return this._steps;
};
Timeline.prototype.getSelectedStep = function () {
    for (var i in this._steps)
        if (this._steps[i].getIsSelected())
            return this._steps[i];
};
Timeline.prototype.getColumns = function () {
    return this._columns;
};
Timeline.prototype.getEvents = function () {
    return this._events;
};

Timeline.prototype.setSimulation = function (simulation) {
    this._simulation = simulation;
};
Timeline.prototype.setSteps = function (steps) {
    this._steps = steps;
};
Timeline.prototype.addStep = function (step) {
    this._steps.push(step);
};
Timeline.prototype.setColumns = function (columns) {
    this._columns = columns;
};
Timeline.prototype.addColumn = function (col) {
    this._columns.push(col);
};
Timeline.prototype.setEvents = function (events) {
    this._events = events;
};
Timeline.prototype.addEvent = function (event) {
    this._events.push(event);
};
Timeline.prototype.removeEvent = function (eventUUID) {
    for (var i in this._events)
        if (this._events[i].getUUID() == eventUUID)
            this._events.splice(i, 1);
};