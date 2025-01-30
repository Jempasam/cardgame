import { useAddon } from "../../workbench/addon.js";
import { CHECK_RENDERER } from "../../workbench/renderer/CheckRenderer.mjs";
import { Blockly, Javascript } from "../../workbench/utils/blockly.mjs";
import { EditorView } from "./EditorView.js";


/**
 * A blockly editor view.
 */
export class BlocklyEditorView extends EditorView{

    /**
     * 
     * @param {import("../../workbench/addon.js").BlocklyAddon} addon 
     * @param {import("../../../node_modules/blockly/core/serialization/blocks.js").State=} base
     */
    constructor(addon,base){
        super()
        this.addon = addon
        this.base = base
    }
    
    /** @type {EditorView['open']} */ 
    open(context){
        this.workspace=Blockly.inject(context.container, {
            toolbox: { kind:'categoryToolbox', contents:this.addon.toolbox??[] },
            renderer: CHECK_RENDERER,
            media: '/media/',
            scrollbars: true,
            horizontalLayout:false,
            toolboxPosition: "end",
        });
        this.workspace['file_system'] = context.file_system
        this.workspace['file_type'] = context.get(context.path.slice(0,1)).metadata?.type ?? null
        useAddon(this.workspace, this.addon)
        
        this.container = context.container
        this.container.onkeydown = (e)=>{
            if(e.key=="s"){
                e.preventDefault()
                context.print(JSON.stringify(this.serialize(),null," "))
            }
            else if(e.key=="c"){
                e.preventDefault()
                context.print(Javascript.javascriptGenerator.workspaceToCode(this.workspace))
            }
        }
    }

    close(){
        if(this.workspace){
            this.workspace.dispose()
        }
        if(this.container){
            this.container.onkeydown = null
        }
    }

    serialize(){
        return Blockly.serialization.workspaces.save(this.workspace)
    }

    deserialize(data){
        Blockly.serialization.workspaces.load(data, this.workspace)
    }

    initDefault(){
        setTimeout(()=>{
            if(this.workspace && this.base){
                console.log(this.base)
                const base = Blockly.serialization.blocks.append(this.base, this.workspace)
                base.initModel()
                this.workspace.render()
            }
        })
    }
}