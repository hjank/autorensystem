/**
 * Created by juliushofler on 06.04.15.
 */


function getContextInfoList(fromURL, callback) {

    // http://localhost:9998/xml/get-context-information
    // build url
    var domain = "localhost";
    var port = "9998";
    var uri = "/xml/get-context-information";
    var url = "http://" + domain + ":" + port + uri;

    // get context information from xml file
    $.ajax({
        type: "GET",
        url: fromURL ? url : "measurable-context-information.xml",
        dataType: "xml",

        // if file is available parse out all information
        success: function(xml) {
            parseContextInfoXML(xml);
            (typeof callback == "function" && callback());
        }
    });
}

function parseContextInfoXML (xml) {

    var contextInfoList = [];

    // parse all needed information from the xml file
    $('information', xml).each(function() {

        var newInfo = new ContextInformation();

        /* get the ID of the information */
        var id = this.getAttribute("id");
        var multiple = this.hasAttribute("multiplicity");

        /* get the context classes from the current information */
        var array_classes = [];
        $('contextClasses', this).children().each(function() {
            array_classes.push(this.getAttribute("id"));
        });


        /* get the context values from the current information */
        var contextValue = $('contextValue', this);

        // 1. type of context value
        // get border minimum if given, else null
        // get border maximum if given, else null
        // get default value if given, else null
        var type = contextValue[0].getAttribute("type");
        var min = contextValue[0].getAttribute("min");
        var max = contextValue[0].getAttribute("max");
        var def = contextValue[0].getAttribute("default");


        // 2. all possible operators
        var array_operators = [];
        contextValue.children("operators").children().each(function() {
            array_operators.push(this.getAttribute("id"));
        });


        // 3. all possible values (boolean choices are treated as enums)
        var array_possibleValues = [];
        if (type == "BOOLEAN")
            array_possibleValues = ["TRUE", "FALSE"];
        else
            contextValue.children("possibleValues").children().each(function() {
                array_possibleValues.push(this.innerHTML);
            });

        /* get the parameters (if parameter section exists) */
        var array_parameters = [];
        // for each parameter
        $('parameters', this).children("parameter").each(function() {

            var newParam = new Parameter();

            // get id of parameter
            var pid = this.getAttribute("id");

            // all parameter values
            var paraValue = $(this).children("parameterValue");
            paraValue.each(function() {

                // get each parameter' specs
                var type = this.getAttribute("type");
                var min = this.getAttribute("min");
                var max = this.getAttribute("max");
                var def = this.getAttribute("default");
                var array_paramValues = [];

                // get enums if given
                if (type == "ENUM") {
                    // get the only possible values for this parameter
                    paraValue.children("possibleValues").children("value").each(function() {
                        array_paramValues.push(this.innerHTML);
                    });
                }

                newParam.setID(pid);
                newParam.setType(type);
                newParam.setMin(min);
                newParam.setMax(max);
                newParam.setDefault(def);
                newParam.setEnums(array_paramValues);

                // push all parameters into an array
                array_parameters.push(newParam);
            });
        });

        newInfo.setID(id);
        newInfo.setMultiplicity(multiple);
        newInfo.setClasses(array_classes);
        newInfo.setType(type);
        newInfo.setMin(min);
        newInfo.setMax(max);
        newInfo.setDefault(def);
        newInfo.setOperators(array_operators);
        newInfo.setEnums(array_possibleValues);
        newInfo.setParameters(array_parameters);

        // gather all information
        contextInfoList.push(newInfo);
    });

    contextList.setItems(contextInfoList);
}