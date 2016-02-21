/**
 * Created by Helena on 29.12.2015.
 *
 * Adding of events inspired by:
 * http://stackoverflow.com/questions/10591747/making-a-google-calendar-like-dragging-interface
 *
 */

var down, dragging, resizing, moving; // Boolean: mouse down?, mouse down and moving?
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
                    .attr("title", "Situation " + i.toString())
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


function highlightSelectedStep(timeline) {

    $("#timelineTable tbody tr.timeline-step").each(function(step){
        if (step == timeline.getSelectedStep())
            $(this).addClass("selected-step");
        else $(this).removeClass("selected-step");
    });
}


/********** event handling **********/


/**
 * Sets handlers for mouse events on table cells and on document, consequently
 */
var set = false;
function setCellEventHandlers(simulation) {

    if (set) return;

    $(document).on("mousedown", ".timeline-cell", simulation, _handleMousedown);
    $(document).on("mousemove", _handleMousemove);
    $(document).on("mouseup", null, simulation, _handleMouseup);

    $(document).on("click", "td.timeline-step-label", simulation, _handleLabelClick);

    $(document).on("mouseenter", ".timeline-header th:not(.timeline-step-label)", null, _handleColumnHeaderEnter);
    $(document).on("mouseleave", ".timeline-header th:not(.timeline-step-label)", null, _handleColumnHeaderLeave);
    $(document).on("click", ".timeline-header th .caret", null, _handleColumnHeaderClick);

    set = true;
}




/**
 * Triggered if the user clicks on a cell: sets down to true and records click coordinates.
 *
 * @param event
 * @private
 */
