import { html } from "../utils/doc.js"
import { sleep } from "../utils/promises.js"


/**
 * @typedef {{type?:string, color?:string, name:string, content:any}} File
 * @typedef {{type?:string, color?:string, name:string, files:(File|Directory)[]}} Directory
 * 
 */
export class FileExplorer{

    constructor(){
        this.selected = null
        this.dragged = /** @type {{uuid:String,file:File|Directory,item:FileExplorer.Item}} */ (null)
    }

    /**
     * Create the root directory element
     * @param {Directory} file
     */
    RootDirectory(file){
        let root_directory = new FileExplorer.Directory(this,file)
        root_directory.element.classList.add("_outline")
        return root_directory
    }

    /**
     * Run an async after the last async
     * @template T
     * @template R
     * @param {(...p:T[])=>Promise<void>} action
     * @returns {((...p:T[])=>void)&(()=>void)}
     */
    synchronised(action){
        return (...e) => { this.#promise = this.#promise.then(()=>action(...e)) }
    }
    #promise=Promise.resolve()

    /**
     * @param {File|Directory} file
     * @return {FileExplorer.File|FileExplorer.Directory}
     **/
    ItemOrDirectory(file){
        if("files" in file) return new FileExplorer.Directory(this,file)
        else return new FileExplorer.File(this, file)
    }
}

FileExplorer.Item = class{


    /** @type {(added: number[])=>void} */  on_add = ()=>{}
    /** @type {(removed:number[])=>void} */  on_remove = ()=>{}
    /** @type {(selected:number[])=>void} */  on_select = ()=>{}
    /** @type {(before:string, after:string, path:number[])=>void} */  on_rename = ()=>{}

    /**
     * Create a element reprensenting a file.
     * @param {FileExplorer} explorer 
     * @param {File|Directory} file
     */
    constructor(explorer, file){
        this.explorer = explorer
        this.file = file
    }

    /**
     * Rename the item
     * @param {string} new_name 
     */
    rename(new_name){
        this.explorer.synchronised(async()=>{
            const before = this.file.name
            this.file.name=new_name
            this.name.innerText=new_name
            this.header.ariaLabel=new_name
            this.on_rename(before, new_name, [])
        })()
    }

    /**
     * Remove the item
     * @param {boolean=} force
     */
    remove(force=false){
        this.explorer.synchronised(async()=>{
            if(force || confirm("Are you sure you want to delete this file?")){
                this.on_remove([])
            }
        })()
    }

    /**
     * Create an item header
     * @returns 
     */
    createHeaderElement(){
        const {explorer, file} = this
        const that =this
        let tag = html.opt`<span class="-tag">${file.type}</span>`
        this.name = html.a`<span class="-name">${file.name}</span>`
        let remove = html.a`<span class="-icon" @${{click:explorer.synchronised(on_remove)}}>❌</span>`
        let header = html.a`<div aria-label="${file.name}" tabindex=0 @${{click:explorer.synchronised(on_rename_or_select)}}>${tag} ${that.name} ${remove}</div>`

        async function on_remove(e){
            e.stopPropagation()
            that.remove()
        }

        header.draggable = true
        header.ondragstart = e => {
            e.stopPropagation()
            const uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
            e.dataTransfer.setData("text/file", JSON.stringify({uuid, file}))
            explorer.dragged = {uuid, file, item:that}
            function stop_drag(file){
                file.uuid=uuid
                if("files" in file) for(const f of file.files) stop_drag(f)
            }
            stop_drag(file)
        }
        header.onkeydown = e => {
            if(header==document.activeElement && e.key=="Enter")header.click()
        }

        let the_select = null
        async function on_rename_or_select(e){
            e.stopPropagation()
            if(!header.parentElement)return
            that.on_select([])
            if(explorer.selected!=null){
                explorer.selected.classList.remove("_selected")
            }
            explorer.selected=header
            explorer.selected.classList.add("_selected")
            if(the_select==null) the_select = setTimeout( () => { the_select = null }, 300 )
            else{
                clearTimeout(the_select)
                the_select=null
                const from = that.name.innerText
                const name_input = /** @type {HTMLInputElement} */ (html.a`<input class="-name" type="text" value="${that.name.textContent}" }}>`)
                name_input.onblur = name_input.onchange = e=>{
                    const new_name = name_input.value
                    const name_element = html.a`<span class="-name">${file.name}</span>`
                    that.name.replaceWith(name_element)
                    that.name = name_element
                    that.rename(new_name)
                }
                that.name.replaceWith(name_input)
                name_input.focus()
                name_input.select()
                name_input
                that.name=name_input
            }
        }
        this.header=header
        return header
    }
}

FileExplorer.File = class{

    /** @type {()=>void} */ on_duplicate = ()=>{} 

    /** @type {(file:File|Directory)=>Promise<boolean>} */ on_drop_on = async()=>{return false} 

    /**
     * @param {FileExplorer} explorer 
     * @param {File} file
     */
    constructor(explorer, file){
        this.item = new FileExplorer.Item(explorer, file)
        this.file = file
        this.update()
    }

    update(){
        const that = this
        const {explorer} = that.item

        this.element = this.item.createHeaderElement()
        
        this.element.classList.add("file")
        this.element.children[1].after(html`<span class="-icon" @${{click:duplicate}}>📋</span>`)

        let on_drop = async(e)=>{
            e.stopPropagation()
            const data = JSON.parse(e.dataTransfer.getData("text/file"))
            if(!data) return
            const {uuid,file} = data
            if(uuid!=this.file["uuid"]){
                if(await this.on_drop_on(file)){
                    if(uuid==explorer.dragged.uuid){
                        explorer.dragged.item.remove(true)
                    }
                }
            }
        }

        this.element.ondragover = e => e.preventDefault()
        this.element.ondrop = explorer.synchronised(on_drop)

        function duplicate(e){
            e.stopPropagation()
            that.on_duplicate()
        }

        if(this.file.color) this.element.style.setProperty("--dir-color", this.file.color)
    }
}

FileExplorer.Directory = class{

    /**
     * @param {FileExplorer} explorer 
     * @param {Directory} directory
     */
    constructor(explorer, directory){
        this.item = new FileExplorer.Item(explorer, directory)
        this.directory = directory
        this.update()
    }

    /**
     * @param {number[]} path
     * @returns {File|Directory|undefined}
     **/
    get(path){
        /** @type {File|Directory} */ 
        let target = this.directory
        while(true){
            let current = path[0]
            let remaining = path.slice(1)
 
            if(remaining.length<=0)break
            if(!("files" in target))return undefined
            if(current>=target.files.length)return undefined

            target = this.directory.files[current]
        }
        return target
    }

    /**
     * Remove a child from the directory
     * @param {File|Directory} file
     */
    remove_child(file){
        const {explorer} = this.item
        const {directory} = this
        explorer.synchronised(async()=>{
            let index = directory.files.indexOf(file); if(index==-1)return
            let element = this.list.children[index]
            console.log(index,element)
            element.firstElementChild.classList.add("_disappearing")
            await sleep(200)
            element.firstElementChild.classList.remove("_disappearing")
            element.remove()
            directory.files.splice(index,1)
            this.item.on_remove([index])
        })()
    }

    /**
     * Create a child element
     * @param {File|Directory} file
     * @param {number} index
     * @returns {FileExplorer.File|FileExplorer.Directory}
     */
    #create_child(file, index){
        const {explorer} = this.item

        let child = explorer.ItemOrDirectory(file)

        child.item.on_remove = explorer.synchronised(async(p)=>{
            if(p.length==0) this.remove_child(file)
            else this.item.on_remove([...p,index])
        })

        child.item.on_add = explorer.synchronised(async(p) => this.item.on_add([...p,index]) )

        child.item.on_select = explorer.synchronised(async(p) => this.item.on_select([...p,index]) )

        //@ts-ignore
        child.item.on_rename = explorer.synchronised(async(before,after,p) => this.item.on_rename(before,after,[...p,index]) )

        if(child instanceof FileExplorer.File){
            child.on_duplicate = explorer.synchronised(async()=>{
                let index = this.directory.files.indexOf(file); if(index==-1)return
                let new_file = structuredClone(file)
                this.add_child(index+1,new_file)
            })
            child.on_drop_on = async(added)=>{
                const index = this.directory.files.indexOf(file)
                if(index==-1)return false
                this.add_child(index+1,added)
                return true
            }
        }

        return child
    }

