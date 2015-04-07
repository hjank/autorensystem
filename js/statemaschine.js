var i = 1;

jsPlumb.ready(function () {

    // setup some defaults for jsPlumb.
    /*var instance = jsPlumb.getInstance({
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
        Container: "statemaschine"
    });

    window.jsp = instance;

    var windows = jsPlumb.getSelector(".statemaschine .w");

    // initialise draggable elements.
    instance.draggable(windows);

    // bind a click listener to each connection; the connection is deleted. you could of course
    // just do this: jsPlumb.bind("click", jsPlumb.detach), but I wanted to make it clear what was
    // happening.
    instance.bind("click", function (c) {
        instance.detach(c);
        alert("2");
    });

    // bind a connection listener. note that the parameter passed to this function contains more than
    // just the new connection - see the documentation for a full list of what is included in 'info'.
    // this listener sets the connection's internal
    // id as the label overlay's text.
    instance.bind("connection", function (info) {
        //info.connection.getOverlay("label").setLabel(info.connection.id);
        info.connection.getOverlay("label").setLabel(i.toString());
        i = i + 1;
        //alert("3");
    });

    // suspend drawing and initialise.
    instance.batch(function () {
        instance.makeSource(windows, {
            filter: ".ep",
            anchor: "Continuous",
            connector: [ "StateMachine", { curviness: 20 } ],
            connectorStyle: { strokeStyle: "#5c96bc", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4 },
            maxConnections: 5,
            onMaxConnections: function (info, e) {
                alert("Maximum connections (" + info.maxConnections + ") reached");
            }
        });

        // initialise all '.w' elements as connection targets.
        instance.makeTarget(windows, {
            dropOptions: { hoverClass: "dragHover" },
            anchor: "Continuous",
            allowLoopback: true
        });

        // and finally, make a couple of connections
        instance.connect({ source: "opened", target: "phone1" });
        //instance.connect({ source: "phone1", target: "phone1" });
        instance.connect({ source: "phone1", target: "infers" });
    });

    jsPlumb.setContainer("statemaschine");

    jsPlumb.fire("jsPlumbLoaded", instance);*/


    /* create new instances */
    var j = 0;
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

    $('#navadd,#createLearnUnit').click(function(e) {

        var newState = $('<div>').attr('id', 'state' + j).addClass('w');
        var title = $('<div>').addClass('title').css("padding", "7px");
        var stateName = $('<input>').attr('type', 'text');
        title.append(stateName);

        //var connect = $('<div>').addClass('connection');
        var ep = $('<div>').addClass('ep');

        /*newState.css({
         'top': e.pageY,
         'left': e.pageX
         });*/

        window.jsp = inst;

        var windows = jsPlumb.getSelector("#stm .w");

        newState.append(title);
        //newState.append(connect);
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
            //filter: ".ep",
            anchor: "Continuous",
            connector: [ "StateMachine", { curviness: 20 } ],
            connectorStyle: { strokeStyle: "#5c96bc", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4 }
        });


        newState.dblclick(function(e) {
            inst.detachAllConnections($(this));
            $(this).remove();
            e.stopPropagation();
        });

        stateName.keyup(function(e) {
            if (e.keyCode === 13) {
                //var state = $(this).closest('.item');
                //state.children('.title').text(this.value);
                $(this).parent().text(this.value);

                activateFunctionalities(newState);
                global_currentInputUnitName = this.value;

                /* NEW */
                // add learning unit in menu bar
                var nameCurrentScenario = $("#lname")[0].innerText;
                var liCurrentScenario = $("span.title").filter(":contains('" + nameCurrentScenario + "')");
                var ulCurrentScenario;
                var liNewUnit = $("<li>").addClass("last");
                var aNewUnit = $("<a>").attr("href", "#");
                var spanNewUnit = $("<span>")
                liCurrentScenario = liCurrentScenario.parent("a").parent("li");

                // necessary if the running scenario has a unit already
                if (liCurrentScenario.hasClass("has-sub")) {

                    ulCurrentScenario = liCurrentScenario.children("ul");

                    spanNewUnit[0].innerText = this.value;
                    aNewUnit.append(spanNewUnit);
                    liNewUnit.append(aNewUnit);
                    ulCurrentScenario.append(liNewUnit);
                }

                // necessary if the running scenario has no units
                if (liCurrentScenario.hasClass("last")) {

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

                /* END NEW*/
            }

        });

        stateName.focus();

        j++;
        jsPlumb.setContainer("stm");



    });

});
