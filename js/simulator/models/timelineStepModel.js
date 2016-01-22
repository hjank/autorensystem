/**
 * Created by Helena on 15.01.2016.
 */


function TimelineStep (id, events, isSelected) {

    this._id = id || 0;  // corresponds with position in timeline
    this._events = events || [];
    this._isSelected = (typeof isSelected == "undefined") ? true : isSelected;

    return this;
}

TimelineStep.prototype.getID = function() {
    return this._id;
};
TimelineStep.prototype.getEvents = function() {
    return this._events;
};
TimelineStep.prototype.getEventAt = function(col) {
    for (var i in this._events)
        if (this._events[i].getColumn() == col)
            return this._events[i];
};
TimelineStep.prototype.getEventsOfType = function(contextID) {
    var events = [];
    for (var i in this._events)
        if (this._events[i].getContextInfo().getID() == contextID)
            events.push(this._events[i]);
    return events;
};
TimelineStep.prototype.getTimeline = function() {
    return this._timeline;
};
TimelineStep.prototype.getIsSelected = function () {
    return this._isSelected;
};

TimelineStep.prototype.setID = function(id) {
    this._id = id;
};
TimelineStep.prototype.setEvents = function(events) {
    this._events = events;
};
TimelineStep.prototype.addEvent = function(event) {
    this._events.push(event);
};
TimelineStep.prototype.setTimeline = function(timeline) {
    this._timeline = timeline;
};
TimelineStep.prototype.setIsSelected = function (selected) {
    this._isSelected = selected;
};