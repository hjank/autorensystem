/**
 * Created by Helena on 15.01.2016.
 */

const RUNNING = 0, PAUSED = 1, STOPPED = 2;

function Simulation (title, descr, scenario, contextList, timeline, speed) {

    this._title = title || "Unbenannt";
    this._description = descr || "";

    this._scenario = scenario || {};
    this._simulatedContextList = contextList || new ContextInfoList();

    this._timeline = timeline || new Timeline();

    this._playBackSpeed = speed || 1000; // default speed = 3 seconds per step
    this._status = STOPPED;

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
Simulation.prototype.getScenario = function () {
    return this._scenario;
};
Simulation.prototype.getSimulatedContextList = function () {
    return this._simulatedContextList;
};
Simulation.prototype.getTimeline = function() {
    return this._timeline;
};
Simulation.prototype.getPlayBackSpeed = function () {
    return this._playBackSpeed;
};
Simulation.prototype.getStatus = function () {
    return this._status;
};
Simulation.prototype.getAdaptationEngine = function () {
    return this._adaptationEngine;
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
    // add the new item
    this._simulatedContextList.addItem(contextInfo);
    // sort the list
    this._simulatedContextList.setItems(this._simulatedContextList.getContextItemsSortedByClass());

    // get the new item's position in the sorted list
    var index = this._simulatedContextList.getIndexByID(contextInfo.getID());
    // add it to timeline columns accordingly
    this._timeline.addColumn(contextInfo, index);

};

Simulation.prototype.initTimeline = function (steps) {
    // start from tabula rasa
    if (this._timeline.getEvents().length != 0) this._timeline.setEvents([]);
    if (this._timeline.getNumberOfColumns != 0) this._timeline.setColumnContextMap([]);
    if (this._timeline.getNumberOfRows != 0) this._timeline.setRowMap([]);

    var self = this;
    this._simulatedContextList.getItems().forEach(function (item) {
        self._timeline.addColumn(item);
    });
    for (var i = 1; i <= steps; i++)
        this._timeline.addStep();
};

Simulation.prototype.renderTimeline = function () {
    this._timeline.render(this);
};


Simulation.prototype.start = function () {

    /* TODO: 1. export(...); // generate rules
       TODO: 2. get rules from wherever they get exported to
     */

    var self = this;

    require(['js/motivate-adaptationengine/scripts/config'], function() {
         require(['MoAE'], function(AdaptationEngine) {
             console.log("ready to rumble!");

             $.ajax({
                 url: "js/motivate-adaptationengine/nodeRules.js",
                 dataType: "script",
                 success: function (rules) {

                     self._adaptationEngine = new AdaptationEngine(rules, false);
                     self._adaptationEngine.setSelectLearningUnitCallback(lightboxUnit);

                 /*        function (id, contextInformation) {
                             for (var index in contextInformation) {
                                 console.log(contextInformation[index]);
                             }

                             lightboxUnit(id);
                         }
                     );
*/
                     self.run();
                 }
             });
         });
    });
};


Simulation.prototype.run = function () {
    this._status = RUNNING;

    this._run(this);
    this._iteration = setInterval(this._run, this._playBackSpeed, this);
};

Simulation.prototype._run = function (self) {

    highlightSelectedStep(self._timeline);

    self._timeline.getSelectedStepEvents().forEach( function(colEntry) {
        if ( colEntry.constructor == ContextEvent && colEntry.isVisible() ) {
            var contextInfo = colEntry.getContextInfo();
            var contextInfoParameters = [];
            contextInfo.getParameters().forEach(function (parameter) {
                contextInfoParameters.push([
                    parameter.getID(),
                    parameter.getType(),
                    (parameter.getChosenValue() || "NO_VALUE")
                ]);
            });

            self._adaptationEngine.addContextInformation({
                name: contextInfo.getID(),
                type: contextInfo.getType(),
                parameterList: contextInfoParameters,
                value: contextInfo.getChosenValue() || "NO_VALUE"
            }, contextInfo.getMultiplicity());
        }
    });

    // adapt and apply callbacks
    self._adaptationEngine.startRuleMatching(0);
    // stop immediately after because of internal interval
    self._adaptationEngine.stopRuleMatching();


    // go to next simulation step if there is one left
    if (!self._timeline.incrementSelectedStep()) {
        self.stop();
    }
};

Simulation.prototype.pause = function () {
    clearInterval(this._iteration);
    this._status = PAUSED;
};

Simulation.prototype.stop = function () {
    clearInterval(this._iteration);
    this._status = STOPPED;
    this._timeline.setSelectedStep(0);

    resetPlaybackButton();
};