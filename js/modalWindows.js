/**
 * Created by juliushofler on 17.03.15.
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
});

// triggered after clicking save button in scenario creation
function saveCloseSzenario() {

    // get name from input field
    var scenarioName = $("#sname").val();

    // write scenario name on the little navigation bar
    $("#lname").html(scenarioName);

    global_ScenarioLiNumber = global_ScenarioLiNumber + 1;

    // create nur container to see new sceario in menu bar
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

}

// write any typed character in ssname
/*var ssname = "";
function logKey(k) {
    ssname = k.value;
}*/

// triggered after clicking "Passwort ändern"
function showPW() {
    $(".invis").toggleClass("vis");
}

// trigger profile modal window
function showProfil() {

    $("#modal-user").on("shown.bs.modal", function () {
        $("#inputUsername").focus();
    });

    $("#modal-user").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}

// trigger contact modal window
function showContact() {

    $("#modal-contact").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}

// get all content of the input fields and send a mail
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
function showLogin() {

    $("#modal-login").on("shown.bs.modal", function () {
        //$("#").focus();
    });

    $("#modal-login").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}

// trigger new scenario modal window
function showNewSzenario() {

    $("#modal-new-szenario").on("shown.bs.modal", function () {
        $("#sname").focus();
    });

    $("#modal-new-szenario").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });

}

// trigger delete scenarios modal window
function showDeleteSzenario() {

    $("#modal-delete-szenario").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });

}

// trigger load scenarios modal window
function showLoadSzenario() {

    $("#modal-load-szenario").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });

    // delete scenarios and put them and new scenarios in selection bar again
    $("#listLoadScenarios > option").each(function() {
        $(this).remove();
    });
    for (var i = 0; i < global_dataArrayScenarios.length; i++) {
        var option = $("<option>").attr("value", global_dataArrayScenarios[i]["id"]);
        option.html(global_dataArrayScenarios[i]["text"]);
        $("#listLoadScenarios").append(option);
    }
}

