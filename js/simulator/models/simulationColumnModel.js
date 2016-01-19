/**
 * Created by Helena on 16.01.2016.
 */


function SimulationColumn (id, contextInfo, events, simulation) {

    this._id = id || 0; // corresponds with position in timeline
    this._contextInfo = contextInfo || {};
    this._events = events || [];
    this._simulation = simulation || {};

    return this;
}

SimulationColumn.prototype.getID = function() {
    return this._id;
};
SimulationColumn.prototype.getContextInfo = function() {
    return this._contextInfo;
};
SimulationColumn.prototype.getEvents = function() {
    return this._events;
};
SimulationColumn.prototype.getEventAt = function(row) {
    for (var i in this._events)
        if (this._events[i].getStart() <= row && this._events[i].getEnd() >= row)
            return this._events[i];
};
SimulationColumn.prototype.getSimulation = function() {
    return this._simulation;
};


SimulationColumn.prototype.setID = function(id) {
    this._id = id;
};
SimulationColumn.prototype.setContextInfo = function(contextInfo) {
    this._contextInfo = contextInfo;
};
SimulationColumn.prototype.setEvents = function(events) {
    this._events = events;
};
SimulationColumn.prototype.addEvent = function(event) {
    this._events.push(event);
};
SimulationColumn.prototype.setSimulation = function(simulation) {
    this._simulation = simulation;
};