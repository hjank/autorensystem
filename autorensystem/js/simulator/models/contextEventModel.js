/**
 * Created by Helena on 15.01.2016.
 */


function ContextEvent (uuid, contextInfo, column, start, end, visible) {
    this._uuid = uuid || "event"+uuid4();
    this._contextInfo = contextInfo || {};
    this._column = (typeof column  == "undefined") ? 0 : column;
    this._start = (typeof start  == "undefined") ? 0 : start;
    this._end = (typeof end  == "undefined") ? this._start : end;
    this._visible = (typeof visible == "undefined") ? true : visible;

    return this;
}

ContextEvent.prototype.getUUID = function () {
    return this._uuid;
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
ContextEvent.prototype.isVisible = function () {
    return this._visible;
};

ContextEvent.prototype.setUUID = function (uuid) {
    this._uuid = uuid;
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
    return new ContextEvent("event"+uuid4(), this._contextInfo, this._column, this._start, this._end, this._visible);
};





ContextEvent.prototype.render = function (simulation) {
    createNewPopover(this, simulation);
    addOccupiedMarkup(this, simulation);
};



ContextEvent.deserialize = function (json) {
    return new ContextEvent(
        json._uuid,
        new ContextInformation().fromJSON(json._contextInfo),
        json._column,
        json._start,
        json._end,
        json._visible
    );
};
