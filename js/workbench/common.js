import { mergeAddons } from "./addon.js"
import auto_complete from "./auto_complete.js"
import { Blockly, getBlocksInToolbox } from "./utils/blockly.mjs"
import color from "./color.js"


/** @type {import("./addon.js").BlocklyAddon} */ 
export default mergeAddons(
    auto_complete,
    color,
    {
        toolbox: [
            {
                kind: "category",
                name: "🔎Transform",
                custom: "GETTER_COMPLETE"
            },
            {
                kind: "category",
                name: "🔍Parameters",
                custom: "INPUT_COMPLETE"
            },
            {
                kind: 'category',
                name: 'Variable',
                custom: "VARIABLE"
            },
            {
                kind: "category",
                name: "Condition",
                contents: [
                    { kind: 'block', type: 'controls_if' },
                    { kind: 'block', type: 'controls_if', extraState: { hasElse: true } },
                    { kind: 'block', type: 'controls_if', extraState: { hasElse: true, elseIfCount:1 } },
                ]
            },
            {
                kind: 'category',
                name: 'Boucles',
                contents:[
                    { kind: 'block', type: 'controls_repeat_ext' },
                    { kind: 'block', type: 'controls_repeat_ext', inputs:{TIMES:{shadow:{type:"math_number",fields: {NUM:10}}}} },
                    { kind: 'block', type: 'controls_whileUntil' },
                    { kind: 'block', type: 'controls_for', 
                        inputs: {
                            FROM: { shadow: { type: 'math_number' } },    
                            TO: { shadow: { type: 'math_number' } }, 
                            BY: { shadow: { type: 'math_number', fields: {NUM:1} } }
                        }
                    },
                    { kind: 'block', type: 'controls_forEach'},
                    { kind: 'block', type: 'controls_flow_statements'
                    }
                ]
            },
            {
                kind: 'category',
                name: 'Logic & Boolean',
                contents:[
                    { kind: 'block', type: 'logic_boolean'},
                    { kind: 'block', type: 'logic_compare'},
                    { kind: 'block', type: 'logic_operation', fields: {OP: 'AND'}},
                    { kind: 'block', type: 'logic_operation', fields: {OP: 'OR'}},
                    { kind: 'block', type: 'logic_negate'},
                ]
            },
            {
                kind: 'category',
                name: 'Math & Number',
                contents:[
                    { kind: 'block', type: 'math_number'},
                    { kind: 'block', type: 'math_arithmetic'},
                    { kind: 'block', type: 'math_single'},
                    { kind: 'block', type: 'math_trig'},
                    { kind: 'block', type: 'math_constant'},
                    { kind: 'block', type: 'math_number_property'},
                    { kind: 'block', type: 'math_round'},
                    { kind: 'block', type: 'math_on_list'},
                    { kind: 'block', type: 'math_modulo'},
                    { kind: 'block', type: 'math_constrain'},
                    { kind: 'block', type: 'math_random_int'},
                    { kind: 'block', type: 'math_random_float'},
                ]
            },
            {
                kind: 'category',
                name: 'Text',
                contents:[
                    { kind: 'block', type: 'text'},
                    { kind: 'block', type: 'text_join'},
                    { kind: 'block', type: 'text_append'},
                    { kind: 'block', type: 'text_length'},
                    { kind: 'block', type: 'text_isEmpty'},
                    { kind: 'block', type: 'text_indexOf'},
                    { kind: 'block', type: 'text_charAt'},
                    { kind: 'block', type: 'text_getSubstring'},
                    { kind: 'block', type: 'text_changeCase'},
                    { kind: 'block', type: 'text_trim'},
                    { kind: 'block', type: 'text_print'},
                ]
            },
            {
                kind: 'category',
                name: 'Lists',
                contents:[
                    { kind: 'block', type: 'lists_create_with'},
                    { kind: 'block', type: 'lists_create_empty'},
                    { kind: 'block', type: 'lists_repeat'},
                    { kind: 'block', type: 'lists_length'},
                    { kind: 'block', type: 'lists_isEmpty'},
                    { kind: 'block', type: 'lists_indexOf'},
                    { kind: 'block', type: 'lists_getIndex'},
                    { kind: 'block', type: 'lists_setIndex'},
                    { kind: 'block', type: 'lists_getSublist'},
                    { kind: 'block', type: 'lists_split'},
                    { kind: 'block', type: 'lists_sort'},
                ]
            },
            {
                kind: "category",
                name: "Functions",
                custom: "PROCEDURE"
            }
        ]
    }
)