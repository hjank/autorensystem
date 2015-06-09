/**
 * Created by Julius Höfler on 17.03.15.
 */

var global_ScenarioCounter = 0;
var global_dataArrayScenarios = [];
var global_arrayShowSzenarioDeletion = [];
var global_ScenarioLiNumber = 0;
//var gloabl_unitsPerScenario = [];


$(function() {

    // make sure that after clicking enter in modal window "Neues Szenario erstellen"
    // the same steps were gone like clicking on the create button
    $("#modal-new-szenario").keypress(function(e) {
        if (e.keyCode == 13) {
            saveCloseSzenario();
            $('#modal-new-szenario').modal('hide');
            return true;
        }
    });

    // make sure that after clicking enter in input "Neues Szenario erstellen"
    // the same steps were gone like clicking on the create button
    $("#sname").keypress(function(e) {
        if (e.keyCode == 13) {
            saveCloseSzenario();
            $('#modal-new-szenario').modal('hide');
            return false;
        }
    });

    // triggered if load button was clicked in modal window load scenario
    $("#btnLoadScenario").on("click", function() {

        // get name of the selected scenario
        var selectedScenario = $("#s2id_listLoadScenarios")[0].innerText.slice(0, -1);

        // find right scenario
        for (var i=0; i<myAuthorSystem.length; i++) {
            if (myAuthorSystem[i].name == selectedScenario) {
                // save scenario object in JSON structure
                localStorage.setItem("saveData", JSON.stringify(myAuthorSystem[i]));

                // add name in URL
                $(location).attr("href", "?" + selectedScenario);
            }
        }

        // only for testing
        if (selectedScenario == "Testszenario") {

            // add name in URL
            $(location).attr("href", "?" + selectedScenario);
        }

    });
});

// triggered after clicking save button in scenario creation
/**
 * Function creates a new scenario.
 * It adds the name in the menu bar and in the header above the working place.
 * Is Triggered after clicking save button in modal window scenario creation.
 * */
function saveCloseSzenario() {

    // get name from input field
    var scenarioName = $("#sname").val();

    // write scenario name on the little navigation bar
    $("#lname").html(scenarioName);

    // count number of scenarios (needed for different ids)
    global_ScenarioLiNumber = global_ScenarioLiNumber + 1;

    // create new container to see new scenario in menu bar
    var liClass = $('<li>').addClass('last');
    liClass.attr("id", "menu-scenario-" + global_ScenarioLiNumber);
    var aClass = $('<a>').attr('href', '#');
    var spanClass = $('<span>').addClass('title');

    // append container in html file
    spanClass.append(scenarioName);
    aClass.append(spanClass);
    liClass.append(aClass);
    $("#cssmenu > ul").append(liClass);

    // update scenario list and panel
    updateScenario(scenarioName);
    setLabelBtnScenarioDeletion();

    // remove all units from state machine container
    $("#stm").empty();

    // defines DOM as jsPlump container
    jsPlumb.setContainer($("#stm"));

    // activate quick add learning unit button (little navbar right)
    $("#navadd").css("pointer-events", "");
    $("#navadd").css("color", "rgb(102,102,102)");

    // activate learning unit dropdown menu (big navigation bar)
    $("#navbarLearningUnit").css("pointer-events", "");
    $("#navbarLearningUnit").css("color", "");
}

// triggered after clicking "Passwort ändern"
/**
 * Function makes input fields for password change visible/invisible (toggle).
 * */
function showPW() {
    $(".invis").toggleClass("vis");
}

// trigger profile modal window
/**
 * Function shows the user profile modal window and sets focus to the first input field.
 * */
function showProfil() {

    // set focus on user name input field
    $("#modal-user").on("shown.bs.modal", function () {
        $("#inputUsername").focus();
    });

    // show modal window
    $("#modal-user").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}

// trigger contact modal window
/**
 * Function shows the contact modal window.
 * */
