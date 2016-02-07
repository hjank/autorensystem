/**
 * Created by Helena on 29.12.2015.
 *
 * Adding of events inspired by:
 * http://stackoverflow.com/questions/10591747/making-a-google-calendar-like-dragging-interface
 *
 */

var numberOfSteps = 100;
var down, dragging, resizing, moving; // Boolean: mouse down?, mouse down and moving?
var xOnMousedown, yOnMousedown; // click coordinates (in px)
var xFirstCellLeft, yFirstCellTop; //  coordinates of clicked cell (in px)
var horizontalBorderPx = 2; // a marked cell's top and bottom border sum in px
var verticalBorderPx = 4;  // a marked cell's left and right border sum in px


/**
 * Initialize timeline
 */
function initTimeline(simulation) {

    simulation.initTimeline(numberOfSteps);

    simulation.renderTimeline();

    // set event handlers for these generated cells
    setCellEventHandlers(simulation);
}




/*********** view **********/


function clearTable() {
    $("#timelineTable thead").empty();
    $("#timelineTable tbody").empty();
}

function createHeader() {
    $("#timelineTable thead")
        .append($("<tr>").addClass("timeline-header")
            .append($("<th>").addClass("timeline-step-label")));
}

function createSteps(steps) {
    var timelineBodyElement = $("#timelineTable > tbody");

    for (var i = 1; i <= steps; i++)
        $(timelineBodyElement)
            .append($("<tr>").addClass("timeline-step")
                .append($("<td>").addClass("timeline-step-label")
                    .html(i.toString())
                    .attr("title", "Schritt " + i.toString())
            ));
}

function createColumn(contextInfo) {

    $(".timeline-header").append($("<th>")
        .html(formatUnitIcons(contextInfo))
        .tooltip({
            container: "#tab5",
            placement: "auto left",
            viewport: "#timelineContainer"
        }));

    // add one column for each context item
    $(".timeline-step").each(function() {
        $(this).append($("<td>")
                .addClass("timeline-cell")
                .attr("contextClass", contextInfo.getClasses()[0])
                .tooltip({
                    container: "#tab5",
                    placement: "auto top",
                    title: translate_contextInformation(contextInfo.getID()) + " hat keinen Wert",
                    viewport: "#timelineContainer"
                })
        );
    });
}


function highlightSelectedStep(selectedStep) {
    $("#timelineTable tbody tr.timeline-step").each(function(step){
        if (step == selectedStep)
            $(this).addClass("selected-step");
        else $(this).removeClass("selected-step");
    });
}


/********** event handling **********/


/** *
 * Sets handlers for mouse events on table cells and on document, consequently
 */
function setCellEventHandlers(simulation) {

    $(document).on("mousedown", ".timeline-cell", simulation, _handleMousedown);
    $(document).on("mousemove", _handleMousemove);
    $(document).on("mouseup", null, simulation, _handleMouseup);
}


/**
 * Triggered if the user clicks on a cell: sets down to true and records click coordinates.
 *
 * @param event
 * @private
 */
function _handleMousedown(event) {

    hideAllPopovers(event.data.getTimeline());


    if ($(event.target).hasClass("occupied-resize-handle"))
        resizing = true;

    else if ($(event.target).hasClass("timeline-cell") && !$(event.target).hasClass("timeline-cell-occupied"))
        down = true;

    else return;

    yOnMousedown = event.pageY;
    xOnMousedown = event.pageX;
    xFirstCellLeft = $(this).offset().left;
    yFirstCellTop = $(this).offset().top;
}

/**
 * If a cell has been clicked, all cells where the mouse is dragged over will be marked.
 *
 * @param event The mousemove event. Not restricted to cells because cursor may leave the table.
 * @private
 */
function _handleMousemove(event) {
    event.preventDefault();

    if (down || resizing) {
        dragging = true;
        _mark(event);
    }
}

/**
 * When down stops: create a new DIV where cells have been marked and attach context CRUD functionality.
 *
 * @param event The mouseup event. Can occur anywhere in the document.
 * @private
 */
