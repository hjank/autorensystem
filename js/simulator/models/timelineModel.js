/**
 * Created by Helena on 15.01.2016.
 */


function Timeline (events, rowMap, columnMap, selectedStep) {

    this._events = events || [];
    this._rowMap = rowMap || []; // keys are row, i.e. step numbers
    this._columnContextMap = columnMap || [];

    this._selectedStep = (typeof selectedStep != "undefined") ? selectedStep : 0;

    return this;
}


Timeline.prototype.getEvents = function() {
    return this._events;
};

Timeline.prototype.getRows = function() {
    return this._rowMap;
};

Timeline.prototype.getNumberOfRows = function() {
    return this._rowMap.length;
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
        events = events.concat(this._rowMap[start]);
    return events;
};

Timeline.prototype.getSelectedStepEvents = function () {
    return this._rowMap[this._selectedStep];
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

Timeline.prototype.getSelectedStep = function () {
    return this._selectedStep;
};

Timeline.prototype.getEventAt = function(row, col) {
    for (var i in this._rowMap[row])
        if (this._rowMap[row][i].getColumn() == col)
            return this._rowMap[row][i];
};

Timeline.prototype.getEventByUUID = function(eventUUID) {
    for (var i in this._events)
        if (this._events[i].getUUID() == eventUUID)
            return this._events[i];
};



Timeline.prototype.setEvents = function (events) {
    this._events = events;
};
Timeline.prototype.setRowMap = function (eventsMap) {
    this._rowMap = eventsMap;
};
Timeline.prototype.setColumnContextMap = function (map) {
    this._columnContextMap = map;
};
Timeline.prototype.setSelectedStep = function (selectedStep) {
    this._selectedStep = selectedStep;
};
Timeline.prototype.incrementSelectedStep = function () {
    this._selectedStep++;
};
Timeline.prototype.decrementSelectedStep = function () {
    this._selectedStep--;
};



Timeline.prototype.addStep = function (index) {
    if (typeof index == "undefined") index = this._rowMap.length;
    this._rowMap.splice(index, 0, []);
};

Timeline.prototype.addColumn = function(contextInfo, index) {
    if (typeof index == "undefined") index = this._columnContextMap.length;

    this._columnContextMap.splice(index, 0, {
        "contextInfo": contextInfo,
        "events": []
    });
};

Timeline.prototype.addEvent = function (event) {
    this._events.push(event);
    for (var start = event.getStart(); start <= event.getEnd(); start++)
        this._rowMap[start].push(event);
    this._columnContextMap[event.getColumn()].events.push(event);
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

    for (start; start <= end; start++)
        for (var i in this._rowMap[start])
            if (this._rowMap[start][i].getUUID() == eventUUID) {
                this._rowMap[start].splice(i, 1);
                break;
            }

    for (var i in this._columnContextMap[col].events)
        if (this._columnContextMap[col].events[i].getUUID() == eventUUID) {
            this._columnContextMap[col].events.splice(i, 1);
            break;
        }

};



Timeline.prototype.render = function () {

    $("#timelineTable thead").empty();
    $("#timelineTable tbody").empty();


    $("#timelineTable thead")
        .append($("<tr>").addClass("timeline-header")
            .append($("<th>").addClass("timeline-step-label")));

    createSteps(this._rowMap.length);

    this._columnContextMap.forEach(function (col) {
        addColumnForContextInfo(col.contextInfo);
    });

    var self = this;
    $("#timelineTable tbody tr.timeline-step").each(function(step){
        if (step == self._selectedStep)
            $(this).addClass("selected-step");
        else $(this).removeClass("selected-step");
    });
};

