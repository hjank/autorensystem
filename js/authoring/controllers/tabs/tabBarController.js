/**
 * Created by Julius Höfler on 30.03.15.
 */

var lastOpenedUnitTab;

// tabs
$(function() {

    // default hide tab content
    $(".tabBar").hide();
    $(".tabContents").hide();

    //showScenarioTab();

    // if one tab is clicked show this one
    $(".tabBar ul li a").click(function() {_showTab(this);});
});

// activate the 3 unit tabs only when there are units
function activateUnitTabs() {
    $(".tabBar ul li a .unitTab").css("color","").css("pointer-events","");
}

// activate the 3 unit tabs only when there are units
function deactivateUnitTabs() {
    $(".tabBar ul li a .unitTab").css("color","#aaa").css("pointer-events","none");
}


// show first tab which displays the scenario's settings and properties
function showScenarioTab() {
    _showTab($(".tabBar ul li a")[0]);
}

// show second tab which displays a unit's properties
function showUnitTab() {
    _showTab(lastOpenedUnitTab || $(".tabBar ul li a")[1]);
}

// show second tab which displays a unit's properties
function showUnitPropertiesTab() {
    _showTab($(".tabBar ul li a")[1]);
}

// show fifth tab which displays a unit's metadata or content
function showMetadataTab() {
    _showTab($(".tabBar ul li a")[2]);
}

// show second tab which displays a unit's properties
function showContextTab() {
    _showTab($(".tabBar ul li a")[3]);
}

// show fourth tab which displays relation options
function showRelationTab() {
    _showTab($(".tabBar ul li a")[4]);
}

// show sixth tab which displays the simulator
function showSimulatorTab() {
    _showTab($(".tabBar ul li a")[5]);
}

/**
 *
 * @param tab A jQuery selectee (the tab, i.e. link to the tab content to be shown).
 * @private
 */
function _showTab(tab) {
    // make sure tab bar is visible
    $(".tabBar").show();
    // deactivate all tabs and hide their content
    deactivateAllTabs();
    // activate selected tab
    $(tab).addClass("active");
    // show active tab content
    _showActiveTabContent(tab);
}


// hide other tab content
function deactivateAllTabs() {
    $(".tabBar ul li a").removeClass("active");
    $(".tabContents").hide();
}

/**
 * Display active tab's content in the panel on the right
 */
function _showActiveTabContent(tab) {
    // if no connection or unit has been clicked, show empty panel
    if ($(tab).hasClass("relationTab") && !connectionIsClicked) return false;
    if ($(tab).hasClass("unitTab")) {
        // keep track of last opened tab
        lastOpenedUnitTab = tab;
        if (!bool_unitClicked) return false;
    }
    if ($(tab).hasClass("simulatorTab")) updateSimulator();
    $($(tab).attr("href")).show();
}


 /**
 * Function clears a selection bar.
  *
 * @param {String} s Contains a selection bar id.
 * */
function cleanSection(s) {
    $(s).empty();
    $(s).select2("data", {id:"\r",text:"\r"});
}