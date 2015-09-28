/**
 * Created by juliushofler on 06.04.15.
 */


function parseContextInfoXML () {

    // http://localhost:9998/xml/get-context-information
    // build url
    var domain = "localhost";
    var port = "9998";
    var uri = "/xml/get-context-information";
    var url = "http://" + domain + ":" + port + uri;

    // get context information from xml file
    $.ajax({
        type: "GET",
        url: "measurable-context-information.xml",
        //url: url,
        dataType: "xml",

        // if file is available parse out all information
        success: function(xml) {

            var contextInfoList = [];

            // parse all needed information from the xml file
            $('information', xml).each(function() {


                /* get the name of the information */
                var name = this.getAttribute("id");


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
                var contextValueAttributes = {
                    type:contextValue[0].getAttribute("type"),
                    min:contextValue[0].getAttribute("min"),
                    max:contextValue[0].getAttribute("max"),
                    default:contextValue[0].getAttribute("default")
                };


                // 2. all possible operators
                var array_operators = [];
                contextValue.children("operators").children().each(function() {
                    array_operators.push(this.getAttribute("id"));
                });


                // 3. all possible values
                var array_possibleValues = [];
                contextValue.children("possibleValues").children().each(function() {
                    array_possibleValues.push(this.innerHTML);
                });


                // combine attributes, operators, and possible values in one object
                var value = {
                    attributes:contextValueAttributes,
                    operators:array_operators,
                    enums:array_possibleValues
                };


                /* get the parameters (if parameter section exists) */
                var array_parameters = [];
                // for each parameter
                $('parameters', this).children("parameter").each(function() {

                    // get id of parameter
                    var pid = this.getAttribute("id");

                    var array_paramValues = [];
                    // all parameter values
                    var paraValue = $(this).children("parameterValue");
                    paraValue.each(function() {
                        // get the type of each parameter value
                        var type = this.getAttribute("type");
                        // different types have different values
                        switch (type) {
                            case "ENUM":
                                // get the only possible values for this parameter
                                paraValue.children("possibleValues").children("value").each(function() {
                                    array_paramValues.push(this.innerHTML);
                                });
                                break;
                            case "FLOAT":
                                // floats have always a minimum and maximum value
                                array_paramValues.push({
                                    min:this.getAttribute("min"),
                                    max:this.getAttribute("max")
                                });
                                break;
                            case "INTEGER":
                            case "STRING":
                                break;
                        }

                        // push all parameters into an array
                        array_parameters.push({
                            id:pid,
                            type:type,
                            values:array_paramValues
                        });
                    });
                });

                // gather all information
                contextInfoList.push({
                    name:name,
                    classes:array_classes,
                    value:value,
                    parameters:array_parameters
                });
            });

            contextList.setItems(contextInfoList);
        }
    });
}