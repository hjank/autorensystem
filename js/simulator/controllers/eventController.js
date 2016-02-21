/**
 * Created by Helena on 11.01.2016.
 */


/**
 * 1. Change class of selected cells from marked to occupied.
 * 2. Create a popover for adding/editing/deleting a context "event"
 *
 */
function createNewContextEvent (simulation) {

    // keep track of selected cells
    var markedCells = $(".timeline-cell-marked");
    var numberOfMarkedCells = $(markedCells).length;

    if (numberOfMarkedCells == 0) return;

    // editor popover will be attached to first cell
    var startCell = $(markedCells).first();
    var firstStepID = getRowIDOfCell(startCell);
    var colID = getColIDOfCell(startCell);

    var timeline = simulation.getTimeline();
    var contextEvent = new ContextEvent(
        new ContextInformation().fromJSON(timeline.getColumnContext(colID)),
        colID,
        firstStepID,
        firstStepID + numberOfMarkedCells - 1,
        true
    );
    timeline.addEvent(contextEvent);

    createNewPopover(contextEvent, simulation);

    // editor popover will be attached to first cell
    $(startCell).popover("show");
}


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
                removePopoverEventListeners();
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

    $(".popover .popover-close").on("click", function(event){

        // closing popover without input + confirm, i.e. aborting event creation
        hideAllPopovers();
    });

    $(".popover .popover-confirm").on("click", function(event){

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

    $(".popover .popover-delete").on("click", function(event){
        hideAllPopovers();
        timeline.removeEvent(contextEvent);
        removeOccupiedMarkup(contextEvent);
    });
}

function removePopoverEventListeners() {
    $(".popover .popover-close").off("click");
    $(".popover .popover-confirm").off("click");
    $(".popover .popover-delete").off("click");
}

function getContextEventCells(contextEvent) {
    var cells = $();
    for (var step = contextEvent.getStart(); step <= contextEvent.getEnd(); step++)
        cells = cells.add($("#timelineTable").find(".timeline-step").eq(step)
            .children(".timeline-cell").eq(contextEvent.getColumn()));
    return cells;
}



function createContextEventDeleteDOM () {
    return $("<a>")
        .attr("href", "#")
        .addClass("fui-trash")
        .attr("title", "Löschen")
        .tooltip();
}

function createContextEventCopyDOM () {
    return $("<a>")
        .attr("href", "#")
        .addClass("fui-copy")
        .attr("title", "Duplizieren")
        .tooltip();
}

function createContextEventHideDOM () {
    return $("<a>")
        .attr("href", "#")
        .addClass("fui-eye-blocked")
        .attr("title", "Ausblenden")
        .on("mouseover", function (event) {
            $(this).parent().tooltip("hide");
        })
        .tooltip({container: "body"});
}