function showContact() {

    // show modal window
    $("#modal-contact").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}

// get all content of the input fields and send a mail
/**
 * Function reads out the input fields in the contact modal window after clicking the send button.
 * @parma {Object} f form object from contact modal window
 * */
function getContentContact(f) {
    var name = f.userName.value;
    var mail = f.userMail.value;
    var text = f.userText.value;

    //var subject = "Authorensystem Frage";

    alert("Name:" + name + ", Mail:" + mail + ", Text:" + text);

    /*$(location).attr("href", "mailto:airj@gmx.net?"
        + "subject=" + encodeURIComponent(subject)
        + "&body=" + encodeURIComponent(text)
    );*/
}

// trigger login modal window
/**
 * Function shows the login modal window.
 * */
function showLogin() {

    // show modal window
    $("#modal-login").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}

// trigger new scenario modal window
/**
 * Function shows the new scenario modal window.
 * */
function showNewSzenario() {

    // set focus to scenario name input field
    $("#modal-new-szenario").on("shown.bs.modal", function () {
        $("#sname").focus();
    });

    // show modal window
    $("#modal-new-szenario").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });

}

// trigger delete scenarios modal window
/**
 * Function shows the delete scenario modal window.
 * */
function showDeleteSzenario() {

    // show modal window
    $("#modal-delete-szenario").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });

}

// trigger load scenarios modal window
/**
 * Function shows the load scenario modal window.
 * */
function showLoadSzenario() {

    // show modal window
    $("#modal-load-szenario").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });

    // delete scenarios
    $("#listLoadScenarios > option").each(function() {
        $(this).remove();
    });

    var checkName = false;

    // put all scenarios in selection bar
    for (var i = 0; i < myAuthorSystem.length; i++) {
        var option = $("<option>").attr("value", "val" + myAuthorSystem[i].name);
        option.html(myAuthorSystem[i].name);
        $("#listLoadScenarios").append(option);

        // only for testing --> add check variable
        if (myAuthorSystem[i].name == "Testszenario") {
            checkName = true;
        }

    }

    // only for testing --> add a fix scenario
    if (!checkName) {
        option = $("<option>").attr("value", "val" + "Testszenario");
        option.html("Testszenario");
        $("#listLoadScenarios").append(option);
    }

}

// trigger delete scenarios modal window
/**
 * Function shows the delete unit modal window.
 * Sets event listeners to the selection and multi selection bar.
 * */
