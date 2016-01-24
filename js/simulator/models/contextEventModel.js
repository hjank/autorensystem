/**
 * Created by Helena on 15.01.2016.
 */


function ContextEvent (contextInfo, column, start, end, visible) {
    this._uuid = "event"+uuid4();
    this._contextInfo = contextInfo || {};
    this._column = column || 0;
    this._start = start || 0;
    this._end = end || 0;
    this._visible = (typeof visible == "undefined") ? true : visible;

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
    return this._visible;
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
ContextEvent.prototype.setVisibility = function (visible) {
    this._visible = visible;
};

ContextEvent.prototype.getCopy = function () {
    return new ContextEvent(this._simulation, this._contextInfo, this._column, this._start, this._end, this._visible);
};

ContextEvent.prototype.render = function (callback) {
    (typeof callback == "function" && callback(this));
};