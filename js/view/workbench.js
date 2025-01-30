import { FileExplorer, FILL, NOTHING } from "../editor/file_explorer.js"
import editor_views from "../editor/views/editor_views.js"
import { EditorView, EditorViewContext } from "../editor/views/EditorView.js"

const root = document.getElementById("root")
const workbench = new FileExplorer()
const output = document.getElementById("output")
const file_system = workbench.RootDirectory({
    type: "root",
    name: "Workbench",
    rights: NOTHING,
    files:[
        {
            name: "Jauges",
            type: "🌡️jauges",
            metadata: {type:"JaugeType"},
            color: "red",
            rights: FILL,
            files:[
                {
                    type: "🌡️jauges",
                    name: "Vies",
                    content: null
                },
                {
                    type: "🌡️jauges",
                    name: "Mana",
                    content: null
                },
                {
                    type: "🌡️jauges",
                    name: "Maladie",
                    content: null
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
                    content: {}},
                {
                    type: "🖼️picture",
                    name: "logo.png",
                    content: {}
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
                    content: {}},
                {
                    type: "🥪food",
                    name: "Sandwich",
                    content: {}
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
                    content: {}},
                {
                    type: "🌟effects",
                    name: "Vampire",
                    content: {}},
                {
                    type: "🌟effects",
                    name: "Werewolf",
                    content: {}
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
                    content: {}},
                {
                    type: "🌡️jauges",
                    name: "Faim",
                    content: {}},
                {
                    type: "🌡️jauges",
                    name: "Mana",
                    content: {}},
                {
                    type: "🌡️jauges",
                    name: "Or",
                    content: {}},
                {
                    type: "🌡️jauges",
                    name: "Maladie",
                    content: {}
                }
            ]
        }
    ]
})
file_system.item.on_remove = (path, item) => {
    return path.length > 1
}
file_system.item.on_add = (path, item) => {
    const directory = /** @type {import("../editor/file_explorer.js").Directory} */ (file_system.get(path.slice(0,-1)))
    console.log(directory)
    // No Double Name
    let name = /** @type {string} */ (item.name)
    while(directory.files.find(it=>it.name==name)!=null){
        let number = 1
        let keeped_size = name.length
        let match = name.match(/\d+$/)
        if(match!=null){
            number = parseInt(match[0])
            keeped_size = match.index
        }
        name = name.slice(0,keeped_size) + (number+1)
    }
    item.name = name
    console.log(item.name)

    return true
}
file_system.item.on_rename = /** @type {function(string,string,number[])} */ (before,after,path) => {
    const directory = /** @type {import("../editor/file_explorer.js").Directory} */ (file_system.get(path.slice(0,-1)))
    return after.indexOf("/")==-1 && directory.files.find(it=>it.name==after)==null
}
root.replaceWith(file_system.element)

/** FILE SELECTION */
const editorView = /** @type {HTMLElement} */ (document.querySelector("#editorView"))
let currentSelection = /** @type {import("../editor/file_explorer.js").File|import("../editor/file_explorer.js").Directory|null} */ (null)
let currentEditor = /** @type {EditorView|null} */ (null)
file_system.item.on_select = (path)=>{
    const old = currentSelection
    currentSelection = file_system.get(path)

    const type = "content" in currentSelection ? currentSelection.type : "else"
    const editor = editor_views[type] ?? editor_views.else

    if(old!=null){
        if("content" in old){
            old.content = currentEditor.serialize()
        }
        currentEditor.close()
    }

    currentEditor = editor
    if(currentSelection!=null){
        editor.open(new EditorViewContext(editorView, file_system.directory, path, output))
        if("content" in currentSelection){
            if(currentSelection.content==null) editor.initDefault()
            else editor.deserialize(currentSelection.content)
        }
    }
    return true
}

file_system.item.select()