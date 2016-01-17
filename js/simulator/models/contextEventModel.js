/**
 * Created by Helena on 15.01.2016.
 */


function ContextEvent () {
    this._uuid = "event"+uuid4();
    this._simulation = {};
    this._contextInfo = {};
    this._column = 0;
    this._start = 0;
    this._end = 0;
    this._visibility = true;

    return this;
}

ContextEvent.prototype.getUUID = function () {
    return this._uuid;
};
ContextEvent.prototype.getSimulation = function () {
    return this._simulation;
};
ContextEvent.prototype.getContextInfo = function () {
    return this._contextInfo;
};
ContextEvent.prototype.getColumn = function () {
    return this._column;
};
ContextEvent.prototype.getStart = function () {
    return this._start;
};
ContextEvent.prototype.getEnd = function () {
    return this._end;
};
ContextEvent.prototype.getVisibility = function () {
    return this._visibility;
};

ContextEvent.prototype.setUUID = function (uuid) {
    this._uuid = uuid;
};
ContextEvent.prototype.setSimulation = function (simulation) {
    this._simulation = simulation;
};
ContextEvent.prototype.setContextInfo = function (contextInfo) {
    this._contextInfo = contextInfo;
};
ContextEvent.prototype.setColumn = function (column) {
    this._column = column;
};
ContextEvent.prototype.setStart = function (start) {
    this._start = start;
};
ContextEvent.prototype.setEnd = function (end) {
    this._end = end;
};
ContextEvent.prototype.setVisibility = function (visibility) {
    this._visibility = visibility;
};

ContextEvent.prototype.getCopy = function () {
    var newEvent = new ContextEvent();
    newEvent.setContextInfo(this._contextInfo);
    newEvent.setStart(this._start);
    newEvent.setEnd(this._end);
    newEvent.setSimulation(this._simulation);
    newEvent.setVisibility(this._visibility);

    return newEvent;
};