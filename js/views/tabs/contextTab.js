/**
 * Created by Helena on 06.09.2015.
 */

// fill selection bars in tab "Kontextinformation"
/**
 * Function sets a event listener for selection bar context information after parsing is finished.
 * In this listener all selections and input fields were filled.
 * Furthermore the meta data selection bar is also filled with information.
 * */
function fillContextTab() {

    /* tab "Kontextinformation" */
    // triggered if a context information was selected
    $("#selectContextInfos").select2().on("select2-selecting", function(e) {
        // get index (value) of the selected option
        var j = e.val;

        // get the corresponding operators to the selected context information
        var operators = array_ContextInformations[j][2][1];

        // clear selection bar
        $("#selectOperator").empty();
        $("#selectPossibleValues").empty();

        // set empty field in selected start field
        $("#selectOperator").select2("data", {id:"\r",text:"\r"});
        $("#selectPossibleValues").select2("data", {id:"\r",text:"\r"});

        // fill selection bar "Operator"
        for (var i=0; i<operators.length; i++) {
            var option = $("<option>").attr("value", i.toString());
            option.html(operators[i]["translation"]);
            option.attr("origin", operators[i]["original"]);
            $("#selectOperator").append(option);
        }

        // fill input field
        fillInputField(array_ContextInformations[j][2]);

        // fill parameter selection bar
        fillParameterSelection(array_ContextInformations[j][3]);
    });
}