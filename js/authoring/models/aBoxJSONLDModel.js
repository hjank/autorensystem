/**
 * Created by elis on 10.12.2015.
 */


// the to-be-generated a-box data model in JSON-LD
// formatted and validated with the help of: http://json-ld.org/playground/
function ABoxJSONLD() {

    // just a placeholder 
    this._typeId = {"@type": "@id"};

    // define the ontology's namespace which will remain just like this
    this._jsonLD = {
        "@context": {
            "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
            "xsd": "http://www.w3.org/2001/XMLSchema#",
            "owl": "http://www.w3.org/2002/07/owl#",
            "kno": "http://motivate-project.de/ontology/knowledge.owl#",
            "abox": "http://motivate-project.de/ontology/abox.owl#",
            "rdf:first": this._typeId,
            "rdf:type": this._typeId,
            "rdf:rest": this._typeId,
            "rdf:subject": this._typeId,
            "rdf:value": this._typeId,
            "rdf:predicate": this._typeId,
            "rdf:object": this._typeId,
            "rdfs:subClassOf": this._typeId,
            "rdfs:domain": this._typeId,
            "rdfs:subPropertyOf": this._typeId,
            "rdfs:seeAlso": this._typeId,
            "rdfs:range": this._typeId,
            "rdfs:member": this._typeId,
            "owl:minCardinality": {
                "@type": "xsd:nonNegativeInteger"
            },
            "owl:qualifiedCardinality": {
                "@type": "xsd:nonNegativeInteger"
            },
            "owl:annotatedTarget": this._typeId,
            "owl:seeAlso": this._typeId,
            "owl:cardinality": {
                "@type": "xsd:nonNegativeInteger"
            },
            "owl:hasSelf": this._typeId,
            "owl:onDatatype": this._typeId,
            "owl:onDataRange": this._typeId,
            "owl:differentFrom": this._typeId,
            "owl:someValuesFrom": this._typeId,
            "owl:disjointUnionOf": {
                "@type": "@id",
                "@container": "@list"
            },
            "owl:versionIRI": this._typeId,
            "owl:allValuesFrom": this._typeId,
            "owl:inverseOf": this._typeId,
            "owl:onProperty": this._typeId,
            "owl:priorVersion": this._typeId,
            "owl:complementOf": this._typeId,
            "owl:disjointWith": this._typeId,
            "owl:unionOf": {
                "@type": "@id",
                "@container": "@list"
            },
            "owl:maxCardinality": {
                "@type": "xsd:nonNegativeInteger"
            },
            "owl:withRestrictions": {
                "@type": "@id",
                "@container": "@list"
            },
            "owl:bottomDataProperty": {
                "@type": "rdfs:Literal"
            },
            "owl:propertyChainAxiom": {
                "@type": "@id",
                "@container": "@list"
            },
            "owl:sameAs": this._typeId,
            "owl:equivalentClass": this._typeId,
            "owl:equivalentProperty": this._typeId,
            "owl:members": {
                "@type": "@id",
                "@container": "@list"
            },
            "owl:incompatibleWith": this._typeId,
            "owl:intersectionOf": {
                "@type": "@id",
                "@container": "@list"
            },
            "owl:distinctMembers": {
                "@type": "@id",
                "@container": "@list"
            },
            "owl:sourceIndividual": this._typeId,
            "owl:bottomObjectProperty": this._typeId,
            "owl:topObjectProperty": this._typeId,
            "owl:hasKey": {
                "@type": "@id",
                "@container": "@list"
            },
            "owl:annotatedSource": this._typeId,
            "owl:onClass": this._typeId,
            "owl:onProperties": {
                "@type": "@id",
                "@container": "@list"
            },
            "owl:targetIndividual": this._typeId,
            "owl:assertionProperty": this._typeId,
            "owl:maxQualifiedCardinality": {
                "@type": "xsd:nonNegativeInteger"
            },
            "owl:datatypeComplementOf": this._typeId,
            "owl:backwardCompatibleWith": this._typeId,
            "owl:oneOf": {
                "@type": "@id",
                "@container": "@list"
            },
            "owl:targetValue": {
                "@type": "rdfs:Literal"
            },
            "owl:propertyDisjointWith": this._typeId,
            "owl:imports": this._typeId,
            "owl:annotatedProperty": this._typeId,
            "owl:minQualifiedCardinality": {
                "@type": "xsd:nonNegativeInteger"
            },
            "owl:topDataProperty": {
                "@type": "rdfs:Literal"
            }
        },
        "@graph": [
            {
                "@id": "http://motivate-project.de/ontology/abox.owl",
                "@type": "owl:Ontology",
                "owl:imports": "http://motivate-project.de/ontology/knowledge.owl"
            }
        ]
    };

    return this;
}

ABoxJSONLD.prototype.getContext = function () {
    return this._jsonLD["@context"];
};

ABoxJSONLD.prototype.getGraph = function () {
    return this._jsonLD["@graph"];
};

ABoxJSONLD.prototype.addToGraph = function (namedIndividualJSONLD) {
    this._jsonLD["@graph"].push(namedIndividualJSONLD);
};

ABoxJSONLD.prototype.containsIndividual = function (namedIndividualJSONLD) {
    var graph = this.getGraph();
    var contained = false;

    for (var i in graph) {
        var individual = graph[i];

        if (Object.keys(individual) != Object.keys(namedIndividualJSONLD))
            continue;

        contained = true;
        for (var key in individual) {
            // compare all key-value pairs, except for IDs, which are unique, thus always different
            if ((key != "@id") && (individual[key] != namedIndividualJSONLD[key]))
                contained = false;
        }
        if (contained)
            break;
    }

    return contained;
};


/*********** helper function used by ContextInformationModel and ParameterModel ************/

function formatJSONLDValue (type, chosenValue) {
    var jsonLD;
    switch (type) {
        case "FLOAT":
            jsonLD = {
                "@type" : "xsd:float"
            };
            break;
        case "INTEGER":
            jsonLD = {
                "@type" : "xsd:integer"
            };
            break;
        case "BOOLEAN":
            jsonLD = {
                "@type" : "xsd:boolean"
            };
            break;
        case "STRING":
        case "ENUM":
            break;
    }
    if (jsonLD)
        jsonLD["@value"] = chosenValue.toLowerCase();

    return (jsonLD || chosenValue);
}