function showDeleteUnits() {

    // show modal window
    $("#modal-delete-units").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });

    // set deletion button label
    var list_units = [];
    $("#btnDeleteUnits").text("Löschen (" + list_units.length.toString() + ")");

    // delete scenarios and put them and new scenarios in selection bar again
    $("#selectScenarioDeleteUnit").empty();
    $("#selectScenarioDeleteUnit").select2("data", {id:"\r",text:"\r"});
    for (var i = 0; i < global_dataArrayScenarios.length; i++) {
        var option = $("<option>").attr("value", global_dataArrayScenarios[i]["id"]);
        option.html(global_dataArrayScenarios[i]["text"]);
        $("#selectScenarioDeleteUnit").append(option);
    }

    // clean multi selection bar and fill it again
    $("#selectMultiDeleteUnits").empty();
    $("#selectMultiDeleteUnits").select2("data", null);

    // triggered if an scenario was selected
    $("#selectScenarioDeleteUnit").on("select2-selecting", function(e) {

        // clean multi selection bar
        $("#selectMultiDeleteUnits").empty();
        list_units = [];
        $("#btnDeleteUnits").text("Löschen (" + 0 + ")");

        // get units into multi selection choice
        for (var j=0; j<myAuthorSystem.length; j++) {
            // find right scenario
            if (myAuthorSystem[j]["name"] == e.choice.text) {

                // get all units
                var units = $("#stm").children("div.w").children("div.title");

                for (var k=0; k<myAuthorSystem[j]["units"].length; k++) {
                    var option = $("<option>");

                    // get unit id and set value = id
                    for (var l=0; l<units.length; l++) {
                        if (myAuthorSystem[j]["units"][k]["name"] == units[l].innerText) {
                            option.attr('value', $(units[l]).parent()[0].id);
                        }
                    }

                    // set option name and append in multi selection bar
                    option.html(myAuthorSystem[j]["units"][k]["name"]);
                    $("#selectMultiDeleteUnits").append(option);
                }
            }
        }

        // select unit which should be deleted
        $("#selectMultiDeleteUnits").select2().on("select2-selecting", function(e) {

            // test if unit is already in the list
            var isContained = false;
            for (var i=0; i<list_units.length; i++) {
                if (e.val == list_units[i].id) {
                    isContained = true;
                }
            }
            // if not in list add unit
            if (!isContained) {
                list_units.push({id: e.val, text:e.choice.text});
            }

            // set label
            $("#btnDeleteUnits").text("Löschen (" + list_units.length.toString() + ")");
        });

        // triggered if a unit was deleted
        $("#selectMultiDeleteUnits").select2().on("select2-removed", function(e) {
            // remove unit from list
            for (var j=0; j<list_units.length; j++) {
                if (list_units[j].text == e.choice.text) {
                    list_units.splice(j, 1);
                }
            }
            // set label
            $("#btnDeleteUnits").text("Löschen (" + list_units.length.toString() + ")");
        });
    });
}

// opens new modal window to confirm unit deletion
/**
 * Function shows the confirmation of unit deletion modal window.
 * */
function showDeleteUnitsConfirm() {

    // show modal window
    $("#modal-delete-units-confirm").modal({
        show: true
    });
}

// triggered if conformation button of delete units was clicked
/**
 * Function deletes a learning unit from the working place.
 * Triggered in the modal window "confirm unit deletion".
 * */
function deleteUnits(){

    // get units which should be deleted
    var list_deleteableUnits = $("#selectMultiDeleteUnits").select2("data");

    // get right scenario name
    var currentScenario = $("#selectScenarioDeleteUnit").select2("data")["text"];

    // needed to find scenario in menu bar
    var liCurrentScenario;
    $("#menuScenarios").children("li").children("a").children("span.title").each(function() {
        if ( $(this)[0].innerHTML == currentScenario ) {
            liCurrentScenario = $(this).parent("a").parent("li");
        }
    });

    // update gui
    for (var j=0; j<myAuthorSystem.length; j++) {
        // find right scenario
        if (myAuthorSystem[j]["name"] == currentScenario) {
            for (var k=0; k<myAuthorSystem[j]["units"].length; k++) {

                // delete all units in deletable list
                for (var i=0; i<list_deleteableUnits.length; i++) {

                    // Note: unit deletion on working place see statemaschine.js
                    // delete unit in statemaschine
                    //var unit = list_deleteableUnits[i].id;
                    //$("#" + unit).remove();

                    // delete unit in JSON structure
                    if (myAuthorSystem[j]["units"][k]["name"] == list_deleteableUnits[i].text) {
                        myAuthorSystem[j]["units"].splice(k, 1);
                    }

                    // delete unit in menu bar
                    liCurrentScenario.children("ul").children("li").each(function() {
                        if ($(this).children("a").children("span")[0].innerHTML == list_deleteableUnits[i].text) {
                            $(this).remove();
                        }
                    });
                }

            }
        }
    }
    // delete holder in scenario in menu bar
    /*if (liCurrentScenario.children("ul").children("li").length == 0 &&
            liCurrentScenario.hasClass("has-sub")) {
        liCurrentScenario.removeClass("has-sub");
        liCurrentScenario.children("a").children("span.holder").remove();
        liCurrentScenario.children("ul").remove();

        liCurrentScenario.addClass("last");
    }*/

    // all tab content invisible
    $(".tabContents").hide();
    $(".tab-Container").hide();
    $("#tabUnitLabel").hide();

}