function _handleMouseup(event) {
    var simulation = event.data;

    // if the mouse has been down on an empty cell
    if (down) {
        // if a single cell was clicked, without dragging, mark it (for subsequent access)
        if (!dragging)
            _mark(event);

        createNewContextEvent(simulation);
    }

    if (resizing) {
        var timeline = simulation.getTimeline();

        var markedCells = $(".timeline-cell-marked");
        console.log("resized by: " + markedCells.length);
        var firstCell = $(markedCells).first();

        var contextEvent = timeline.getEventAt(getRowIDOfCell(firstCell), getColIDOfCell(firstCell));
        contextEvent.setEnd(getRowIDOfCell($(markedCells).last()));
        timeline.removeEvent(contextEvent);
        timeline.addEvent(contextEvent);
        contextEvent.render(simulation);
    }

    down = false;
    dragging = false;
    resizing = false;
}


/**
 * Goes through all cells and marks those that were selected, restricted to the column clicked.
 *
 * @param event The mousemove or mouseup event (only triggered after mousedown on a cell).
 * @private
 */
function _mark(event) {

    $(".timeline-cell").each(function () {
        var top = $(this).offset().top;
        var bottom = top + $(this).height()+horizontalBorderPx;
        var left = $(this).offset().left;
        var right = left + $(this).width()+verticalBorderPx;

        if( bottom > yOnMousedown && event.pageY >= top && xOnMousedown >= left && xOnMousedown < right) {
            $(this).addClass( "timeline-cell-marked" );
        }
        else
            $(this).removeClass( "timeline-cell-marked" );
    });
}


function getColIDOfCell(cell) {
    return $(cell).parent().children(".timeline-cell").index(cell);
}

function getRowIDOfCell(cell) {
    return $(cell).parent().index();
}



function unmarkAllCells() {
    $(".timeline-cell-marked").removeClass("timeline-cell-marked");
}

function freeAllCells() {
    $(".timeline-cell-occupied").removeClass(".timeline-cell-occupied");
}


function hideAllPopovers(timeline) {

    removeEventMarkup();
    removePopoverEventListeners();

    // triggers "hide.bs.popover" event handled by removing all markup
    $(".popover").hide();

    // remove all non-confirmed events
    removeTemporaryEvents(timeline);
}


function removeEventMarkup() {
    // rescue google maps
    $("#divMapsTemplate").append($("#divMaps"));
    // remove select2 markup
    $(".popover select").select2("destroy");
    // remove class "timeline-cell-marked" from all cells
    unmarkAllCells();

    $("#popoverContentTemplate > div.popover-context-info").not(":first").remove();
}


function removeTemporaryEvents(timeline) {

    // remove all non-confirmed events
    var markedCells = $(".timeline-cell-marked");
    if ($(markedCells).length != 0) {
        var startCell = $(markedCells).first();

        var contextEvent = timeline.getEventAt(getRowIDOfCell(startCell), getColIDOfCell(startCell));
        timeline.removeEvent(contextEvent);

        $(markedCells).popover("destroy");
    }
}


function removeAllPopovers(timeline) {

    hideAllPopovers(timeline);

    $(".timeline-cell-occupied").popover("destroy");

    freeAllCells();
}



function addOccupiedMarkup (contextEvent) {

    var cells = getContextEventCells(contextEvent);
    $(cells).empty();

    var firstCell = $(cells).first();
    firstCell.css("border-top", "1px solid")
        .append($("<a>").attr("href","#").addClass("fui-gear")
        .on("click", function(event) {
            firstCell.popover("show");
        })
    );
    $(cells).addClass("timeline-cell-occupied");

    $(cells).last().css("border-bottom", "1px solid")
        .append($("<div>").addClass("occupied-resize-handle"));
}


function addToolTip (contextEvent) {

    var cells = getContextEventCells(contextEvent);

    var contextInfo = contextEvent.getContextInfo();
    var chosenValue = contextInfo.getChosenValue();
    if (expectsLearningUnit(contextInfo)) chosenValue = authorSystemContent.getUnitByUUID(chosenValue).getName();

    var contextInfoValues = translate_contextInformation(contextInfo.getID()) + " ist " +
        translate_possibleValue(chosenValue) + "<br><br>";
    contextInfo.getParameters().forEach(function (param) {
        contextInfoValues += translate_parameter(param.getID()) + ": ";
        contextInfoValues += translate_parameterValue(param.getChosenValue()) + "<br>";
    });

    $(cells).tooltip("destroy");
    $(cells).tooltip({
        container: "#tab5",
        html: true,
        title: contextInfoValues,
        viewport: "#timelineContainer"
    });
}