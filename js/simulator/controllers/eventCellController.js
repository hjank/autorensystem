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



function addOccupiedMarkup (contextEvent) {

    var cells = getContextEventCells(contextEvent);

    $(cells).removeClass("timeline-cell-marked")
        .addClass("timeline-cell-occupied")
        .empty()
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
        .append($("<a>").attr("href","#").addClass("fui-new"))
        .append(createContextEventHideDOM())
        .unbind("click").on("click", "a", contextEvent, _handleOccupiedCellAnchorClickEvent);
}


function removeOccupiedMarkup (contextEvent) {
    var cells = getContextEventCells(contextEvent);

    $(cells).removeClass("timeline-cell-occupied")
        .empty()
        .css("border-bottom", "")
        .tooltip("destroy")
        .tooltip({
            container: "#tab5",
            placement: "auto top",
            title: translate_contextInformation(contextEvent.getContextInfo().getID()) + " hat keinen Wert",
            viewport: "#timelineContainer"
        })
        .popover("destroy");
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
        .tooltip({container: "body"});
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