// get back to deletion overview after canceling deletion
/**
 * Function shows delete units modal window after canceling deletion in confirmation.
 * */
function deleteUnitsNot() {

    // show modal window
    $("#modal-delete-units").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}

// trigger help modal window
/**
 * Function shows help modal window
 * */
function showHelp() {

    // show modal window
    $("#modal-help").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}

// set scenarios in selection bar
/*function setScenarios() {
    var countScenarios = $("#menuScenarios").children("li").length;
    var scenarios = $("#menuScenarios").children("li");

    // iterate over all scenarios in the menu bar and add them in the selection bar
    for (var i = 0; i < countScenarios; i++) {
        var optionClass = $('<option>').attr('value', i.toString());
        optionClass.html(scenarios[i].innerText);
        optionClass.attr("selected", "");
        $("#selectSzenarioDeletion").append(optionClass);
        global_dataArrayScenarios.push({id: i, text: scenarios[i].innerText.replace(/(\r\n|\n|\r)/gm,"")});
        global_ScenarioCounter = global_ScenarioCounter + 1;

        // get units for each scenario
        var units = [];
        if ($(scenarios[i]).children("ul").children("li").length != 0) {
            $(scenarios[i]).children("ul").children("li").each(function() {
                //units.push($(this)[0].innerText.replace(/(\r\n|\n|\r)/gm,""));
                units.push({name:$(this)[0].innerText.replace(/(\r\n|\n|\r)/gm,"")});
            });
            //gloabl_unitsPerScenario.push({id:scenarios[i].innerText.replace(/(\r\n|\n|\r)/gm,""), text:units});
            myAuthorSystem.push({name:scenarios[i].innerText.replace(/(\r\n|\n|\r)/gm,""), units:units});
        }

    }
    $("#selectSzenarioDeletion").select2("data", global_dataArrayScenarios);
}*/

// add scenario as a select option
/**
 * Function
 * @param {String} name Name of the new Scenario
 * */
function updateScenario(name) {
    var j = global_ScenarioCounter;

    // add scenario as an option in selection bar
    var optionClass = $('<option>').attr('value', j.toString());
    optionClass.html(name);
    optionClass.attr("selected", "");
    $("#selectSzenarioDeletion").append(optionClass);

    // get scenario data in multi selection bar
    global_dataArrayScenarios.push({id: j, text: name});
    $("#selectSzenarioDeletion").select2("data", global_dataArrayScenarios);
    global_ScenarioCounter = global_ScenarioCounter + 1;

    // update list with units per scenario
    myAuthorSystem.push({name: name, units:[], connections:[]});
}

// label delete button for modal window "Delete Scenarios"
/**
 * Function get the number of scenarios which should be deleted and set the label of deletion button
 * with this number.
 * */
function setLabelBtnScenarioDeletion() {
    // get the length
    var countSelectedDelete = global_arrayShowSzenarioDeletion.length;

    // set label of of the deletion button
    $("#btnDeleteSzenario").text("Löschen (" + countSelectedDelete.toString() + ")");
}

