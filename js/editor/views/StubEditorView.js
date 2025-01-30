import { html } from "../../utils/doc.js";
import { EditorView } from "./EditorView.js";


/**
 * A blockly editor view.
 */
export class StubEditorView extends EditorView{
    
    /** @type {EditorView['open']} */ 
    open(context){
        this.pane = html.a`<div class="stub_pane"></div>`
        context.container.replaceChildren(this.pane)
    }

    close(){
        this.pane?.remove()
    }

    serialize(){
        return {}
    }

    deserialize(data){
    }

    initDefault(){
    }
}