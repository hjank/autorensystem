
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

        var metaIcon = chooseMetaIcon(unit["metaData"][l]["name"]);
        divMetaIcon.attr("title", unit["metaData"][l]["name"]);

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


function chooseMetaIcon(metaDataName) {
    switch (metaDataName) {
        case "Bild":
            return "fui-photo";
        case "Film":
            return "fui-video";
        case "Text":
            return "fui-document";
        case "Navigation":
            return "fui-location";
        case "Test":
            return "fui-radio-unchecked";
        case "Audio":
            return "fui-volume";
    }
}
