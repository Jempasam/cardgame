
export class EditorViewContext{
    
    /**
     * @param {HTMLElement} container 
     * @param {import("../file_explorer.js").Directory} file_system 
     * @param {number[]} path 
     * @param {Element} output 
     */
    constructor(container, file_system, path, output){
        this.container = container
        this.file_system = file_system
        this.path = path
        this.output = output
    }

    /**
     * @param {string} text 
     */
    print(text){
        this.output.textContent = text
    }

    /**
     * Get a file from a path.
     * @param {number[]} path 
     */
    get(path){
        let current_path = structuredClone(path)
        let current = /** @type {import("../file_explorer.js").File|import("../file_explorer.js").Directory} */ (this.file_system)
        while(current_path.length>0){
            if(!('files' in current))return null
            current = current.files[current_path.shift()]
        }
        return current
    }
}

/**
 * A file editor.
 */
export class EditorView{

    /**
     * Open this editor view in the given div
     * @param {EditorViewContext} context
     */
    open(context){

    }

    /**
     * Close this editor view
     */
    close(){

    }

    /**
     * Serialize the content of this editor view.
     * @returns {any}
     */
    serialize(){

    }

    /**
     * Initialize the editor view with default content.
     */
    initDefault(){
    }

    /**
     * Deserialize the content of this editor view.
     * @param {any} data 
     */
    deserialize(data){

    }

}