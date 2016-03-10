/**
 * Created by Helena on 15.01.2016.
 */


function Timeline (events, situations, columnMap, selectedStep) {

    this._events = events || [];
    this._situations = situations || [];
    this._columnContextMap = columnMap || [];

    this._selectedStep = (typeof selectedStep != "undefined") ? selectedStep : 0;

    return this;
}

Timeline.prototype.getEvents = function() {
    return this._events;
};

Timeline.prototype.getRows = function() {
    return this._situations;
};

Timeline.prototype.getNumberOfSituations = function() {
    return this._situations.length;
};

Timeline.prototype.getColumnContextMap = function() {
    return this._columnContextMap;
};

Timeline.prototype.getNumberOfColumns = function() {
    return this._columnContextMap.length;
};

Timeline.prototype.getStepEvents = function(start, end) {
    // default: return events of *one* step only
    if (!end) end = start;

    var events = [];
    for (start; start <= end; start++)
        events = events.concat(this._situations[start]);
    return events;
};

Timeline.prototype.getSelectedStepEvents = function () {
    return this._situations[this._selectedStep];
};

Timeline.prototype.getColumnEvents = function(start, end) {
    // default: return events of *one* column only
    if (!end) end = start;

    var events = [];
    for (start; start <= end; start++)
        events = events.concat(this._columnContextMap[start].events);
    return events;
};

Timeline.prototype.getColumnContext = function(col) {
    return this._columnContextMap[col].contextInfo;
};

Timeline.prototype.getColumnsForContextInfo = function(contextInfo) {
    var columns = [];
    this._columnContextMap.forEach(function (column) {
        if (column.contextInfo.getID() == contextInfo.getID())
            columns.push(column);
    });
    return columns;
};


Timeline.prototype.getSelectedStep = function () {
    return this._selectedStep;
};

Timeline.prototype.getEventAt = function(row, col) {
    var latestEvent;
    this._situations[row].forEach(function (event) {
        // row and column match...
        if (event.getColumn() == col)

            // ...and this event is the only - or the latest one - scheduled here
            if (!latestEvent || event.getStart() == row)
                latestEvent = event;
    });
    return latestEvent;
};

Timeline.prototype.getEventByUUID = function(eventUUID) {
    for (var i in this._events)
        if (this._events[i].getUUID() == eventUUID)
            return this._events[i];
};



Timeline.prototype.setEvents = function (events) {
    this._events = events;
};
Timeline.prototype.setRowMap = function (array) {
    this._situations = array;
};
Timeline.prototype.setColumnContextMap = function (map) {
    this._columnContextMap = map;
};
Timeline.prototype.setSelectedStep = function (selectedStep) {
    this._selectedStep = selectedStep;
};
Timeline.prototype.incrementSelectedStep = function () {
    if (this._selectedStep < this._situations.length)
        this._selectedStep++;
};
Timeline.prototype.decrementSelectedStep = function () {
    if (this._selectedStep > 0)
        this._selectedStep--;
};



Timeline.prototype.addStep = function (index) {

    var newStep = [];

    if (typeof index == "undefined") index = this._situations.length;

    // if step is inserted (instead of appended)
    else {
        // adjust start and end of each event to new position in timeline
        this._events.forEach(function (event) {
            var eventStart = event.getStart();
            if (eventStart >= index) event.setStart(eventStart + 1);
            var eventEnd = event.getEnd();
            if (eventEnd >= index) event.setEnd(eventEnd + 1);
        });

        // add events that span several steps including this one to newly inserted step
        this._situations[index].forEach(function (event) {
            if (event.getStart() < index)
                newStep.push(event);
        });
    }

    // add/insert new step
    this._situations.splice(index, 0, newStep);
};

Timeline.prototype.removeStep = function(index) {
    if (typeof index == "undefined")
        return;

    // remove all events of this situation, but only this situation
    var self = this;
    this._situations[index].forEach(function (event) {
        if (event.getStart() == index && (event.getEnd() == index || event.getColumn() == 0))
            self.removeEvent(event);
    });
    // remove the situation itself
    this._situations.splice(index, 1);

    // re-set start and end of each following event accordingly
    this._events.forEach(function (event) {
        var eventStart = event.getStart();
        if (eventStart > index) event.setStart(eventStart - 1);
        var eventEnd = event.getEnd();
        if (eventEnd >= index) event.setEnd(eventEnd - 1);
    });
};