$(function() {

    // remove elements from scenario list, add elements in delete scenario list
    $("#selectSzenarioDeletion").select2().on("select2-removed", function(e) {
        // build option DOM
        var optionScenarioDeletion = $('<option>').attr('value', e.val);
        optionScenarioDeletion.html(e.choice.text);
        optionScenarioDeletion.attr("selected", "");

        // add option to selection bar
        $("#selectSzenarioDeletion2").append(optionScenarioDeletion);
        global_arrayShowSzenarioDeletion.push({id: e.val, text: e.choice.text});
        $("#selectSzenarioDeletion2").select2("data", global_arrayShowSzenarioDeletion);

        // delete element in scenario list
        for (var i = global_dataArrayScenarios.length - 1; i >= 0; i--) {
            if (global_dataArrayScenarios[i]["id"] === e.val) {
                global_dataArrayScenarios.splice(i,1);
            }
        }
        // set label
        setLabelBtnScenarioDeletion();
    });

    // remove elements from delete scenario list, add elements in scenario list
    $("#selectSzenarioDeletion2").select2().on("select2-removed", function(e) {
        // build option DOM
        var optionSzenarioDeletion = $('<option>').attr('value', e.val);
        optionSzenarioDeletion.html(e.choice.text);
        optionSzenarioDeletion.attr("selected", "");

        // add option to selection bar
        $("#selectSzenarioDeletion").append(optionSzenarioDeletion);
        global_dataArrayScenarios.push({id: e.val, text: e.choice.text});
        $("#selectSzenarioDeletion").select2("data", global_dataArrayScenarios);

        // delete element in deletion list
        for (var i = global_arrayShowSzenarioDeletion.length - 1; i >= 0; i--) {
            if (global_arrayShowSzenarioDeletion[i]["id"] === e.val) {
                global_arrayShowSzenarioDeletion.splice(i,1);
            }
        }
        // set label
        setLabelBtnScenarioDeletion();
    });

    // add element in scenario list and immediately delete it in delete list
    $("#selectSzenarioDeletion").select2().on("select2-selecting", function(e) {

        // remove element
        for (var i = global_arrayShowSzenarioDeletion.length - 1; i >= 0; i--) {
            if (global_arrayShowSzenarioDeletion[i]["id"] == e.val) {
                global_arrayShowSzenarioDeletion.splice(i,1);
                var remove = $("#selectSzenarioDeletion2>option[value='"+ e.val +"']");
                remove.remove();
            }
        }

        // push elements in selection bar
        $("#selectSzenarioDeletion2").select2("data", global_arrayShowSzenarioDeletion);

        // set label
        setLabelBtnScenarioDeletion();
    });

});

// opens new modal window to confirm scenario deletion
/**
 * Function shows the confirmation of scenario deletion modal window
 * */
function deleteScenariosConfirm() {

    // show modal window
    $("#modal-delete-szenario-confirm").modal({
        show: true
    });
}

// delete scenarios from menu bar and clears state machine
/**
 * Function deletes selected scenarios from menu bar. All corresponding learning units on the work place
 * were deleted was well.
 * */
function deleteScenarios() {

    // delete all wished scenarios
    for (var i = global_arrayShowSzenarioDeletion.length - 1; i >= 0; i--) {
        // get scenario name
        var nameScenario = global_arrayShowSzenarioDeletion[i]["text"];
        nameScenario = nameScenario.replace(/(\r\n|\n|\r)/gm,"");       // remove return character

        // find right scenario in menu bar and remove it
        $("#menuScenarios").children("li").children("a").children("span.title").each(function() {
            if ( $(this)[0].innerHTML == nameScenario ) {
                var parent = $(this).parent("a").parent("li");
                parent.remove();
            }
        });

        // delete units in container
        $("#stm").children().remove();

        // update unit per scenario list
        for (var j=0; j<myAuthorSystem.length; j++) {
            if (myAuthorSystem[j]["name"] == nameScenario) {
                myAuthorSystem.splice(j, 1);
            }
        }

        // deletes label with currently open scenario if this one was deleted
        if ( $("#lname")[0].innerText == nameScenario ) {
            $("#lname").html("");
        }
    }

    // needed to clear the selection with the deleted scenarios in it
    global_arrayShowSzenarioDeletion = [];
    $("#choiceDeletionScenarios > select").empty();
    $("#choiceDeletionScenarios > select").select2("val", "");
}

// get back to deletion overview after canceling deletion
/**
 * Function shows delete scenarios modal window again after canceling the confirmation.
 * */
function deleteScenariosNot() {

    // show modal window
    $("#modal-delete-szenario").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}

