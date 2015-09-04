// global unit instance
var inst;
var i = 1;

// initialize jsPlumb instance if jsPlumb is ready
jsPlumb.ready(function () {
    inst = jsPlumb.getInstance({
        Endpoint: ["Dot", {radius: 2}],
        HoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 2 },
        ConnectionOverlays: [
            [ "Arrow", {
                location: 1,
                id: "arrow",
                length: 14,
                foldback: 0.8
            } ]
            //[ "Label", { label: "connecting", id: "label", cssClass: "aLabel" }]
        ],
        Container: "stm"
    });
});

// execute if jsPlum is ready
jsPlumb.ready(function () {

    // set state machine as container
    jsPlumb.setContainer($("#stm"));

    var j = 0;
    /*var inst = jsPlumb.getInstance({
        Endpoint: ["Dot", {radius: 2}],
        HoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 2 },
        ConnectionOverlays: [
            [ "Arrow", {
                location: 1,
                id: "arrow",
                length: 14,
                foldback: 0.8
            } ]
            //[ "Label", { label: "connecting", id: "label", cssClass: "aLabel" }]
        ],
        Container: "stm"
    });*/

    // triggered before connection is set to prevent drawing a self loop
    inst.bind("beforeDrop", function (con) {
        // source and target ID's are same
        if (con.sourceId === con.targetId) {
            return false;

        } else {
            return true;
        }
    });

    // triggered if a connection was drawn between to units
    inst.bind("connection", function (con) {

        // only use if scenario name is set (don't access at loading scenario)
        if ( $("#lname")[0].innerHTML.length != 0 ) {
            // get current scenario name
            var currentScenario = $("#lname")[0].innerHTML;

            // add connection in JSON structure
            for (var n=0; n<myAuthorSystem.length; n++) {
                if (myAuthorSystem[n].name == currentScenario) {
                    myAuthorSystem[n]["connections"].push({
                        sourceId:con.sourceId,
                        targetId:con.targetId,
                        connId:con.connection.id,
                        connLabel: "PRE",
                        connTitle: "Voraussetzung (PRE)"
                    });
                    // add label to connection
                    con.connection.addOverlay([ "Label", { label: "PRE", id: "label", cssClass: "aLabel" }]);

                    // add title to label
                    var label = con.connection.getOverlay("label");
                    var labelID = $(label)[0].canvas.id;
                    $("#" + labelID)[0].setAttribute("title", "Vorausetzung (PRE)");
                    break;
                }
            }
        }
    });

    var current_labelConnection;
    var current_connection;

    // triggered if connection or label is clicked
    // c = connection element
    // e = event
    inst.bind("click", function (c, e) {

        // if label was clicked show tab information
        if (c.id == "label") {

            // get name of source and target unit
            var sourceUnit = c._jsPlumb.component.source.textContent;
            var targetUnit = c._jsPlumb.component.target.textContent;

            // add names in relations labels
            $("#preLabelRelations").html(sourceUnit + " ist eine");
            $("#postLabelRelations").html("für " + targetUnit);

            // update current label
            current_labelConnection = c.canvas.id;

            // store current connection
            current_connection = c;

            // clear marking from label connections
            $(".aLabel").css("background-color", "");
            $(".aLabel").css("color", "");

            // set label connection mark
            $("#" + c.canvas.id).css("background-color", "#1e8151");
            $("#" + c.canvas.id).css("color", "white");

            // clear unit marking and hide unit properties
            $(".w").css("background", "");
            $(".w").css("color", "");
            $(".tabContents").hide();
            $(".tab-Container").hide();

            // set label connection property visible
            $("#tabUnitLabel").css("display", "block");

            // show right selection of the current label in selection bar
            $("#selectRelations").children("option").each(function() {
                if ( $(this)[0].value.toUpperCase() == c.canvas.innerText ) {
                    $("#selectRelations").select2("data", {id:$(this)[0].value, text:$(this)[0].innerHTML});
                }
            });

            // needed to prevent clicking the container as well
            e.stopPropagation();

        // if connection was clicked, delete it
        }
        /*else {
            // detach all connections
            inst.detach(c);

            // get id and current scenario name
            var connID = c.id;
            var currentScenario = $("#lname")[0].innerHTML;

            // delete connection in JSON structure
            for (var n=0; n<myAuthorSystem.length; n++) {
                if (myAuthorSystem[n].name == currentScenario) {
                    for (var l=0; l<myAuthorSystem[n]["connections"].length; l++) {
                        if (myAuthorSystem[n]["connections"][l].connId == connID) {
                            myAuthorSystem[n]["connections"].splice(l, 1);
                            break;
                        }
                    }
                    break;
                }
            }
        }*/
    });

    // deletes selected connection
    $("#btnDeleteConnection").on("click", function() {

        // get connection object
        var con = $("#" + current_labelConnection)[0]._jsPlumb.component;

        // detach connection
        inst.detach(con);

        // get id and current scenario name
        var connID = con.id;
        var currentScenario = $("#lname")[0].innerHTML;

        // delete connection in JSON structure
        for (var n=0; n<myAuthorSystem.length; n++) {
            if (myAuthorSystem[n].name == currentScenario) {
                for (var l=0; l<myAuthorSystem[n]["connections"].length; l++) {
                    if (myAuthorSystem[n]["connections"][l].connId == connID) {
                        myAuthorSystem[n]["connections"].splice(l, 1);
                        break;
                    }
                }
                break;
            }
        }

        // hide tab after connection was deleted
        $("#tabUnitLabel").hide();
    });

    // triggered if an option for a label connection was selected
    $("#selectRelations").select2().on("select2-selecting", function(e) {
        // set new name on label
        $("#" + current_labelConnection).html(e.val.toUpperCase());
        $("#" + current_labelConnection)[0].setAttribute("title", e.choice.text);

        // unmark label
        $("#" + current_labelConnection).css("background-color", "");
        $("#" + current_labelConnection).css("color", "");

        // hide property in tab
        $("#tabUnitLabel").hide();

        // get connection id and scenario name
        var connID = $("#" + current_labelConnection)[0]._jsPlumb.component.id;
        var currentScenario = $("#lname")[0].innerHTML;

        // put label text in JSON structure
        for (var m=0; m<myAuthorSystem.length; m++) {
            if (myAuthorSystem[m].name == currentScenario) {
                for (var p=0; p<myAuthorSystem[m]["connections"].length; p++) {
                    if (myAuthorSystem[m]["connections"][p].connId == connID) {
                        myAuthorSystem[m]["connections"][p].connLabel = e.val.toUpperCase();
                        myAuthorSystem[m]["connections"][p].connTitle = e.choice.text;
                        break;
                    }
                }
            }
        }
    });

    // delete current unit + connections in tab "Eigenschaften"
    $("#btnDeleteUnit").on("click", function() {

        // get unit name from inout field
        var unitName = $("#inputUnitName")[0].value;

        // find right unit
        $("#stm").children("div.w").children("div.title").each(function() {
            if (this.innerHTML == unitName) {
                // get unit id
                var unitID = $(this).parent()[0].getAttribute("id");

                // delete all connections
                inst.detachAllConnections($("#" + unitID));

                // delete unit
                $(this).parent().remove();
            }
        });
    });

    // delete one or more units + connections in modal window "Lernszenarien löschen"
    $("#btnDeleteUnits2").on("click", function() {

        // get all selected units which should be deleted from multi selection bar
        var list_deleteableUnits = $("#selectMultiDeleteUnits").select2("data");

        for (var i=0; i<list_deleteableUnits.length; i++) {
            // get unit id
            var unitID = list_deleteableUnits[i].id;

            // delete all connections
            inst.detachAllConnections($("#" + unitID));

            // delete unit in state machine
            $("#" + unitID).remove();
        }
    });

    // triggered if add unit (plus icon) or create new unit in navigation bar was clicked
    $('#navadd,#createLearnUnit').click(function(e) {

        /* if loaded sceanrio */
        // get last id number
        var max = 0;
        $("#stm").children("div.w").each(function() {
            var id = parseInt($(this)[0].getAttribute("id").slice(-1));
            if (id > max) {
                max = id;
            }
        });
        // prevent that two unit have the same id
        max = max + 1;

        // build unit DOM
        var newState = $('<div>').attr('id', 'state' + max).addClass('w');
        var title = $('<div>').addClass('title').css("padding", "0px 7px");
        var stateName = $('<input>').attr('type', 'text').css("color", "#34495e");
        title.append(stateName);

        // add div for context information icons
        var divContextIcons = $("<div>").addClass("unit-icons");

        // create connection point
        var ep = $('<div>').addClass('ep');

        window.jsp = inst;
        var windows = jsPlumb.getSelector("#stm .w");

        // add elements to unit DOM
        newState.append(divContextIcons);
        newState.append(title);
        newState.append(ep);

        // add unit DOM to state machine
        $('#stm').append(newState);

        var nameSet = false;

        // if the unit name was written and enter was clicked
        stateName.keyup(function(e) {
            if (e.keyCode === 13) {

                // set unit name
                $(this).parent().text(this.value);

                // set event listeners
                activateFunctionalities(newState);

                // set the new unit as current unit name
                global_currentInputUnitName = this.value;

                // add learning unit in menu bar
                var nameCurrentScenario = $("#lname")[0].innerText;
                var liCurrentScenario;

                // find correct scenario in menu
                $("span.title").each(function() {
                    if ($(this)[0].innerText == nameCurrentScenario) {
                        liCurrentScenario = $(this);
                    }
                });

                // build DOM for menu bar
                var ulCurrentScenario;
                var liNewUnit = $("<li>").addClass("last");
                var aNewUnit = $("<a>").attr("href", "#");
                var spanNewUnit = $("<span>");
                liCurrentScenario = liCurrentScenario.parent("a").parent("li");

                // necessary if the running scenario has a unit already
                if (liCurrentScenario.hasClass("has-sub")) {

                    // get unit list
                    ulCurrentScenario = liCurrentScenario.children("ul");

                    // add unit in menu bar
                    spanNewUnit[0].innerText = this.value;
                    aNewUnit.append(spanNewUnit);
                    liNewUnit.append(aNewUnit);
                    ulCurrentScenario.append(liNewUnit);
                }

                // necessary if the running scenario has no units
                if (liCurrentScenario.hasClass("last")) {

                    // create list DOM
                    ulCurrentScenario = $("<ul>").attr("style", "display:none");

                    // editing scenario DOM
                    liCurrentScenario.removeClass("last");
                    liCurrentScenario.addClass("active");
                    liCurrentScenario.addClass("has-sub");

                    // append content name on DOM
                    spanNewUnit[0].innerText = this.value;
                    aNewUnit.append(spanNewUnit);
                    liNewUnit.append(aNewUnit);
                    ulCurrentScenario.append(liNewUnit);
                    liCurrentScenario.append(ulCurrentScenario);

                    // append a holder to toggle the menu bar
                    liCurrentScenario.children("a").append('<span class="holder"></span>');

                    // get the functionalities into the menu bar
                    liCurrentScenario.children("a").click(function() {
                        $(this).removeAttr('href');
                        var element = $(this).parent('li');

                        if (element.hasClass('open')) {
                            element.removeClass('open');
                            element.find('li').removeClass('open');
                            element.find('ul').slideUp();
                        }
                        else {
                            element.addClass('open');
                            element.children('ul').slideDown();
                            element.siblings('li').children('ul').slideUp();
                            element.siblings('li').removeClass('open');
                            element.siblings('li').find('li').removeClass('open');
                            element.siblings('li').find('ul').slideUp();
                        }
                    });
                }

                // update JSON structure
                // get new unit in its scenario
                for (var k=0; k<myAuthorSystem.length; k++) {
                    if (myAuthorSystem[k]["name"] == nameCurrentScenario) {
                        myAuthorSystem[k]["units"].push(
                            {   name:this.value,            // displayed name
                                description:"",             // description of the unit
                                sat:"all",                  // how much context information have to be satisfied
                                contextInformations:[],     // list of containing context information
                                metaData:[],                // list of containing meta data
                                //connections:[],           // list of connections with other units
                                posX:0,                     // absolute X position in the displayed container
                                posY:0                      // absolute Y position in the displayed container
                            }
                        );
                    }
                }

                // hide tabs because all units will be unmarked
                $(".tabContents").hide();

                nameSet = true;
            }

            // to set the source and target points, it is necessary to wait until the name was entered
            // --> prevent the wrong placement of the dots
            if (nameSet) {

                // make the unit draggable
                inst.draggable(newState, {
                    //containment: 'parent'
                    containment: '.body'
                });

                // set target point
                inst.makeTarget(newState, {
                    anchor: "Continuous",
                    dropOptions: { hoverClass: "dragHover" },
                    allowLoopback: false
                });

                // set source point
                inst.makeSource(ep, {
                    parent: newState,
                    anchor: "Continuous",
                    connector: [ "StateMachine", { curviness: 20 } ],
                    connectorStyle: { strokeStyle: "#5c96bc", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4 }
                });

                nameSet = false;
            }

        });

        // set focus pn input field
        stateName.focus();

        j++;

        // if in state machine was scrolled, all elements have to be repainted
        $("#stm").on("scroll", function() {
            inst.repaintEverything();
        });

    });

});
