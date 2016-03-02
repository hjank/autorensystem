/**
 * Created by Helena on 15.01.2016.
 */

const RUNNING = 0, PAUSED = 1, STOPPED = 2;

function Simulation (title, descr, scenario, contextList, timeline, speed) {

    this._title = title || "Leere Vorlage";
    this._description = descr || "";

    this._scenario = scenario || {};
    this._simulatedContextList = contextList || new ContextInfoList();

    this._timeline = timeline || new Timeline();

    this._playBackSpeed = speed || 1000; // default speed = 3 seconds per step
    this._status = STOPPED;

    this._iteration = null;
    this._adaptationEngine = {};


    // add default context info: finished learning unit (necessary for simulation)
    this._initContextInfoList();

    return this;
}

Simulation.prototype._initContextInfoList = function () {
    if (!contextList) {
        console.log("ERROR: contextList has not been initialized yet!");
        return;
    }
    // default entry
    var finishedLearningUnitContextInfo = contextList.getItemByID("CI_FINISHED_LEARNING_UNIT");
    if (!finishedLearningUnitContextInfo) {
        console.log("ERROR: There is no context information with ID 'CI_FINISHED_LEARNING_UNIT'!");
        return;
    }

    this._simulatedContextList.addItem(new ContextInformation().fromJSON(finishedLearningUnitContextInfo));
    this._simulatedContextList.resetAllContextValues();
};

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

    this._status = RUNNING;

    var self = this;

    exportScenario(function (rules) {

        require(['js/simulator/motivate-adaptationengine/scripts/config'], function() {
            // main defines jQuery reference
            // (see: http://stackoverflow.com/questions/23023167/requirejs-backbone-1-1-2-local-jquery-interfering-with-global-jquery?rq=1)
            require(['MoAE', 'main'], function(AdaptationEngine) {
                console.log("ready to rumble!");

                self._adaptationEngine = new AdaptationEngine($.globalEval(rules), false);
                self._adaptationEngine.setSelectLearningUnitCallback(lightboxUnit);

                /*  function (id, contextInformation) {
                 for (var index in contextInformation) {
                 console.log(contextInformation[index]);
                 }

                 lightboxUnit(id);
                 }
                 );
                 */

                self.run();
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

    // stop if the end of the timeline is reached
    if (self._timeline.getSelectedStep() == self._timeline.getNumberOfRows())
        self.stop();

    else {
        highlightSelectedStep(self);

        self._timeline.getSelectedStepEvents().forEach( function(colEntry) {
            if ( colEntry.constructor == ContextEvent && colEntry.isVisible() ) {
                var contextInfo = colEntry.getContextInfo();
                var contextInfoParameters = [];
                contextInfo.getParameters().forEach(function (parameter) {
                    contextInfoParameters.push([
                        parameter.getID(),
                        parameter.getType(),
                        (parameter.getChosenValue() || "CV_UNKNOWN")
                    ]);
                });

                self._adaptationEngine.addContextInformation({
                    name: contextInfo.getID(),
                    type: contextInfo.getType(),
                    parameterList: contextInfoParameters,
                    value: contextInfo.getChosenValue() || "CV_UNKNOWN"
                }, contextInfo.hasMultiplicity());
            }
        });

        // adapt and apply callbacks
        self._adaptationEngine.startRuleMatching(0);
        // stop immediately after because of internal interval
        self._adaptationEngine.stopRuleMatching();


        // go to next simulation step
        self._timeline.incrementSelectedStep();
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
    highlightSelectedStep(this);
};