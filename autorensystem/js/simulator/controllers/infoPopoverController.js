/**
 * Created by Helena on 13.03.2016.
 */




/**** simulator info popover and tooltips ****/

function activateInfoPopovers(simulation) {

    $("#simulatorInfo")
        .popover("destroy")
        .popover({
            container: "body",
            content: getSimulatorInfoText(simulation.getScenario()),
            html: true,
            placement: "left"
        });


    // activate timeline info popover
    $("#timelineInfo")
        .popover("destroy")
        .popover({
            container: "body",
            content: infoTexts.timeline,
            html: true,
            placement: "left"
        });


    $("#timelineInfo, #simulatorInfo")
        .off("shown.bs.popover")
        .on("shown.bs.popover", function (e) {
            var popoverElement = $(e.target).data("bs.popover").$tip;
            replaceActionVerbInTitle(popoverElement);
            addCloseXToPopoverTitle(popoverElement);

            extendSimulatorInfoPopover();
        });
}

function getSimulatorInfoText(scenario) {
    var scenarioName = (scenario.constructor == Scenario) ? scenario.getName() : "";
    var infoText = infoTexts.intro.replace("SCENARIO", scenarioName);
    var infoTextDiv = $("<div>").addClass("simulator-info-text").html(infoText);

    return infoTextDiv;
}

function extendSimulatorInfoPopover() {
    $(".simulator-info-text a#simulator-info-scenario").tooltip({
        container: "body",
        html: true,
        placement: "auto top",
        title: infoTexts.scenario
    });
    $(".simulator-info-text a#simulator-info-context").tooltip({
        container: "body",
        html: true,
        placement: "auto top",
        title: infoTexts.context
    });
}


function extendTimelineInfoPopover() {

}

// add "X" to popover (right corner) for closing
function addCloseXToPopoverTitle(popover) {
    var closeX = $('<a href="#" title="Schließen" class="popover-close">X</a>');
    $(popover).children("h3.popover-title").append(closeX);
}

// let popover title show only what popover displays, without action associated with opening it
function replaceActionVerbInTitle(popover) {
    var titleElement = $(popover).children("h3.popover-title");
    var titleText = $(titleElement).text();

    titleText = titleText.replace(" anzeigen", "");
    $(titleElement).text(titleText);
}
