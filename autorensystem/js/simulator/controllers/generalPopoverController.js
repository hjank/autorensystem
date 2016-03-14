/**
 * Created by Helena on 13.03.2016.
 */




function activateInfoPopovers() {

    $(".fui-question-circle")
        .off("shown.bs.popover").on("shown.bs.popover", function (e) {
            var popoverElement = $(e.target).data("bs.popover").$tip;
            replaceActionVerbInTitle(popoverElement);
            addCloseXToPopoverTitle(popoverElement);
        });

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
