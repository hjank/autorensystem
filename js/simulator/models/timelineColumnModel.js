/**
 * Created by Helena on 16.01.2016.
 */


function TimelineColumn (id, contextInfo, events/*, timeline*/) {

    this._id = id || 0; // corresponds with position in timeline
    this._contextInfo = contextInfo || {};
    this._events = events || [];
    //this._timeline = timeline || {};

    return this;
}

TimelineColumn.prototype.getID = function() {
    return this._id;
};
TimelineColumn.prototype.getContextInfo = function() {
    return this._contextInfo;
};
TimelineColumn.prototype.getEvents = function() {
    return this._events;
};
TimelineColumn.prototype.getEventAt = function(row) {
    for (var i in this._events)
        if (this._events[i].getStart() <= row && this._events[i].getEnd() >= row)
            return this._events[i];
};
TimelineColumn.prototype.getTimeline = function() {
    return this._timeline;
};


TimelineColumn.prototype.setID = function(id) {
    this._id = id;
};
TimelineColumn.prototype.setContextInfo = function(contextInfo) {
    this._contextInfo = contextInfo;
};
TimelineColumn.prototype.setEvents = function(events) {
    this._events = events;
};
TimelineColumn.prototype.addEvent = function(event) {
    this._events.push(event);
};
TimelineColumn.prototype.setTimeline = function(timeline) {
    this._timeline = timeline;
};