function _handleMousedown(event) {
    var timeline = event.data.getTimeline();

    hideAllPopovers();

    if ($(event.target).hasClass("timeline-cell") && !$(event.target).hasClass("timeline-cell-occupied")) {
        down = true;
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
            _mark(event);

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



function _handleLabelClick(event) {
    var timeline = event.data.getTimeline();

    timeline.setSelectedStep(getRowIDOfCell(this));
    highlightSelectedStep(timeline);

    event.stopPropagation();
}

function _handleColumnHeaderEnter(event) {
    $(event.target).css("border", "1px solid grey").append("<b class='caret'/>");
    var colIndex = $(this).parent().children().not(".timeline-step-label").index(event.target);

    getColumnCells(colIndex).css({"background-image": "repeating-linear-gradient(rgba(0,0,0,.3), rgba(0,0,0,.3))"});

  /*  $(".timeline-step").each(function (index, step) {
        $(step).children(".timeline-cell").eq(colIndex).not(".timeline-cell-occupied")
            .css({
                "background-image": "repeating-linear-gradient(rgba(0,0,0,.3), rgba(0,0,0,.3))"
            });
    });*/
}

function _handleColumnHeaderLeave(event) {
    $(event.target).css("border", "").children("b").remove();
    $(".timeline-cell").css("background-image", "");
}


function _handleColumnHeaderClick(event) {

}

function getColumnCells(colIndex) {
    var cells = $();
    $(".timeline-step").each(function (index, step) {
        cells = cells.add($(step).children(".timeline-cell").eq(colIndex))
    });
    return cells;
}


/**
 * Goes through all cells and marks those that were selected, restricted to the column clicked.
 *
 * @param event The mousemove or mouseup event (only triggered after mousedown on a cell).
 * @private
 */
function _mark(event) {

    // tiny little helper function (sole purpose: readability)
    var getBottom = function (cell) {
        return $(cell).offset().top + $(cell).height() + horizontalBorderPx;
    };


    /*** get reference coordinates ***/

    var referenceX, referenceY, referenceBottomY;
    if (down) {
        referenceX = $(clickedCell).offset().left;
        referenceY = $(clickedCell).offset().top;
    }
    else if (resizing) {
        referenceX = xFirstCellLeft;
        referenceY = yFirstCellTop;
    }
    referenceBottomY = getBottom(clickedCell);

    // if targeted cell is already occupied by another event, get its top Y coordinate
    if (event.pageY > referenceBottomY && $(event.target).hasClass("timeline-cell-occupied"))
        nextOccupiedCellTop = $(event.target).offset().top;


    /*** cursor style and "error-30"-handling ***/

    // if the cursor was moved in a no-drop area (i.e. above drag start or below the next occupied cell's top)
    if (event.pageY < referenceY + verticalBorderPx || (nextOccupiedCellTop && event.pageY >= nextOccupiedCellTop)) {
        $(".timeline-cell").css("cursor", "no-drop");
        return;
    }
    else if (resizing)
        $(".timeline-cell").css("cursor", "s-resize");
    else
        $(".timeline-cell").css("cursor", "");


    /*** mark selected cells in selected column ***/

    $(".timeline-cell").each(function () {
        var top = $(this).offset().top;
        var bottom = getBottom(this);
        var left = $(this).offset().left;

        // mark this cell if it's in the correct column, below drag start, and the cursor has crossed its top
        if(referenceX == left && bottom > referenceY && event.pageY >= top) {
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
    $(".timeline-cell-occupied").empty()
        .removeClass(".timeline-cell-occupied");
}


function hideAllPopovers() {

    // triggers "hide.bs.popover" event
    $(".popover").popover("hide");
}


function removePopoverMarkup() {

    // "rescue" google maps from being removed
    $("#divMapsTemplate").append($("#divMaps"));
    // remove select2 markup
    $(".popover select").select2("destroy");

    $("#popoverContentTemplate > div.popover-context-info").not(":first").remove();
}


function removeTemporaryEvents(timeline) {

    // remove all non-confirmed events
    var markedCells = $(".timeline-cell-marked");

    if ($(markedCells).length != 0) {
        var startCell = $(markedCells).first();

        var contextEvent = timeline.getEventAt(getRowIDOfCell(startCell), getColIDOfCell(startCell));
        timeline.removeEvent(contextEvent);

        // remove class "timeline-cell-marked" from all cells
        _unmarkAllCells();
        // destroy temporary popover
        $(markedCells).popover("destroy");
    }

}


function removeAllPopovers() {

    hideAllPopovers();

    $(".timeline-cell-occupied").popover("destroy");

    _freeAllCells();
}


function addOccupiedMarkup (contextEvent) {

    var cells = getContextEventCells(contextEvent);

    $(cells).removeClass("timeline-cell-marked")
        .addClass("timeline-cell-occupied")
        .empty()
        .css("border-bottom", "")
        .tooltip("destroy")
        .tooltip({
            container: "#tab5",
            html: true,
            title: getTooltipTitle(contextEvent),
            viewport: "#timelineContainer"
        });

    $(cells).last().css("border-bottom", "1px solid")
        .append($("<div>").addClass("occupied-resize-handle"));

    $(cells).first()
        .css("border-top", "1px solid")
        .append($("<a>").attr("href","#").addClass("fui-gear"))
        .append(createContextEventHideDOM())
        .unbind("click").on("click", "a", contextEvent, _handleOccupiedCellAnchorClickEvent);
}

function removeOccupiedMarkup (contextEvent) {
    var cells = getContextEventCells(contextEvent);

    $(cells).removeClass("timeline-cell-occupied")
        .empty()
        .css("border-bottom", "")
        .attr("title", translate_contextInformation(contextInfo.getID()) + " hat keinen Wert")
        .tooltip("fixTitle");
}


function _handleOccupiedCellAnchorClickEvent (event) {

    var contextEvent = event.data;
    var cells = getContextEventCells(contextEvent);

    if ($(this).hasClass("fui-gear")) {
        $(event.delegateTarget).popover("show");
    }

    else if ($(this).hasClass("fui-eye-blocked")) {
        contextEvent.setVisibility(false);

        $(this).removeClass("fui-eye-blocked").addClass("fui-eye")
            .attr("title", "Einblenden")
            .tooltip("fixTitle");

        $(cells).addClass("timeline-cell-invisible");
    }

    else if ($(this).hasClass("fui-eye")) {
        contextEvent.setVisibility(true);

        $(this).removeClass("fui-eye").addClass("fui-eye-blocked")
            .attr("title", "Ausblenden")
            .tooltip("fixTitle");

        $(cells).removeClass("timeline-cell-invisible");
    }

    event.stopPropagation();
}


function getTooltipTitle (contextEvent) {

    var contextInfo = contextEvent.getContextInfo();
    var chosenValue = contextInfo.getChosenValue();
    if (expectsLearningUnit(contextInfo)) chosenValue = authorSystemContent.getUnitByUUID(chosenValue).getName();

    var contextInfoValues = translate_contextInformation(contextInfo.getID()) + " ist " +
        translate_possibleValue(chosenValue) + "<br><br>";
    contextInfo.getParameters().forEach(function (param) {
        contextInfoValues += translate_parameter(param.getID()) + ": ";
        contextInfoValues += translate_parameterValue(param.getChosenValue()) + "<br>";
    });

    return contextInfoValues;
}