// trigger delete scenarios modal window
function showDeleteUnits() {

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

    $("#selectMultiDeleteUnits").empty();
    $("#selectMultiDeleteUnits").select2("data", null);
    $("#selectScenarioDeleteUnit").on("select2-selecting", function(e) {

        $("#selectMultiDeleteUnits").empty();

        /*for (var j=0; j<gloabl_unitsPerScenario.length; j++) {
            if (gloabl_unitsPerScenario[j]["id"] == e.choice.text) {

                for (var k=0; k<gloabl_unitsPerScenario[j]["text"].length; k++) {
                    console.log(gloabl_unitsPerScenario[j]["text"][k]);
                    var option = $("<option>").attr('value', e.val);
                    option.html(gloabl_unitsPerScenario[j]["text"][k]);
                    //list_units.push({id:k, text:gloabl_unitsPerScenario[j]["text"][k]});
                    $("#selectMultiDeleteUnits").append(option);
                }
            }
        }*/

        // get units into multi selection bar
        for (var j=0; j<myAuthorSystem.length; j++) {
            if (myAuthorSystem[j]["name"] == e.choice.text) {

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
            // add unit to list
            list_units.push({id: e.val, text:e.choice.text});

            // set label
            $("#btnDeleteUnits").text("Löschen (" + list_units.length.toString() + ")");
        });

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
function showDeleteUnitsConfirm() {

    $("#modal-delete-units-confirm").modal({
        show: true
    });
}

// triggered if conformation button of delete units was clicked
function deleteUnits(){

    var list_deleteableUnits = $("#selectMultiDeleteUnits").select2("data");
    var currentScenario = $("#selectScenarioDeleteUnit").select2("data")["text"];

    // needed to find scenario and units in menu bar
    var liCurrentScenario = $("span.title").filter(":contains('" + currentScenario + "')");
    liCurrentScenario = liCurrentScenario.parent("a").parent("li");

    // update gui
    for (var j=0; j<myAuthorSystem.length; j++) {
        if (myAuthorSystem[j]["name"] == currentScenario) {
            for (var k=0; k<myAuthorSystem[j]["units"].length; k++) {

                for (var i=0; i<list_deleteableUnits.length; i++) {

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


    /** TODO **/
    // delete connection as well


}

// get back to deletion overview after canceling deletion
function deleteUnitsNot() {

    $("#modal-delete-units").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}

// trigger help modal window
function showHelp() {

    $("#modal-help").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}

// set scenarios in selection bar
function setScenarios() {
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
}

// add scenario as a select option
function updateScenario(name) {
    var j = global_ScenarioCounter;
    var optionClass = $('<option>').attr('value', j.toString());
    optionClass.html(name);
    optionClass.attr("selected", "");
    $("#selectSzenarioDeletion").append(optionClass);
    global_dataArrayScenarios.push({id: j, text: name});
    $("#selectSzenarioDeletion").select2("data", global_dataArrayScenarios);
    global_ScenarioCounter = global_ScenarioCounter + 1;

    // update list with units per scenario
    //gloabl_unitsPerScenario.push({id: name, text:[]});
    myAuthorSystem.push({name: name, units:[]});
}

// label delete button for modal window "Delete Scenarios"
function setLabelBtnScenarioDeletion() {
    //var countSelectedDelete = $("#selectSzenarioDeletion2 option:selected").length;
    var countSelectedDelete = global_arrayShowSzenarioDeletion.length;
    $("#btnDeleteSzenario").text("Löschen (" + countSelectedDelete.toString() + ")");
}

$(function() {

    // remove elements from scenario list, add elements in delete scenario list
    $("#selectSzenarioDeletion").select2().on("select2-removed", function(e) {
        //alert("Removed: " + e.val + ", choice: " + e.choice.text);
        var optionSzenarioDeletion = $('<option>').attr('value', e.val);
        optionSzenarioDeletion.html(e.choice.text);
        optionSzenarioDeletion.attr("selected", "");
        $("#selectSzenarioDeletion2").append(optionSzenarioDeletion);
        global_arrayShowSzenarioDeletion.push({id: e.val, text: e.choice.text});
        $("#selectSzenarioDeletion2").select2("data", global_arrayShowSzenarioDeletion);

        for (var i = global_dataArrayScenarios.length - 1; i >= 0; i--) {
            if (global_dataArrayScenarios[i]["id"] === e.val) {
                global_dataArrayScenarios.splice(i,1);
            }
        }
        setLabelBtnScenarioDeletion();
    });

    // remove elements from delete scenario list, add elements in scenario list
    $("#selectSzenarioDeletion2").select2().on("select2-removed", function(e) {
        var optionSzenarioDeletion = $('<option>').attr('value', e.val);
        optionSzenarioDeletion.html(e.choice.text);
        optionSzenarioDeletion.attr("selected", "");
        $("#selectSzenarioDeletion").append(optionSzenarioDeletion);
        global_dataArrayScenarios.push({id: e.val, text: e.choice.text});
        $("#selectSzenarioDeletion").select2("data", global_dataArrayScenarios);

        for (var i = global_arrayShowSzenarioDeletion.length - 1; i >= 0; i--) {
            if (global_arrayShowSzenarioDeletion[i]["id"] === e.val) {
                global_arrayShowSzenarioDeletion.splice(i,1);
            }
        }
        setLabelBtnScenarioDeletion();
    });

    // add element in scenario list and immediately delete it in delete list
    $("#selectSzenarioDeletion").select2().on("select2-selecting", function(e) {

        for (var i = global_arrayShowSzenarioDeletion.length - 1; i >= 0; i--) {
            if (global_arrayShowSzenarioDeletion[i]["id"] == e.val) {
                global_arrayShowSzenarioDeletion.splice(i,1);
                var remove = $("#selectSzenarioDeletion2>option[value='"+ e.val +"']");
                remove.remove();
            }
        }

        $("#selectSzenarioDeletion2").select2("data", global_arrayShowSzenarioDeletion);
        setLabelBtnScenarioDeletion();
    });

});

// opens new modal window to confirm scenario deletion
function deleteScenariosConfirm() {

    $("#modal-delete-szenario-confirm").modal({
        show: true
    });
}

// delete scenarios from menu bar
function deleteScenarios() {

    for (var i = global_arrayShowSzenarioDeletion.length - 1; i >= 0; i--) {
        var nameScenario = global_arrayShowSzenarioDeletion[i]["text"];
        nameScenario = nameScenario.replace(/(\r\n|\n|\r)/gm,"");       // remove return character

        var liScenario = $("span:contains('" + nameScenario + "')");
        liScenario = liScenario.parent("a").parent("li");
        liScenario.remove();

        // update unit per scenario list
        /*for (var j=0; j<gloabl_unitsPerScenario.length; j++) {
            if (gloabl_unitsPerScenario[j]["id"] == nameScenario) {
                gloabl_unitsPerScenario.splice(j, 1);
            }
        }*/
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
function deleteScenariosNot() {

    $("#modal-delete-szenario").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });
}

// load scenario with learning units on the main window
function loadScenario() {

    //var sname = $("#lname")[0].innerText;
    //var selectedScenario = $("#select2-chosen-10")[0].innerText;

    /*$("#menuScenarios > li").each(function() {
        var menuName = $(this)[0].innerText.replace(/(\r\n|\n|\r)/gm,"");

        if ( menuName == sname ) {
            var divSTM = $("#stm")[0].cloneNode(true);
            divSTM.removeAttribute("id");
            $(this).append(divSTM);

            $("#stm").empty();
        }

        // find div in selected scenario with state maschine
        if ( menuName == selectedScenario ) {
            alert($(this).children("div").length);
            if ( $(this).children("div").length ) {
                alert("hat div");
                var divLi = $(this).children("div").children().cloneNode(true);
                $("#stm").append(divLi);

            } else {
                alert("hat nix");
            }
        }
    });*/

    // remove all units from the container
    $("#stm").empty();

    // change name to new scenario
    var selectedScenario = $("#listLoadScenarios").select2("data")["text"];
    $("#lname").html(selectedScenario);

    // find scenario in JSON structure
    for (var i=0; i<myAuthorSystem.length; i++) {

        if (myAuthorSystem[i].name == selectedScenario) {

            // load units from new scenario
            for (var j=0; j<myAuthorSystem[i]["units"].length; j++) {
                var unit = loadUnit(myAuthorSystem[i]["units"][j], j);

                // place unit in state machine
                $(unit).css("top", myAuthorSystem[i]["units"][j].posY + "px");
                $(unit).css("left", myAuthorSystem[i]["units"][j].posX + "px");

                console.log(myAuthorSystem[i]["units"][j]);
            }
        }
    }

    // hide tabs
    $(".tabContents").hide();

}

function loadUnit(unit, j) {

    jsPlumb.setContainer($("#stm"));

    var i = 1;
    var inst = jsPlumb.getInstance({
        Endpoint: ["Dot", {radius: 2}],
        HoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 2 },
        ConnectionOverlays: [
            [ "Arrow", {
                location: 1,
                id: "arrow",
                length: 14,
                foldback: 0.8
            } ],
            [ "Label", { label: "connecting", id: "label", cssClass: "aLabel" }]
        ],
        Container: "stm"
    });

    inst.bind("connection", function (info) {
        info.connection.getOverlay("label").setLabel(i.toString());
        i = i + 1;
    });

    inst.bind("click", function (c) {
        inst.detach(c);
    });

    window.jsp = inst;

    var newState = $('<div>').attr('id', 'state' + j).addClass('w');
    var title = $('<div>').addClass('title').css("padding", "0px 7px");
    title.html(unit.name);
    var ep = $('<div>').addClass('ep');

    // add div for context information icons
    var divContextIcons = $("<div>").addClass("unit-icons");

    newState.append(divContextIcons);
    newState.append(title);
    newState.append(ep);
    $('#stm').append(newState);

    inst.draggable(newState, {
        containment: 'parent'
    });

    inst.makeTarget(newState, {
        anchor: "Continuous",
        dropOptions: { hoverClass: "dragHover" },
        allowLoopback: true
    });

    inst.makeSource(ep, {
        parent: newState,
        anchor: "Continuous",
        connector: [ "StateMachine", { curviness: 20 } ],
        connectorStyle: { strokeStyle: "#5c96bc", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4 }
    });

    activateFunctionalities(newState);

    // get all context information
    //for (var k= 0; k<unit["contextInformations"].length; k++) {

    //}

    // get all meta data


    return newState;

}

// triggered if delete button in tab "Eigenschaften" was clicked
function showDeleteUnitConfirm() {

    $("#modal-delete-unit-confirm").modal({
        keyboard: true,
        backdrop: true,
        show: true
    });

    var unitName = $("#inputUnitName")[0].value;
    $("#tabTextUnitDeletion").html('Wollen Sie die Lerneinheit "' + unitName + '" wirklich löschen?');
}

// delete unit after confirming deletion in tab "Eigenschaften"
function deleteUnit() {

    var currentScenario = $("#lname")[0].innerHTML;

    // needed to find scenario and units in menu bar
    var liCurrentScenario = $("span.title").filter(":contains('" + currentScenario + "')");
    liCurrentScenario = liCurrentScenario.parent("a").parent("li");

    // update gui
    for (var j=0; j<myAuthorSystem.length; j++) {
        if (myAuthorSystem[j]["name"] == currentScenario) {
            for (var k=0; k<myAuthorSystem[j]["units"].length; k++) {

                // delete unit in state machine
                var unit = $("#inputUnitName")[0].value;
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

// reset modal windows after closing
$(function() {

    $("body").on("hidden.bs.modal", ".modal", function() {
        if ( $(this)[0].id == "modal-login"
            || $(this)[0].id == "modal-new-szenario"
            || $(this)[0].id == "modal-delete-szenario"
            || $(this)[0].id == "modal-user"
            || $(this)[0].id == "modal-contact"
        ) {
            $(this).find("form")[0].reset();
        }
    });

})

