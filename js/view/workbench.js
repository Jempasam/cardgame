import { FileExplorer } from "../editor/file_explorer.js"


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
