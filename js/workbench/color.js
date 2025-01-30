import { css_to_rgb } from "../utils/color.js"
import { Blockly, Javascript } from "./utils/blockly.mjs"

/** @type {import("./addon.js").BlocklyAddon} */
export default {
    toolbox:[
        {
            kind: "category",
            name: "Couleur",
            contents: [
                { kind: 'block', type: 'color'},
                { kind: 'block', type: 'color_from_string', inputs: {VALUE:{shadow:{type:"text",fields:{TEXT:"red"}}}} }
            ]
        }
    ]
} 



//// COLOR LITERAL ////
Blockly.defineBlocksWithJsonArray([
    {
        type: "color",
        tooltip: "Une couleur",
        helpUrl: "https://www.wikiwand.com/fr/articles/Couleur",
        message0: "couleur %1",
        args0: [
            { type: "field_colour", name: "VALUE", colour: "#ff0000" }
        ],
        output: "Color",
        colour: 285
    }    
])

Javascript.javascriptGenerator.forBlock["color"] = function(block,generator){
    const rgb = css_to_rgb(block.getFieldValue("VALUE"))
    return [`[${rgb[0]}, ${rgb[1]}, ${rgb[2]}]`, Javascript.Order.ATOMIC]
}



//// FROM STRING ////
Blockly.defineBlocksWithJsonArray([
    {
        type: "color_from_string",
        tooltip: "Obtenir une couleur à partir d'un nom de couleur.",
        helpUrl: "https://www.wikiwand.com/fr/articles/Couleur_du_Web",
        message0: "couleur nommée %1",
        args0: [
            { type:"input_value", name:"VALUE", align:"RIGHT", check:"String" }
        ],
        output: "Color",
        colour: 285
    }    
])

Javascript.javascriptGenerator.forBlock["color_from_string"] = function(block,generator){
    return [
        `css_to_rgb(${generator.valueToCode(block,"VALUE",0)||"red"})`, 
        Javascript.Order.ATOMIC
    ]
}