    /**
     * Add a child to the directory
     * @param {number} index
     * @param {File|Directory} file 
     */
    add_child(index,file){
        this.item.explorer.synchronised(async()=>{
            let child = this.#create_child(file, index)
            let item = html.a`<li>${child.element}</li>`
            
            child.element.classList.add("_appearing")
            this.directory.files.splice(index, 0, file)
            if(index==this.list.children.length) this.list.append(item)
            else this.list.children[index].before(item) 
            await sleep(200)
            child.element.classList.remove("_appearing")
            
            if(index==this.list.children.length) this.list.append(item)
            else this.list.children[index].before(item)

        })()
    }

    hide(){
        this.item.explorer.synchronised(async()=>{
            if(this.hide_show_button.innerText!="▼")return
            this.hide_show_button.onclick = e =>{
                e.stopPropagation()
                this.show()
            }
            this.hide_show_button.innerText = "▲"
            this.element.classList.add("_closing")
            await sleep(200)
            this.element.classList.add("_closed")
            this.element.classList.remove("_closing")
            this.element.ariaExpanded = "false"
        })()
    }

    show(){
        this.item.explorer.synchronised(async()=>{
            if(this.hide_show_button.innerText!="▲")return
            this.hide_show_button.onclick = e =>{
                e.stopPropagation()
                this.hide()
            }
            this.hide_show_button.innerText = "▼"
            this.element.classList.remove("_closed")
            this.element.classList.add("_opening")
            await sleep(200)
            this.element.classList.remove("_opening")
            this.element.ariaExpanded = "true"
        })()
    }
    

