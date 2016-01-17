/**
 * Created by Helena on 15.01.2016.
 */


function SimulationStep () {

    this._id = 0;  // corresponds with position in timeline
    this._events = [];
    this_simulation = {};
    this._isSelected = false;

    return this;
}

SimulationStep.prototype.getID = function() {
    return this._id;
};
SimulationStep.prototype.getEvents = function() {
    return this._events;
};
SimulationStep.prototype.getEventAt = function(pos) {
    return this._events[pos];
};
SimulationStep.prototype.getEventsOfType = function(contextID) {
    var events = [];
    for (var i in this._events)
        if (this._events[i].getContextInfoID() == contextID)
            events.push(this._events[i]);
    return events;
};
SimulationStep.prototype.getSimulation = function() {
    return this._simulation;
};
SimulationStep.prototype.getIsSelected = function () {
    return this._isSelected;
};

SimulationStep.prototype.setID = function(id) {
    this._id = id;
};
SimulationStep.prototype.setEvents = function(events) {
    this._events = events;
};
SimulationStep.prototype.setEventAt = function(event, pos) {
    this._events[pos] = event;
};
SimulationStep.prototype.setSimulation = function(simulation) {
    this._simulation = simulation;
};
SimulationStep.prototype.setIsSelected = function (selected) {
    this._isSelected = selected;
};