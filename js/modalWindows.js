/**
 * Created by juliushofler on 17.03.15.
 */

var global_ScenarioCounter = 0;
var global_dataArrayScenarios = [];
var global_arrayShowSzenarioDeletion = [];
var global_ScenarioLiNumber = 0;
var gloabl_unitsPerScenario = [];

// get scenario name from input field
/*$(function() {
    $("#sname").keyup(function() {
        ssname = $("#sname").val();
    });
});*/

// triggered after clicking save button in scenario creation
function saveCloseSzenario() {

    // write scenario name on the little navigation bar
    $("#lname").html(ssname);

    global_ScenarioLiNumber = global_ScenarioLiNumber + 1;

    // create nur container to see new sceario in menu bar
    var liClass = $('<li>').addClass('last');
    liClass.attr("id", "menu-scenario-" + global_ScenarioLiNumber);
    var aClass = $('<a>').attr('href', '#');
    var spanClass = $('<span>').addClass('title');

    // append container in html file
    spanClass.append(ssname);
    aClass.append(spanClass);
    liClass.append(aClass);
    $("#cssmenu > ul").append(liClass);

    // update scenario list and panel
    updateScenario(ssname);
    setLabelBtnScenarioDeletion();

}

// write any typed character in ssname
var ssname = "";
function logKey(k) {
    ssname = k.value;
}

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

        for (var j=0; j<gloabl_unitsPerScenario.length; j++) {
            if (gloabl_unitsPerScenario[j]["id"] == e.choice.text) {

                for (var k=0; k<gloabl_unitsPerScenario[j]["text"].length; k++) {
                    console.log(gloabl_unitsPerScenario[j]["text"][k]);
                    var option = $("<option>").attr('value', e.val);
                    option.html(gloabl_unitsPerScenario[j]["text"][k]);
                    //list_units.push({id:k, text:gloabl_unitsPerScenario[j]["text"][k]});
                    $("#selectMultiDeleteUnits").append(option);
                }
            }
        }
        //$("#selectMultiDeleteUnits").select2("data", list_units);
    });
}

// opens new modal window to confirm unit deletion
function showDeleteUnitsConfirm() {

    $("#modal-delete-units-confirm").modal({
        show: true
    });
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
                units.push($(this)[0].innerText.replace(/(\r\n|\n|\r)/gm,""));
            });
            gloabl_unitsPerScenario.push({id:scenarios[i].innerText.replace(/(\r\n|\n|\r)/gm,""), text:units});
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
    gloabl_unitsPerScenario.push({id: name, text:[]});
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
        for (var j=0; j<gloabl_unitsPerScenario.length; j++) {
            if (gloabl_unitsPerScenario[j]["id"] == nameScenario) {
                gloabl_unitsPerScenario.splice(j, 1);
            }
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

    var sname = $("#lname")[0].innerText;
    var selectedScenario = $("#select2-chosen-10")[0].innerText;

    $("#menuScenarios > li").each(function() {
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
    });

    $("#lname").html(selectedScenario);

}

// modal window maps
$(function(){

    var map;
    var currentLat, currentLng;

    // central point of the map
    var latlng = new google.maps.LatLng('52.3877833', '13.0831297');

    // resize map if modal window is opening
    $("#modal-maps").on("shown.bs.modal", function() {
        resizeMap();
    });

    // show modal map window
    $("#navmaps").on("click", function() {
        $("#modal-maps").modal({
            keyboard: true,
            backdrop: true,
            show: true
        });
    });

    // create the map
    function showMap() {

        var myOptions = {
            zoom: 16,
            center: latlng,
            //mapTypeId: 'terrain'
            mapTypeId: 'roadmap'
        };

        // flat ui style
        var style = [/*{
            "stylers": [{
                "visibility": "off"
            }]
        },*/ {
            "featureType": "road",      // streets are white
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#ffffff"
            }]
        }, {
            "featureType": "road.arterial",     // main streets are yellow
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#fee379"
            }]
        }, {
            "featureType": "road.highway",      // highways are light orange
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#fee379"
            }]
        }, {
            "featureType": "landscape",         // landscape is grey
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#f3f4f4"
            }]
        }, {
            "featureType": "water",             // water is blue
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#7fc8ed"
            }]
        }, {
            "featureType": "road",              // road labels are grey
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "on"
            }, {
                "weight": 1
            }, {
                "color": "#7A7A7A"
            }]
        }, {
            "featureType": "road.arterial",    // road labels are light grey
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#545454"
            }]
        }, {
            "featureType": "road.highway",     // road labels are grey
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#545454"
            }]
        }, {
            "featureType": "poi.park",          // parks are light green
            "elementType": "geometry.fill",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#83cead"
            }]
        }, {
            "featureType": "water",
            "elementType": "labels.text",   // water labels are white
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#eeeeee"
            }, {
                "weight": 1
            }]
        }, {
            "featureType": "transit",
            "elementType": "labels.text",   // transit labels are grey
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#B8B8B8"
            }, {
                "weight": 1
            }]
        }, {
            "featureType": "poi",
            "elementType": "labels.text",   // poi labels are grey
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#B8B8B8"
            }, {
                "weight": 1
            }]
        }, {
            "featureType": "landscape",
            "elementType": "labels.text",   // poi labels are grey
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#B8B8B8"
            }, {
                "weight": 1
            }]
        }, {
            "featureType": "administrative",
            "elementType": "labels.text",    // administrative labels are grey
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#333333"
            }, {
                "weight": 1
            }]
        }, {
            "featureType": "landscape.man_made",
            "elementType": "geometry",
            "stylers": [{
                "weight": 0.9
            }, {
                "visibility": "off"
            }]
        }]

        // create new map object
        map = new google.maps.Map($('#maps')[0], myOptions);
        map.setOptions({styles: style});

        // get flat marker image
        var image = {
            url: 'https://dl.dropboxusercontent.com/u/814783/fiddle/marker.png',
            scaledSize: new google.maps.Size(20, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(12, 59)
        };
        // get flat marker shadow image
        var shadow = {
            url: 'https://dl.dropboxusercontent.com/u/814783/fiddle/shadow.png',
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(-2, 36)
        };
        // create marker
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: image,
            shadow: shadow
        });

        //marker.setMap(map);

        // set new marker if user clicked into the map
        google.maps.event.addListener(map, "click", function(e) {
            replaceMarker(e.latLng);
            currentLat = e.latLng.lat();
            currentLng = e.latLng.lng();
        });

        $("#btnConfirmMapCoordinates").on("click", function() {
            if (currentLat) {
                $("#inputContextParameter1")[0].value = currentLat;
            }
            if (currentLng) {
                $("#inputContextParameter2")[0].value = currentLng;
            }

        });

        // delete old and set new marker
        function replaceMarker(location) {
            marker.setMap(null);
            marker = new google.maps.Marker({
                position: location,
                map: map,
                icon: image,
                shadow: shadow
            });
        }
    }

    // resize map due to map opening
    function resizeMap() {
        if (typeof map == "undefined") return;
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    }

    google.maps.event.addDomListener(window, 'load', showMap);
    google.maps.event.addDomListener(window, "resize", resizeMap());

});