Timeline.prototype.addColumn = function(contextInfo, index) {

    if (typeof index == "undefined") {
        // default: "post-pend" new column
        index = this._columnContextMap.length;

        // if context info type already exists in timeline, append column to last one for this info
        this._columnContextMap.forEach(function (column, colID) {
            if (column.contextInfo.getID() == contextInfo.getID()) index = colID + 1;
        });
    }

    // actually add the column at calculated index
    this._columnContextMap.splice(index, 0, {
        "contextInfo": contextInfo,
        "events": []
    });

    // adjust column properties of all events following that column
    index++;
    this._columnContextMap.slice(index).forEach(function (col) {
        col.events.forEach(function (event) {
            event.setColumn(event.getColumn()+1);
        });
    });
};

Timeline.prototype.removeColumn = function(index) {
    if (typeof index == "undefined")
        return;

    var self = this;
    this._columnContextMap[index].events.forEach(function (event) {
        self.removeEvent(event);
    });
    this._columnContextMap.splice(index, 1);

    this._columnContextMap.slice(index).forEach(function (col) {
        col.events.forEach(function (event) {
            event.setColumn(event.getColumn()-1);
        });
    });
};

Timeline.prototype.addEvent = function (event) {
    this._events.push(event);
    for (var start = event.getStart(); start <= event.getEnd(); start++)
        this._situations[start].push(event);
    this._columnContextMap[event.getColumn()].events.push(event);
};

Timeline.prototype.addAllEvents = function (events) {
    var self = this;
    events.forEach(function (event) {
        self.addEvent(event);
    });
};

Timeline.prototype.copyEventsTo = function(events, stepIndex) {
    var self = this;
    events.forEach(function (event) {
        var eventCopy = event.getCopy();
        eventCopy.setStart(stepIndex);
        eventCopy.setEnd(stepIndex);
        self.addEvent(eventCopy);
    });
};

Timeline.prototype.spliceEventAt = function(event, index) {
    if (index <= event.getStart() || index >= event.getEnd())
        return;

    var eventCopy = event.getCopy();

    this.removeEvent(event);

    event.setEnd(index);
    eventCopy.setStart(index + 1);

    this.addAllEvents([event, eventCopy]);
};


Timeline.prototype.updateEventTimeslot = function(contextEvent, newStart, newEnd) {

    if (typeof newStart == "undefined")
        newStart = contextEvent.getStart();

    if (expectsLearningUnit(contextEvent.getContextInfo()))
        newEnd = this.getNumberOfSituations() - 1;

    else if (typeof newEnd == "undefined")
        newEnd = contextEvent.getEnd();


    this.removeEvent(contextEvent);

    contextEvent.setStart(newStart);
    contextEvent.setEnd(newEnd);

    this.addEvent(contextEvent);
};



Timeline.prototype.removeEvent = function (eventUUID) {
    if (eventUUID.constructor == ContextEvent)
        eventUUID = eventUUID.getUUID();

    var start, end, col;
    for (var i in this._events)
        if (this._events[i].getUUID() == eventUUID) {
            start = this._events[i].getStart();
            end = this._events[i].getEnd();
            col = this._events[i].getColumn();

            this._events.splice(i, 1);
            break;
        }

    if (isNaN(start) || isNaN(end) || isNaN(col)) return;

    for (start; start <= end; start++)
        for (var i in this._situations[start])
            if (this._situations[start][i].getUUID() == eventUUID) {
                this._situations[start].splice(i, 1);
                break;
            }

    for (var i in this._columnContextMap[col].events)
        if (this._columnContextMap[col].events[i].getUUID() == eventUUID) {
            this._columnContextMap[col].events.splice(i, 1);
            break;
        }
};


Timeline.prototype.render = function (simulation) {

    removeTimelineTableMarkup();

    createHeader();
    createSteps(this.getNumberOfSituations());
    this._columnContextMap.forEach(function (col) {
        createColumn(col.contextInfo);
    });
    this._events.forEach(function(event) {
        event.render(simulation);
    });

    activateTimelineTable(simulation);
};




Timeline.prototype.deserializeEvents = function (events) {
    var self = this;
    events.forEach(function (event) {
        self.addEvent(ContextEvent.deserialize(event));
    });
};
