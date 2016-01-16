/**
 * Created by Helena on 15.01.2016.
 */


function SimulationStep () {
    this._id = "";
    this._events = [];
    this._simulation = {};

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
SimulationStep.prototype.getEventOfType = function(contextID) {
    for (var i in this._events)
        if (this._events[i].getContextInfoID() == contextID)
            return this._events[i];
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