import { FileExplorer } from "../editor/file_explorer.js"

/** @type {import("../../node_modules/blockly/index.js")} */ 
const Blockly = window.Blockly

const root = document.getElementById("root")
const workbench = new FileExplorer()
root.replaceWith(workbench.RootDirectory({
    type: "root",
    name: "Workbench",
    files:[
        {
            type: "📄script",
            name: "Scripts",
            color: "red",
            files:[
                {
                    type: "📄script",
                    name: "index.js",
                    content: "console.log('hello world')"
                },
                {
                    type: "📄script",
                    name: "main.js",
                    content: "console.log('hello world')"
                },
                {
                    type: "📄script",
                    name: "app.js",
                    content: "console.log('hello world')"
                }
            ]
        },
        {
            type: "🖼️picture",
            name: "Pictures",
            color: "green",
            files:[
                {
                    type: "🖼️picture",
                    name: "background.jpg",
                    content: "data:image/jpeg;base64,..."
                },
                {
                    type: "🖼️picture",
                    name: "logo.png",
                    content: "data:image/png;base64,..."
                }
            ]
        },
        {
            type: "🌟effects",
            name: "Effects",
            color: "orange",
            files:[
                {
                    type: "🌟effects",
                    name: "Zombified",
                    content: "data:application/json;base64,..."
                },
                {
                    type: "🌟effects",
                    name: "Vampire",
                    content: "data:application/json;base64,..."
                },
                {
                    type: "🌟effects",
                    name: "Werewolf",
                    content: "data:application/json;base64,..."
                }
            ]
        }
    ]
}).element)

/** @type {import("../../node_modules/blockly/core/utils/toolbox.js").ToolboxInfo} */ 
const toolbox = {
    kind: 'categoryToolbox',
    contents: [
        {
            kind: 'category',
            name: 'Variable',
            contents:[
                {
                    kind: 'block',
                    type: 'variables_get'
                },
                {
                    kind: 'block',
                    type: 'variables_set'
                },
            ]
        },
        {
            kind: 'category',
            name: 'Control Flow',
            contents:[
                {
                    kind: 'block',
                    type: 'controls_if'
                },
                {
                    kind: 'block',
                    type: 'controls_repeat_ext'
                },
                {
                    kind: 'block',
                    type: 'controls_whileUntil'
                },
                {
                    kind: 'block',
                    type: 'controls_for',
                    inputs: {
                        FROM: { block: { type: 'math_number' } },
                        TO: { block: { type: 'math_number' } },
                        BY: { block: { type: 'math_number', fields: {NUM:1} } }
                    }
                },
                {
                    kind: 'block',
                    type: 'controls_forEach'
                },
                {
                    kind: 'block',
                    type: 'controls_flow_statements'
                }
            ]
        },
        {
            kind: 'category',
            name: 'Logic',
            contents:[
                {
                    kind: 'block',
                    type: 'logic_compare'
                },
                {
                    kind: 'block',
                    type: 'logic_operation'
                },
                {
                    kind: 'block',
                    type: 'logic_negate'
                },
                {
                    kind: 'block',
                    type: 'logic_boolean'
                },
            ]
        },
        {
            kind: 'category',
            name: 'Math',
            contents:[
                {
                    kind: 'block',
                    type: 'math_number'
                },
                {
                    kind: 'block',
                    type: 'math_arithmetic'
                },
                {
                    kind: 'block',
                    type: 'math_single'
                },
                {
                    kind: 'block',
                    type: 'math_trig'
                },
                {
                    kind: 'block',
                    type: 'math_constant'
                },
                {
                    kind: 'block',
                    type: 'math_number_property'
                },
                {
                    kind: 'block',
                    type: 'math_round'
                },
                {
                    kind: 'block',
                    type: 'math_on_list'
                },
                {
                    kind: 'block',
                    type: 'math_modulo'
                },
                {
                    kind: 'block',
                    type: 'math_constrain'
                },
                {
                    kind: 'block',
                    type: 'math_random_int'
                },
                {
                    kind: 'block',
                    type: 'math_random_float'
                },
            ]
        },
        {
            kind: 'category',
            name: 'Text',
            contents:[
                {
                    kind: 'block',
                    type: 'text'
                },
                {
                    kind: 'block',
                    type: 'text_join'
                },
                {
                    kind: 'block',
                    type: 'text_append'
                },
                {
                    kind: 'block',
                    type: 'text_length'
                },
                {
                    kind: 'block',
                    type: 'text_isEmpty'
                },
                {
                    kind: 'block',
                    type: 'text_indexOf'
                },
                {
                    kind: 'block',
                    type: 'text_charAt'
                },
                {
                    kind: 'block',
                    type: 'text_getSubstring'
                },
                {
                    kind: 'block',
                    type: 'text_changeCase'
                },
                {
                    kind: 'block',
                    type: 'text_trim'
                },
                {
                    kind: 'block',
                    type: 'text_print'
                },
            ]
        },
        {
            kind: 'category',
            name: 'Lists',
            contents:[
                {
                    kind: 'block',
                    type: 'lists_create_with'
                },
                {
                    kind: 'block',
                    type: 'lists_create_empty'
                },
                {
                    kind: 'block',
                    type: 'lists_repeat'
                },
                {
                    kind: 'block',
                    type: 'lists_length'
                },
                {
                    kind: 'block',
                    type: 'lists_isEmpty'
                },
                {
                    kind: 'block',
                    type: 'lists_indexOf'
                },
                {
                    kind: 'block',
                    type: 'lists_getIndex'
                },
                {
                    kind: 'block',
                    type: 'lists_setIndex'
                },
                {
                    kind: 'block',
                    type: 'lists_getSublist'
                },
                {
                    kind: 'block',
                    type: 'lists_split'
                },
                {
                    kind: 'block',
                    type: 'lists_sort'
                },
            ]
        }

    ],
  };

  Blockly.inject('blocklyDiv', {
    toolbox: toolbox,
    media: '/media/',
    scrollbars: true,
    horizontalLayout:false,
    toolboxPosition: "end",
  });