// triggered if save scenario was clicked
/**
 * Function saves current open scenario as a JSON file.
 */
function showSaveScenario() {

    // get current scenario name
    var currentScenario = $("#lname")[0].innerHTML;
    var json;
    var jsonFile = null;

    // find current scenario in all scenarios
    for (var i=0; i<myAuthorSystem.length; i++) {
        if (myAuthorSystem[i].name == currentScenario) {
            json = JSON.stringify(myAuthorSystem[i]);
            break;
        }
    }

    // set blob with JSON data
    var data = new Blob([json], {type: "text/json;charset=utf8"});

    // if file will be replaced by another one --> avoid memory leak
    if (jsonFile !== null) {
        window.URL.revokeObjectURL(jsonFile);
    }
    // set JSON file
    jsonFile = window.URL.createObjectURL(data);

    // change file name to current scenario name
    $("#saveScenario").children("a")[0].download = currentScenario + ".json";

    // add link and open download view
    $("#saveScenario").children("a")[0].href = jsonFile;

    // show json in new window
    /*var url = "data:text/json;charset=utf8," + encodeURIComponent(JSON.stringify(myAuthorSystem));
     window.open(url, "_blank");
     window.focus();*/
}

/**
 * Function loads
 * Hint: The website will be new loaded.
 * @param {Object} unit Contains all information about the unit
 * @param {String} j Contains the running ID number
 * @param {Object} inst Contains the jsPlumb
 * @return {Object} Contains the unit DOM element
 * */
function loadUnit(unit, j, inst) {

    window.jsp = inst;

    // build unit DOM
    var newState = $('<div>').attr('id', 'state' + j).addClass('w');
    var title = $('<div>').addClass('title').css("padding", "0px 7px");
    title.html(unit.name);
    var ep = $('<div>').addClass('ep');

    // add div for context information icons
    var divContextIcons = $("<div>").addClass("unit-icons");

    // add elements to unit DOM
    newState.append(divContextIcons);
    newState.append(title);
    newState.append(ep);

    // add unit to state machine
    $('#stm').append(newState);

    // get all context information
    for (var k= 0; k<unit["contextInformations"].length; k++) {
        var divContextIcon = $("<div>").addClass("unit-icon").attr("id", unit["contextInformations"][k]["name"] + k + "icon");
        var icon = unit["contextInformations"][k]["icon"];

        // add icon und div to unit
        divContextIcon.append(icon);
        divContextIcons.append(divContextIcon);

        // get state of satisfiability
        if (unit["sat"] == "all") {
            divContextIcons.css("border", "2px solid #adadad");
            divContextIcons.attr("ci", "all");
        } else {
            divContextIcons.css("border", "2px dotted #adadad");
            divContextIcons.attr("ci", "one");
        }

        // design for icons
        divContextIcons.css("border-radius", "4px");
        newState.css("padding-top", "10px");
        divContextIcons.css("height", "23px");
        divContextIcons.css("display", "inline-block");
    }

    // get all meta data
    for (var l= 0; l<unit["metaData"].length; l++) {
        var divMetaIcon = $("<div>").addClass("unit-meta-icons").attr("id", unit["name"] + l + "metaIcon");

        var metaIcon;
        switch (unit["metaData"][l]["name"]) {
            case "Bild":
                metaIcon = "fui-photo";
                divMetaIcon.attr("title", unit["metaData"][l]["name"]);
                break;
            case "Film":
                metaIcon = "fui-video";
                divMetaIcon.attr("title", unit["metaData"][l]["name"]);
                break;
            case "Text":
                metaIcon = "fui-document";
                divMetaIcon.attr("title", unit["metaData"][l]["name"]);
                break;
            case "Navigation":
                metaIcon = "fui-location";
                divMetaIcon.attr("title", unit["metaData"][l]["name"]);
                break;
            case "Test":
                metaIcon = "fui-radio-unchecked";
                divMetaIcon.attr("title", unit["metaData"][l]["name"]);
                break;
            case "Audio":
                metaIcon = "fui-volume";
                divMetaIcon.attr("title", unit["metaData"][l]["name"]);
                break;
        }

        // add meta icon to unit DOM
        var bMetaIcon = $("<b>").addClass(metaIcon);
        divMetaIcon.append(bMetaIcon);
        newState.append(divMetaIcon);

        // change size of learning unit
        newState.css("padding-bottom", "5px");
    }

    // place unit in state machine
    $(newState).css("top", unit.posY + "px");
    $(newState).css("left", unit.posX + "px");

    // make unit draggable
    inst.draggable(newState, {
        containment: '.body'
    });

    // set unit target point
    inst.makeTarget(newState, {
        anchor: "Continuous",
        dropOptions: { hoverClass: "dragHover" },
        allowLoopback: false
    });

    // set unit source point
    inst.makeSource(ep, {
        parent: newState,
        anchor: "Continuous",
        connector: [ "StateMachine", { curviness: 20 } ],
        connectorStyle: { strokeStyle: "#5c96bc", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4 }
    });

    return newState;

}

