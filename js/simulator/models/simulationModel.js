/**
 * Created by Helena on 15.01.2016.
 */


function Simulation () {

    this._title = "Unbenannt";
    this._description = "";

    this._scenario = {};
    this._simulatedContextList = new ContextInfoList();

    this._timeline = {};

    this._playBackSpeed = 3000; // default speed = 3 seconds per step
    this._iteration = null;
    this._adaptationEngine = {};

    return this;
}

Simulation.prototype.getTitle = function () {
    return this._title;
};
Simulation.prototype.getDescription = function () {
    return this._description;
};
Simulation.prototype.getPlayBackSpeed = function () {
    return this._playBackSpeed;
};
Simulation.prototype.getStatus = function () {
    return this._playBackSpeed;
};
Simulation.prototype.getScenario = function () {
    return this._scenario;
};
Simulation.prototype.getSimulatedContextList = function () {
    return this._simulatedContextList;
};
Simulation.prototype.getTimeline = function() {
    return this._timeline;
};

Simulation.prototype.setTitle = function (title) {
    this._title = title;
};
Simulation.prototype.setDescription = function (description) {
    this._description = description;
};
Simulation.prototype.setPlayBackSpeed = function (speed) {
    this._playBackSpeed = speed;
};
Simulation.prototype.setScenario = function (scenario) {
    this._scenario = scenario;
};
Simulation.prototype.setTimeline = function (timeline) {
    this._timeline = timeline;
};

Simulation.prototype.addContextItem = function (contextInfo) {
    this._simulatedContextList.addItem(contextInfo);
    this._timeline.addColumn(contextInfo);
};





Simulation.prototype.start = function (timelineCallback, canvasCallback) {

    this._timeline.setSelectedStep(0);

    /* TODO: 1. export(...); // generate rules
       TODO: 2. include AE and $.get(...) rules (see there)
       TODO: !!important!! ContextInformation will have to be renamed --> conflicting with contactJS!
     */

    this._adaptationEngine = new AdaptationEngine(rules, true);

    this._adaptationEngine.setSelectLearningUnitCallback(function(id, contextInformation) {
        console.log("<select id='"+id+"'>");
        for(var index in contextInformation) {
            console.log(contextInformation[index]);
        }
        console.log("</select>");

        // TODO: Highlight unit with selected ID!
        canvasCallback(id);
    });

    this.run(timelineCallback);

};

Simulation.prototype.run = function (timelineCallback) {

    this._run(timelineCallback);
    this._iteration = setInterval(function() { this._run(timelineCallback); }, this._playBackSpeed);
};

Simulation.prototype._run = function (timelineCallback) {

    // TODO: mark or highlight selected step in timeline
    timelineCallback(this._timeline.getSelectedStep());

    this._timeline.getSelectedStepEvents().forEach( function(colEntry) {
        if ( colEntry.constructor == ContextEvent && colEntry.isVisible() ) {
            var contextInfo = colEntry.getContextInfo();
            var contextInfoParameters = [];
            contextInfo.getParameters().forEach(function (parameter) {
                contextInfoParameters.push([parameter.getID(), parameter.getType(), parameter.getChosenValue()]);
            });

            this._adaptationEngine.addContextInformation({
                name: contextInfo.getID(),
                type: contextInfo.getType(),
                parameterList: contextInfoParameters,
                value: contextInfo.getChosenValue()
            }, contextInfo.getMultiplicity());
        }
    });

    // adapt and apply callbacks
    this._adaptationEngine.startRuleMatching(this._playBackSpeed);
    // stop immediately after because of internal interval
    this._adaptationEngine.stopRuleMatching();

    // go to next simulation step
    this._timeline.incrementSelectedStep();
};


Simulation.prototype.stop = function (callback) {
    clearInterval(this._iteration);
};