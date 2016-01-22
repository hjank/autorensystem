/**
 * Created by Helena on 15.01.2016.
 */


function Timeline (steps, columns, events) {

    this._steps = steps || [];
    this._columns = columns || [];

    this._events = events || [];

    return this;
}

Timeline.prototype.getSimulation = function () {
    return this._simulation;
};
Timeline.prototype.getSteps = function () {
    return this._steps;
};
Timeline.prototype.getStepsFromTo = function (start, end) {
    return this._steps.slice(start, end+1);
};
Timeline.prototype.getSelectedStep = function () {
    for (var i in this._steps)
        if (this._steps[i].getIsSelected())
            return this._steps[i];
};
Timeline.prototype.getColumns = function () {
    return this._columns;
};
Timeline.prototype.getColumn = function (id) {
    for (var i in this._columns)
        if (this._columns[i].getID() == id)
            return this._columns[i];
};
Timeline.prototype.getEvents = function () {
    return this._events;
};
Timeline.prototype.getEventAt = function(row, col) {
    return this._steps[row].getEventAt(col);
};
Timeline.prototype.getStepEvents = function(row) {
    return this._steps[row].getEvents();
};
Timeline.prototype.getColumnEvents = function(col) {
    return this._columns[col].getEvents();
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
    var self = this;
    events.forEach(function (item) {self.addEvent(item);});
};
Timeline.prototype.addEvent = function (event) {
    this._events.push(event);
    var self = this;
    var col = event.getColumn();
    this.getStepsFromTo(event.getStart(), event.getEnd()).forEach(function(item) {
        item.addEvent(event);
        self._columns[col].addEvent(event);
    });
};
Timeline.prototype.removeEvent = function (eventUUID) {
    for (var i in this._events)
        if (this._events[i].getUUID() == eventUUID)
            this._events.splice(i, 1);
    _removeEvent(eventUUID, this._steps);
    _removeEvent(eventUUID, this._columns);

};
Timeline.prototype.render = function (callback) {
    (typeof callback == "function" && callback(this));
};


function _removeEvent (eventUUID, list) {
    for (var i in list) {
        var eventList = list[i].getEvents();
        for (var k in eventList)
            if (eventList[k].getUUID() == eventUUID)
                eventList.splice(k, 1);
    }
};