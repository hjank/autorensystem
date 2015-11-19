/**
 * Created by Helena on 04.09.2015.
 */



// the list of all available context information data types
function ContextInformation() {

    this._name = "";
    this._classes = [];
    this._value = {
        attributes:{
            type:"",
            min:"",
            max:"",
            default:""
        },
        operators:[],
        enums:[]
    };
    this._parameters = [];

    return this;
}


function Parameter() {
    this._id = "";
    this._type = "";
    this._values = [];

    return this;
}