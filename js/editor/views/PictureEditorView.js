import { html } from "../../utils/doc.js";
import { PictureEditorElement } from "../picture/picture_editor.js";
import { EditorView } from "./EditorView.js";

const HTML = await fetch("picture.html")
    .then(it=>it.text())
    .then(it=>{
        const fragment = document.createElement("template")
        fragment.innerHTML = it
        return fragment.content
    })

/**
 * A blockly editor view.
 */
export class PictureEditorView extends EditorView{

    constructor(){
        super()
    }
    
    /** @type {EditorView['open']} */
    open(context){
        this.editor = new PictureEditorElement()
        this.gui = html.a`<div class="container">${this.editor}</div>`
        this.gui.style.display = "flex"
        this.gui.style.alignItems = "center"
        this.gui.style.justifyContent = "center"
        this.gui.style.height = "100%"
        this.gui.style.overflow = "auto"
        this.gui.style.scrollbarWidth = "100px"
        context.container.replaceChildren(this.gui)
    }

    close(){
        this.gui.remove()
        delete this.gui
        delete this.editor
    }

    serialize(){
        return this.editor.serialize()
    }

    deserialize(data){
        this.editor.deserialize(data)
    }

    initDefault(){
    }
}