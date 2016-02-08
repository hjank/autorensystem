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
var xFirstCellLeft, yFirstCellTop; // coordinates of start cell (in px)
var clickedCell, nextOccupiedCellTop;
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


/**
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
    var timeline = event.data.getTimeline();

    hideAllPopovers(timeline);

    if ($(event.target).hasClass("timeline-cell") && !$(event.target).hasClass("timeline-cell-occupied")) {
        down = true;

        yOnMousedown = event.pageY;
        xOnMousedown = event.pageX;
    }
    else if ($(event.target).hasClass("occupied-resize-handle")) {
        resizing = true;

        var contextEvent = timeline.getEventAt(getRowIDOfCell(this), getColIDOfCell(this));
        var eventStartCell = $(getContextEventCells(contextEvent)).first();
        xFirstCellLeft = $(eventStartCell).offset().left;
        yFirstCellTop = $(eventStartCell).offset().top;

        event.stopPropagation();
    }
    else return;

    clickedCell = this;
    nextOccupiedCellTop = null;
}

/**
 * If a cell has been clicked, all cells where the mouse is dragged over will be marked.
 *
 * @param event The mousemove event. Not restricted to cells because cursor may leave the table.
 * @private
 */
function _handleMousemove(event) {
    // prevent marking of label cells
    event.preventDefault();

    if (!down && !resizing) return;

    if (down) dragging = true;

    // mark targeted cells if creating or resizing an event
    _mark(event);
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
            $(event.target).addClass("timeline-cell-marked");

        if (! ($(event.target).offset().top <= $(clickedCell).offset().top))
            createNewContextEvent(simulation);
    }

    else if (resizing) {
        // only if resizing actually happened, i.e. mouse moved away above/below resize handle
        if (!$(event.target).hasClass("occupied-resize-handle")) {
            var markedCells = $(".timeline-cell-marked");
            $(clickedCell).empty();

            var timeline = simulation.getTimeline();
            var firstCell = $(markedCells).first();
            var contextEvent = timeline.getEventAt(getRowIDOfCell(firstCell), getColIDOfCell(firstCell));
            contextEvent.setEnd(getRowIDOfCell($(markedCells).last()));
            timeline.removeEvent(contextEvent);
            timeline.addEvent(contextEvent);
            contextEvent.render(simulation);
        }
        _unmarkAllCells();
    }

    down = false;
    dragging = false;
    resizing = false;

    $(".timeline-cell").css("cursor", "");
}


/**
 * Goes through all cells and marks those that were selected, restricted to the column clicked.
 *
 * @param event The mousemove or mouseup event (only triggered after mousedown on a cell).
 * @private
 */
function _mark(event) {

    var referenceX, referenceY, referenceBottomY;
    if (down) {
        referenceX = xOnMousedown;
        referenceY = yOnMousedown;
    }
    else if (resizing) {
        referenceX = xFirstCellLeft;
        referenceY = yFirstCellTop;
    }
    referenceBottomY = $(clickedCell).offset().top + $(clickedCell).height() + horizontalBorderPx;

    // if targeted cell is already occupied by another event, get its top Y coordinate
    if (event.pageY > referenceBottomY && $(event.target).hasClass("timeline-cell-occupied"))
        nextOccupiedCellTop = $(event.target).offset().top;

    // if the targeted cell lies above the start
    if (event.pageY < (down ? referenceY : referenceY+5) ||
        // or below the next occupied cell's top
        (nextOccupiedCellTop && event.pageY >= nextOccupiedCellTop)) {
        $(".timeline-cell").css("cursor", "no-drop");
        return;
    }
    else if (resizing)
        $(".timeline-cell").css("cursor", "s-resize");
    else
        $(".timeline-cell").css("cursor", "");


    $(".timeline-cell").each(function () {

        var top = $(this).offset().top;
        var bottom = top + $(this).height() + horizontalBorderPx;
        var left = $(this).offset().left;
        var right = left + $(this).width() + verticalBorderPx;

        // mark this cell if it lies in the correct column
        if(referenceX >= left && referenceX < right &&
            // and is not above start, i.e. marking will not surpass first cell
            bottom > referenceY && event.pageY >= top) {

            $(this).removeClass("timeline-cell-occupied");
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



function _unmarkAllCells() {
    $(".timeline-cell-marked").removeClass("timeline-cell-marked");
}

function _freeAllCells() {
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
    _unmarkAllCells();

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

    _freeAllCells();
}


function addOccupiedMarkup (contextEvent) {

    var cells = getContextEventCells(contextEvent);
    $(cells).empty().css("border-bottom", "");

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