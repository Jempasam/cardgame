import { Blockly, Javascript } from "./utils/blockly.mjs"
import { quickCustomBlock } from "./utils/helpers.mjs"



export const JAUGE_TYPE_STATES = quickCustomBlock({
    name: "jauge_type",
    texts: ["un type de jauge", "le type de jauge", "du type de jauge"],
    type: "JaugeType",
    color: 0,
    helpUrl: "",
    constructor: {nom:"String", couleur:"Color", minimum:"Number", maximum:"Number", 'valeur de base':"Number"},
    members: [
        ["minimum", "minimum", "Number", "Read"],
        ["maximum", "maximum", "Number", "Read"],
        ["valeur de base", "default_value", "Number", "Read"],
        ["couleur", "color", "Color", "Read"],
        ["nom", "name", "String", "Read"]
    ]
})

export const JAUGE_STATES = quickCustomBlock({
    name: "jauge",
    texts: ["une jauge", "la jauge", "de la jauge"],
    type: "Jauge",
    color: 0,
    helpUrl: "",
    constructor: {type:"JaugeType"},
    members:[]
})

/** @type {import("./addon.js").BlocklyAddon} */
export default {
    toolbox:[
        {
            kind: "category",
            name: "Jauge",
            contents: [
                ...JAUGE_TYPE_STATES,
                ...JAUGE_STATES
            ]
        }
    ]
} 

/*Blockly.defineBlocksWithJsonArray([
    {
        type: "create_jauge_type",
        tooltip: "créer une jauge utilisable par des cartes, la ressource du fichier devient cette jauge",
        helpUrl: "",
        message0: "créer une jauge %1 name %2 couleur %3 minimum %4 maximum %5 default %6",
        args0: [
            { type: "input_dummy", name: "DUMMY" },
            { type: "input_value", name: "NAME",    align: "RIGHT", check: "String" },
            { type: "input_value", name: "COLOR",   align: "RIGHT", check: "Color" },
            { type: "input_value", name: "MINIMUM", align: "RIGHT", check: "Number" },
            { type: "input_value", name: "MAXIMUM", align: "RIGHT", check: "Number" },
            { type: "input_value", name: "DEFAULT", align: "RIGHT", check: "Number" },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 0
      }
])

Javascript.javascriptGenerator.forBlock["create_jauge_type"] = function(block,generator){
    return `new JaugeType(
        ${generator.valueToCode(block,"MINIMUM",0)},
        ${generator.valueToCode(block,"MAXIMUM",0)},
        ${generator.valueToCode(block,"DEFAULT",0)},
        ${generator.valueToCode(block,"COLOR",0)},
        ${generator.valueToCode(block,"NAME",0)},
    )`
}*/