// triggered if delete button in tab "Eigenschaften" was clicked
/**
 * Function shows delete unit confirmation modal window.
 * Triggered in tab properties after clicking the unit delete button
 * */
function showDeleteUnitConfirm() {

    // show modal window
    $("#modal-delete-unit-confirm").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });

    // get unit name and show the unit specific text
    var unitName = $("#inputUnitName")[0].value;
    $("#tabTextUnitDeletion").html('Wollen Sie die Lerneinheit "' + unitName + '" wirklich löschen?');
}

// delete unit after confirming deletion in tab "Eigenschaften"
/**
 * Function deletes selected unit from the working place.
 * */
function deleteUnit() {

    // get current scenario name
    var currentScenario = $("#lname")[0].innerHTML;

    // needed to find scenario in menu bar
    var liCurrentScenario;
    $("#menuScenarios").children("li").children("a").children("span.title").each(function() {
        if ( $(this)[0].innerHTML == currentScenario ) {
            liCurrentScenario = $(this).parent("a").parent("li");
        }
    });

    // update gui
    for (var j=0; j<myAuthorSystem.length; j++) {
        if (myAuthorSystem[j]["name"] == currentScenario) {
            for (var k=0; k<myAuthorSystem[j]["units"].length; k++) {

                // delete unit in state machine
                var unit = $("#inputUnitName")[0].value;

                // Note: unit deletion on working place see statemaschine.js
                /*$("#stm").children("div.w").children("div.title").each(function() {
                    if (this.innerHTML == unit) {
                        $(this).parent().remove();
                    }
                });*/

                // delete unit in JSON structure
                if (myAuthorSystem[j]["units"][k]["name"] == unit) {
                    myAuthorSystem[j]["units"].splice(k, 1);
                }

                // delete unit in menu bar
                liCurrentScenario.children("ul").children("li").each(function() {
                    if ($(this).children("a").children("span")[0].innerHTML == unit) {
                        $(this).remove();
                    }
                });
            }
        }
    }

    // all tab content invisible
    $(".tabContents").hide();
    $(".tab-Container").hide();
}

function showDeleteConnectionConfirm() {

    // show modal window
    $("#modal-delete-connection-confirm").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}

// reset modal windows after closing
$(function() {

    // triggered if modal window was closed
    $("body").on("hidden.bs.modal", ".modal", function() {
        // only reset modal windows if they have forms
        if ( $(this)[0].id == "modal-login"
            || $(this)[0].id == "modal-new-szenario"
            || $(this)[0].id == "modal-delete-szenario"
            || $(this)[0].id == "modal-user"
            || $(this)[0].id == "modal-contact"
        ) {
            // reset form
            $(this).find("form")[0].reset();
        }
    });

})

