/**
 * Created by Helena on 15.01.2016.
 */


function Timeline (matrix, contextMap, selectedStep) {

    this._eventMatrix = matrix || [];
    this._columnContextMap = contextMap || [];
    this._selectedStep = (typeof selectedStep != "undefined") ? selectedStep : 0;

    return this;
}


Timeline.prototype.getAllEvents = function() {
    var colEvents = [];
    return this._eventMatrix.map(function (row) {
        colEvents = colEvents.concat(row);
    });
};
Timeline.prototype.getStepEvents = function(start, end) {
    // default: return events of *one* step only
    if (!end) end = start;
    return this._eventMatrix.slice(start, end+1);
};
Timeline.prototype.getSelectedStepEvents = function () {
    return this._eventMatrix[this._selectedStep];
};
Timeline.prototype.getColumnEvents = function(start, end) {
    // default: return events of *one* column only
    if (!end) end = start;
    var colEvents = [];
    return this._eventMatrix.map(function (row) {
        colEvents = colEvents.concat(row.slice(start, end+1));
    });
};
Timeline.prototype.getColumnContext = function(col) {
    return this._columnContextMap[col];
};
Timeline.prototype.getSelectedStep = function () {
    return this._selectedStep;
};
Timeline.prototype.getEventAt = function(row, col) {
    return this._eventMatrix[row][col];
};
Timeline.prototype.getEventByUUID = function(eventUUID) {
    for (var rowID in this._eventMatrix)
        for (var colID in this._eventMatrix[rowID])
            if (this._eventMatrix[rowID][colID].getUUID() == eventUUID)
                return this._eventMatrix[rowID][colID];
};


Timeline.prototype.setEventMatrix = function (matrix) {
    this._eventMatrix = matrix;
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



Timeline.prototype.addStep = function () {
    this._eventMatrix.push(new Array(this._columnContextMap.length)
        .fill({})
    );
};

Timeline.prototype.addColumn = function(contextInfo, index) {
    this._addColumnToMatrix(index);
    this._addContextColumn(contextInfo, index);
};
Timeline.prototype._addColumnToMatrix = function (index) {
    this._eventMatrix.forEach(function(row){
        if (typeof index != "undefined") row.splice(index, 0, {});
        else row.push({});
    });
};
Timeline.prototype._addContextColumn = function(contextInfo, index) {
    if (typeof index != "undefined") this._columnContextMap.splice(index, 0, contextInfo);
    else this._columnContextMap.push(contextInfo);
};

Timeline.prototype.addEvent = function (event) {
    this.getStepEvents(event.getStart(), event.getEnd()).forEach(function(step){
        step[event.getColumn()] = event;
    })
};

Timeline.prototype.removeEvent = function (eventUUID) {
    if (typeof eventUUID == "object" && eventUUID.constructor == ContextEvent)
        eventUUID = eventUUID.getUUID();

    this._eventMatrix.forEach(function(row){
        for (var i in row) {
            if (row[i].constructor == ContextEvent && row[i].getUUID() == eventUUID)
                row[i] = {};
        }
    });
};


Timeline.prototype.render = function (callback, arg) {
    (typeof callback == "function" && callback(this, arg));
};