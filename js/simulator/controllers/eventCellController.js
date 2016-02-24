/**
 * Created by Helena on 22.02.2016.
 */



function getContextEventCells(contextEvent) {
    var cells = $();
    for (var step = contextEvent.getStart(); step <= contextEvent.getEnd(); step++)
        cells = cells.add($("#timelineTable").find(".timeline-step").eq(step)
            .children(".timeline-cell").eq(contextEvent.getColumn()));
    return cells;
}



function addOccupiedMarkup (contextEvent, simulation) {

    var cells = getContextEventCells(contextEvent);

    $(cells)
        .removeClass("timeline-cell-marked")
        .tooltip("destroy")
        .tooltip({
            animation: false,
            container: "body",
            html: true,
            title: getTooltipTitle(contextEvent),
            viewport: "#timelineContainer"
        });

    if (expectsLearningUnit(contextEvent.getContextInfo())) {
        cells = $(cells).first();
    }

    $(cells)
        .addClass("timeline-cell-occupied")
        .empty();

    $(cells).last().css("border-bottom", "1px solid")
        .append($("<div>").addClass("occupied-resize-handle"));

    $(cells).first()
        .css("border-top", "1px solid")
        .append($("<a>").attr("href","#").addClass("fui-new"))
        .append(createContextEventHideDOM())
        .append(createContextEventDeleteDOM())
        .off("click").on("click", "a", simulation, _handleOccupiedCellAnchorClickEvent);
}


function removeOccupiedMarkup (contextEvent) {
    var cells = getContextEventCells(contextEvent);

    $(cells).removeClass("timeline-cell-occupied")
        .empty()
        .css({
            "border-top": "",
            "border-bottom": ""
        })
        .popover("destroy")
        .tooltip("destroy")
        .tooltip(getTopTooltipOptions(
            translate_contextInformation(contextEvent.getContextInfo().getID()) + " hat keinen Wert"
        ));
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
        .tooltip({
            animation: false,
            container: "body"
        });
}




function _handleOccupiedCellAnchorClickEvent (event) {

    var timeline = event.data.getTimeline();
    var contextEvent = timeline.getEventAt(getRowIDOfCell(event.delegateTarget), getColIDOfCell(event.delegateTarget));
    var cells = getContextEventCells(contextEvent);

    if ($(this).hasClass("fui-new")) {
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

    else if ($(this).hasClass("fui-trash")) {
        deleteContextEvent(contextEvent, timeline);
    }
}