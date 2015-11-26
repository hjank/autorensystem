/**
 * Created by Julius Höfler on 30.03.15.
 */


// tabs
$(function() {

    // default hide tabs
    $(".tab-Container").hide();
    $(".tabContents").hide();
    $("#firstTab").addClass("active");

    // if one tab is clicked show this one
    $(".tab-Container ul li a").click(function() {

        // hide other tab content
        var activeTab = $(this).attr("href");
        $(".tab-Container ul li a").removeClass("active");
        $(this).addClass("active");
        $(".tabContents").hide();

        // TODO: For each newly created unit show firstTab on first click --> see $(unit).click(...)
        // TODO: For each follow-up click of existing unit show tab that was last opened
        // only show tab content if a unit is clicked
        if (bool_unitClicked) {
            $(activeTab).fadeIn();
        }

        return false;
    });
});



// cleans selection bars
/**
 * Function cleans a selection bar.
 * @param {String} s Contains a selection bar id.
 * */
function cleanSection(s) {
    $(s).empty();
    $(s).select2("data", {id:"\r",text:"\r"});
}