    update(){
        const that = this
        const {explorer} = this.item
        let the_select = null

        let on_add_dir = async(e)=>{
            e.stopPropagation()
            this.add_child(this.directory.files.length, {name:"New directory", type:this.directory.type, files:[]})
        }

        let on_add = async(e)=>{
            e.stopPropagation()
            this.add_child(this.directory.files.length, {name:"New file", type:this.directory.type, content:null})
        }

        let on_drop = async(e)=>{
            e.stopPropagation()
            const data = JSON.parse(e.dataTransfer.getData("text/file"))
            if(!data) return
            console.log(data)
            const {uuid,file} = data
            if(uuid!=this.directory["uuid"]){
                if(uuid==explorer.dragged.uuid){
                    explorer.dragged.item.remove(true)
                }
                this.add_child(0,file)
            }
        }

        let on_hide = async(e)=>{ e.stopPropagation(); this.hide() }
        
        let header = this.item.createHeaderElement()
        header.classList.add("-title")
        header.children[1].after(html`
            <span class="-icon" @${{init:it=>this.hide_show_button=/** @type {HTMLElement} */ (it)}}>▼</span>
            <span class="-icon" @${{click:explorer.synchronised(on_add_dir)}}>📁</span>
            <span class="-icon" @${{click:explorer.synchronised(on_add)}}>➕</span>
        `)
        header.ondragover = e => e.preventDefault()
        header.ondrop = explorer.synchronised(on_drop)
        this.hide_show_button.onclick = explorer.synchronised(on_hide)

        this.element = html.a`
        <div class="directory" aria-expanded="true">
            ${header}
            <ul @${it=>this.list=/** @type {HTMLUListElement} */ (it)}>
            ${function*(){
                let i=0
                for(const f of that.directory.files){
                    yield html.a`<li>${that.#create_child(f,i).element}</li>`
                    i++
                }
            }}
            </ul>
        </div>
        `

        if(this.directory.color)this.element.style.setProperty("--dir-color", this.directory.color)
    }
}