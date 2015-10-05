/**
 * Created by Helena on 04.09.2015.
 */



// the list of all available context information data types
function ContextInformation() {

    this.name = "";
    this.classes = [];
    this.value = {
        attributes:{
            type:"",
            min:"",
            max:"",
            default:""
        },
        operators:[],
        enums:[]
    };
    this.parameters = [];

    return this;
}


function Parameter() {
    this.id = "";
    this.type = "";
    this.values = [];

    return this;
}