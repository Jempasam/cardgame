import { Blockly, Javascript } from "../workbench/blockly.mjs"
import { FileExplorer, FILL, NOTHING } from "../editor/file_explorer.js"
import globalWorkbench, { registrerGlobalCategories } from "../workbench/global.js"

const root = document.getElementById("root")
const workbench = new FileExplorer()
const output = document.getElementById("output")
const directory = workbench.RootDirectory({
    type: "root",
    name: "Workbench",
    rights: NOTHING,
    files:[
        {
            type: "📄script",
            name: "Scripts",
            color: "red",
            rights: FILL,
            files:[
                {
                    type: "📄script",
                    name: "index.js",
                    content: "console.log('hello world')"},
                {
                    type: "📄script",
                    name: "main.js",
                    content: "console.log('hello world')"},
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
            rights: FILL,
            files:[
                {
                    type: "🖼️picture",
                    name: "background.jpg",
                    content: "data:image/jpeg;base64,..."},
                {
                    type: "🖼️picture",
                    name: "logo.png",
                    content: "data:image/png;base64,..."
                }
            ]
        },
        {
            type: "🥪food",
            name: "Food",
            color: "brown",
            rights: FILL,
            files:[
                {
                    type: "🥪food",
                    name: "Hot Dog",
                    content: "data:image/jpeg;base64,..."},
                {
                    type: "🥪food",
                    name: "Sandwich",
                    content: "data:image/png;base64,..."
                }
            ]
        },
        {
            type: "🌟effects",
            name: "Effects",
            color: "orange",
            rights: FILL,
            files:[
                {
                    type: "🌟effects",
                    name: "Zombified",
                    content: "data:application/json;base64,..."},
                {
                    type: "🌟effects",
                    name: "Vampire",
                    content: "data:application/json;base64,..."},
                {
                    type: "🌟effects",
                    name: "Werewolf",
                    content: "data:application/json;base64,..."
                }
            ]
        },
        {
            type: "🌡️jauges",
            name: "Jauges",
            color: "purple",
            rights: FILL,
            files:[
                {
                    type: "🌡️jauges",
                    name: "Vie",
                    content: "data:application/json;base64,..."},
                {
                    type: "🌡️jauges",
                    name: "Faim",
                    content: "data:application/json;base64,..."},
                {
                    type: "🌡️jauges",
                    name: "Mana",
                    content: "data:application/json;base64,..."},
                {
                    type: "🌡️jauges",
                    name: "Or",
                    content: "data:application/json;base64,..."},
                {
                    type: "🌡️jauges",
                    name: "Maladie",
                    content: "data:application/json;base64,..."
                }
            ]
        }
    ]
})
directory.item.on_remove = (path, item) => {
    return path.length > 1
}
directory.item.on_add = (path, item) => {
    console.log(path, item)
    item.name = "Salade"
    return path[0]==0
}
root.replaceWith(directory.element)

/** @type {import("../../node_modules/blockly/core/utils/toolbox.js").ToolboxInfo} */ 
Blockly.ContextMenuItems.registerCommentOptions();
const toolbox = {
    kind: 'categoryToolbox',
    contents: [...globalWorkbench],
};

const workspace=Blockly.inject('blocklyDiv', {
    toolbox: toolbox,
    media: '/media/',
    scrollbars: true,
    horizontalLayout:false,
    toolboxPosition: "end",
});
registrerGlobalCategories(workspace)

window.addEventListener("keypress", e=>{
    if(e.key=="s"){
        output.innerText = JSON.stringify(Blockly.serialization.workspaces.save(workspace))
    }
    if(e.key=="g"){
        output.innerText = Javascript.javascriptGenerator.workspaceToCode(workspace)
    }
})