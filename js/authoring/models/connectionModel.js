/**
 * Created by elis on 17.11.2015.
 */

function Connection() {

    this._ID = "";
    this._sourceId = "";
    this._targetId = "";
    this._label = "";
    this._title = "";

    return this;
}

Connection.prototype.with = function(id, sourceId, targetId, label, title) {
    this._ID = id;
    this._sourceId = sourceId;
    this._targetId = targetId;
    this._label = label;
    this._title = title;

    return this;
};

// getter
Connection.prototype.getID = function() {
    return this._ID;
};
Connection.prototype.getSourceId = function() {
    return this._sourceId;
};
Connection.prototype.getTargetId = function() {
    return this._targetId;
};
Connection.prototype.getLabel = function() {
    return this._label;
};
Connection.prototype.getTitle = function() {
    return this._title;
};

// setter
Connection.prototype.setID = function(id) {
    this._ID = id;
};
Connection.prototype.setSourceId = function(sourceId) {
    return this._sourceId = sourceId;
};
Connection.prototype.setTargetId = function(targetId) {
    return this._targetId = targetId;
};
Connection.prototype.setLabel = function(label) {
    return this._label = label;
};
Connection.prototype.setTitle = function(title) {
    return this._title = title;
};

// check if given unit is connected by this connection
Connection.prototype.connectsUnit = function(unitUUID) {
    return (this._sourceId == unitUUID || this._targetId == unitUUID);
};