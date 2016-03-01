/**
 * Created by Helena on 22.02.2016.
 */



function createNewPopover(contextEvent, simulation) {

    var contextEventCells = getContextEventCells(contextEvent);

    // create a context editor popover for each selected cell
    $(contextEventCells)
        .popover({
            container: "body",
            content: generatePopoverContent,
            html: true,
            placement: "bottom",
            selector: contextEventCells,
            template: '<div class="popover" role="tooltip">' +
            '<div class="arrow"></div>' +
            '<h3 class="popover-title"></h3>' +
            '<div class="popover-content"></div>' +
            '</div>',
            title: generatePopoverTitle(contextEvent.getContextInfo()),
            trigger: "manual",
            viewport: "#timelineContainer"
        })
        .tooltip("destroy");

    $(contextEventCells)
        .off("shown.bs.popover").on("shown.bs.popover", function(){
            reconstructPopoverContent(simulation, contextEvent);
            setPopoverEventHandlers(simulation, contextEvent);
            repositionPopover(this);
        })
        .off("hide.bs.popover").on("hide.bs.popover", function (e) {
            removePopoverMarkup();
            // remove all non-confirmed events
            removeTemporaryEvents(simulation.getTimeline());
        });

}



/**
 * Generate the popover's title: the context info's name and an "X" for closing the popover.
 * @param contextInfo
 * @returns {string}
 */
function generatePopoverTitle (contextInfo) {
    var popoverTitle = $("<div>").append((translate_contextInformation(contextInfo.getID())));
    var closeX = $('<a href="#" title="Schließen ohne zu speichern" class="popover-close">X</a>');
    popoverTitle.append(closeX);

    return popoverTitle;
}


/**
 * Generate the content of the newly created popover, i.e. value and parameter selection.
 */
function generatePopoverContent () {

    var simulatedContextInfoMenuElement = $("#popoverContentTemplate > div.popover-context-info");
    return $(simulatedContextInfoMenuElement).clone();
}


function reconstructPopoverContent(simulation, contextEvent) {
    var contextInfo = contextEvent.getContextInfo();

    var simulatedValueInput = $(".popover div.popover-context-info > input.popover-value");
    var simulatedValueSelect = $(".popover div.popover-context-info > select.popover-value");
    var simulatedParameterDiv = $(".popover div.popover-context-info > div.popover-parameters");

    fillPopoverContextValue(contextInfo, simulation.getScenario(), simulatedValueInput, simulatedValueSelect);
    fillPopoverParameterSelection(contextInfo.getParameters(), simulatedParameterDiv);

    $(".popover select").select2();
    $(".popover").find("*").tooltip();
}


function repositionPopover(cell) {
    var popover = $(cell).data("bs.popover").$tip;
    var cellBottom = getBottom(cell);

    var containerBottom = getBottom($("#simulatorContainer"));

    var timelineWindow = $("#timelineTableWindow");
    var timelineScrollTop = $(timelineWindow).scrollTop();

    if (getBottom(popover) > containerBottom) {
        // reposition the popover to window bottom
        $(popover).css("top", "initial");
        $(popover).css("bottom", "0px");

        // scroll the timeline so that selected cell remains visible
        $(timelineWindow).animate({scrollTop: (timelineScrollTop + cellBottom - getTop(popover))}, 500);
    }
}


function setPopoverEventHandlers(simulation, contextEvent) {
    var timeline = simulation.getTimeline();

    $(".popover .popover-close").off("click").on("click", hideAllPopovers);

    $(".popover .popover-confirm").off("click").on("click", function(e){

        var contextInfoDiv = $(e.target).parents(".popover .popover-content .popover-context-info");
        var contextInfo = contextEvent.getContextInfo();

        if (!confirmPopoverContent(contextInfoDiv, contextInfo, simulation.getScenario())) {
            alert("Bitte geben Sie einen Wert und Parameter an.");
            return;
        }

        updateEventTimeslot(contextEvent, timeline);

        // remove old and add new class, plus style, informative tooltip, and clickable icons
        addOccupiedMarkup(contextEvent, simulation);

        // triggers "hide.bs.popover" event
        hideAllPopovers();

        // refresh timeline
        simulation.renderTimeline();
    });

    $(".popover .popover-delete").off("click").on("click", function(){
        deleteContextEvent(contextEvent, timeline);
    });
}





function hideAllPopovers() {
    // triggers "hide.bs.popover" event
    $(".popover").popover("hide");
}


function removeAllPopovers() {

    hideAllPopovers();
    $(".timeline-cell-occupied").popover("destroy");
}



function removePopoverMarkup() {

    // "rescue" google maps from being removed
    $("#divMapsTemplate").append($("#divMaps"));
    // remove select2 markup
    $(".popover select").select2("destroy");

    $("#popoverContentTemplate > div.popover-context-info").not(":first").remove();
}