/**
 * Created by Helena on 22.02.2016.
 */



function createNewPopover(contextEvent, simulation) {

    var markedCells = getContextEventCells(contextEvent);

    // create a context editor popover for each selected cell
    $(markedCells)
        .popover({
            container: "body",
            content: generatePopoverContent,
            html: true,
            placement: "auto top",
            selector: markedCells,
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

    $(markedCells).each(function (index, cell) {
        $(cell)
            .on("shown.bs.popover", function(event){
                reconstructPopoverContent(simulation, contextEvent);
                setPopoverEventHandlers(simulation, contextEvent);
                repositionPopover(this);
                $(".popover").find("*").tooltip();
            })
            .on("hide.bs.popover", function (event) {
                removePopoverMarkup();
                // remove all non-confirmed events
                removeTemporaryEvents(simulation.getTimeline());
            });
    });
}



/**
 * Generate the popover's title: the context info's name and an "X" for closing the popover.
 * @param contextInfo
 * @returns {string}
 */
function generatePopoverTitle (contextInfo) {
    var popoverTitle = $("<div>").append((translate_contextInformation(contextInfo.getID())));
    var closeX = $('<a href="#" title="Schließen ohne zu speichern" class="popover-close">X</a>').tooltip();
    popoverTitle.append(closeX);

    return popoverTitle;
}


/**
 * Generate the content of the newly created popover, i.e. value and parameter selection.
 * @param contextEvent
 */
function generatePopoverContent () {

    var simulatedContextInfoMenuElement = $("#popoverContentTemplate > div.popover-context-info");

    var popoverTemplate = $(simulatedContextInfoMenuElement).clone();
    $("#popoverContentTemplate").append(popoverTemplate);

    return simulatedContextInfoMenuElement;
}


function reconstructPopoverContent(simulation, contextEvent) {
    var contextInfo = contextEvent.getContextInfo();

    var simulatedValueInput = $(".popover div.popover-context-info > input.popover-value");
    var simulatedValueSelect = $(".popover div.popover-context-info > select.popover-value");
    var simulatedParameterDiv = $(".popover div.popover-context-info > div.popover-parameters");

    fillPopoverContextValue(contextInfo, simulation.getScenario(), simulatedValueInput, simulatedValueSelect);
    fillPopoverParameterSelection(contextInfo.getParameters(), simulatedParameterDiv);

    $(".popover select").select2();
}


function repositionPopover(cell) {
    var cellTop = $(cell).position().top;
    var cellBottom = cellTop + $(cell).height();
    var popoverHeight = $(".popover").height();
    var newPositionTop = cellTop - popoverHeight - 11;
    var newPositionBottom = cellBottom + popoverHeight + 11;

    var newPosition = "";
    if (newPositionTop > $("#tab5").offset().top)
        newPosition = newPositionTop;
    else if (newPositionBottom < $("#tab5").height()) {
        newPosition = cellBottom + 11;
        $(".popover .arrow").hide();
    }
    $(".popover").css("top", newPosition);
}


function setPopoverEventHandlers(simulation, contextEvent) {
    var timeline = simulation.getTimeline();

    $(".popover .popover-close").off("click").on("click", hideAllPopovers);

    $(".popover .popover-confirm").off("click").on("click", function(event){

        var contextInfoDiv = $(event.target).parents(".popover .popover-content .popover-context-info");

        if (!confirmPopoverContent(contextInfoDiv, contextEvent.getContextInfo(), simulation.getScenario())) {
            alert("Bitte geben Sie einen Wert und Parameter an.");
            return;
        }

        // remove old and add new class, plus style, informative tooltip, and clickable icons
        addOccupiedMarkup(contextEvent);

        // triggers "hide.bs.popover" event
        hideAllPopovers();
    });

    $(".popover .popover-delete").off("click").on("click", function(){
        hideAllPopovers();
        timeline.removeEvent(contextEvent);
        removeOccupiedMarkup(contextEvent);
    });
}





function hideAllPopovers() {

    // triggers "hide.bs.popover" event
    $(".popover").popover("hide");
}


function removeAllPopovers() {

    hideAllPopovers();

    $(".timeline-cell-occupied").popover("destroy");

    freeAllCells();
}



function removePopoverMarkup() {

    // "rescue" google maps from being removed
    $("#divMapsTemplate").append($("#divMaps"));
    // remove select2 markup
    $(".popover select").select2("destroy");

    $("#popoverContentTemplate > div.popover-context-info").not(":first").remove();
}