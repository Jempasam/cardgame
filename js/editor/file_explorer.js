import { html } from "../utils/doc.js"
import { sleep } from "../utils/promises.js"


/**
 * @typedef {{type?:string, color?:string, name:string, content:any}} File
 * 
 * @typedef {{type?:string, color?:string, name:string, files:(File|Directory)[]}} Directory
 * 
 * @typedef {{
 *  on_add:(added: number[])=>void,
 *  on_remove: (removed:number[])=>void,
 *  on_select: (selected:number[])=>void,
 *  on_rename: (before:string, after:string, path:number[])=>void,
 * }} ItemEvents
 * 
 * @typedef {{
 *  on_duplicate: ()=>void,
 *  on_drag: ()=>Promise<boolean>
 * }} FileEvents
 * 
 */
export class FileExplorer{

    constructor(){
        this.selected = null
        this.dragged = null
    }

    /**
     * Create the root directory element
     * @param {Directory} file
     * @param {ItemEvents=} events
     */
    createRootDirectoryElement(file,events){
        let root_directory = this.createDirectoryElement(file,events??{on_add(){},on_remove(){},on_rename(){},on_select(){}})
        root_directory.classList.add("_outline")
        return root_directory
    }

    /**
     * Run an async after the last async
     * @template T
     * @param {(...p:T[])=>Promise<void>} action
     * @returns {((...p:T[])=>void)&(()=>void)}
     */
    synchronised(action){
        return (...e) => { this.#promise = this.#promise.then(()=>action(...e)) }
    }
    #promise=Promise.resolve()

    /**
     * @param {File|Directory} file
     * @param {ItemEvents} events
     */
    createHeaderElement(file,events){
        const that=this
        let tag = html.opt`<span class="-tag">${file.type}</span>`
        let name = html.a`<span class="-name">${file.name}</span>`
        let remove = html.a`<span class="-icon" @${{click:on_remove}}>❌</span>`
        let header = html.a`<div @${{click:that.#synchronised(on_rename_or_select)}}>${tag} ${name} ${remove}</div>`
        header.draggable=true
        header.ondragstart = that.#synchronised(on_drag_start)

        let the_select = null
        async function on_rename_or_select(e){
            e.stopPropagation()
            if(!header.parentElement)return
            events.on_select([])
            if(that.selected!=null){
                that.selected.classList.remove("_selected")
            }
            that.selected=header
            that.selected.classList.add("_selected")
            if(the_select==null){
                the_select=setTimeout( () => { the_select = null }, 300 )
            }
            else{
                clearTimeout(the_select)
                the_select=null
                const from = name.innerText
                const nname = html.a`<input class="-name" type="text" value="${name.textContent}" }}>`
                nname.onblur = nname.onchange = e=>{
                    const nname = html.a`<span class="-name">${name.value}</span>`
                    name.replaceWith(nname)
                    name=nname
                    events.on_rename(from, name.textContent,[])
                }
                name.replaceWith(nname)
                nname.focus()
                nname.select()
                nname
                name=nname
            }
        }

        function on_remove(e){
            e.stopPropagation()
            if(confirm("Are you sure you want to delete this file?")){
                events.on_remove([])
            }
        }
        
        /** @param {DragEvent} e  */
        async function on_drag_start(e){
            e.stopPropagation()
            e.dataTransfer.setData("text/file_explorer_file", JSON.stringify(file))
            events.on_remove([])
        }

        return header
    }
    
    /**
     * @param {File} file 
     * @param {ItemEvents} events
     * @param {FileEvents} file_events
     **/
    createFileElement(file, events, file_events){
        let the_select = null
        
        let element = this.createHeaderElement(file,events)
        element.classList.add("file")
        element.children[1].after(html`<span class="-icon" @${{click:duplicate}}>📋</span>`)

        function duplicate(e){
            e.stopPropagation()
            file_events.on_duplicate()
        }

        if(file.color)element.style.setProperty("--dir-color", file.color)
        return element
    }

    /**
     * @param {Directory} directory 
     * @return {FileExplorer.File|FileExplorer.Directory}
     **/
    createDirectoryElement(directory){
        const that = this
        let the_select = null
        
        let header = this.createHeaderElement(directory,events)
        let hide_show_button
        header.classList.add("-title")//▼▲
        header.children[1].after(html`
            <span class="-icon" @${{init:it=>hide_show_button=it}}>▼</span>
            <span class="-icon" @${{click:that.#synchronised(on_add_dir)}}>📁</span>
            <span class="-icon" @${{click:that.#synchronised(on_add)}}>➕</span>
        `)
        hide_show_button.onclick = that.#synchronised(on_hide)
        
        /** @type {HTMLUListElement} */  let list
        const element = html.a`
        <div class="directory">
            ${header}
            <ul @${it=>list=it}>
            ${function*(){
                let i=0
                for(const f of directory.files) yield create_child(f)
                i++
            }}
            </ul>
        </div>
        `

        element.ondragover = e=>e.preventDefault()
        element.ondrop = this.#synchronised(drop)

        /** @param {DragEvent} e  */
        async function drop(e){
            e.stopPropagation()
            let str = e.dataTransfer.getData("text/file_explorer_file"); if(!str) return
            let file = JSON.parse(str)
            let new_file_element = create_child(file)
            new_file_element.firstElementChild.classList.add("_appearing")
            directory.files.push(file)
            list.append(new_file_element)
            await sleep(200)
            new_file_element.firstElementChild.classList.remove("_appearing")
        }
        
        /**
         * @param {Directory|File} file 
         */
        function create_child(file){
            let child=that.createDirectoryOrFileElement(
                file,
                {
                    on_remove: that.#synchronised(async(p)=>{
                        let index = directory.files.indexOf(file); if(index==-1)return
                        if(p.length==0){
                            child.classList.add("_disappearing")
                            await sleep(200)
                            child.classList.remove("_disappearing")
                            item.remove()
                            directory.files.splice(index,1)
                        }
                        events.on_remove([...p,index])
                    }),
                    on_add: that.#synchronised(async(p)=>{
                        let index = directory.files.indexOf(file); if(index==-1)return
                        events.on_add([...p,index])
                    }),
                    on_select: that.#synchronised(async(p)=>{
                        let index = directory.files.indexOf(file); if(index==-1)return
                        events.on_select([...p,index])
                    }),
                    on_rename: that.#synchronised(async(before,after,p)=>{
                        let index = directory.files.indexOf(file); if(index==-1)return
                        events.on_select([...p,index])
                    })
                },
                that.#synchronised(async()=>{
                    let index = directory.files.indexOf(file); if(index==-1)return
                    let new_file = structuredClone(file)
                    let new_file_element = create_child(new_file)
                    directory.files.splice(index+1,0,new_file)
                    item.after(html.a`<li>${new_file_element}</li>`)
                    new_file_element.firstElementChild.classList.add("_appearing")
                    await sleep(200)
                    new_file_element.firstElementChild.classList.remove("_appearing")
                })
            )
            let item = html.a`<li>${child}</li>`  
            return item
        }

        async function on_hide(e){
            e.stopPropagation()
            if(hide_show_button.innerText!="▼")return
            hide_show_button.onclick = that.#synchronised(on_show)
            hide_show_button.innerText = "▲"
            element.classList.add("_closing")
            await sleep(200)
            element.classList.add("_closed")
            element.classList.remove("_closing")

        }

        async function on_show(e){
            e.stopPropagation()
            if(hide_show_button.innerText!="▲")return
            hide_show_button.onclick = that.#synchronised(on_hide)
            hide_show_button.innerText = "▼"
            element.classList.remove("_closed")
            element.classList.add("_opening")
            await sleep(200)
            element.classList.remove("_opening")
        }

        async function on_add(e){
            e.stopPropagation()
            await add_child(directory.files.length, {name:"New file", type:directory.type, content:null})
        }

        async function on_add_dir(e){
            e.stopPropagation()
            await add_child(directory.files.length, {name:"New directory", type:directory.type, files:[]})
        }

        /**
         * @param {number} index
         * @param {File|Directory} file
         **/
        async function add_child(index, file){
            let new_file_element = create_child(file)
            new_file_element.firstElementChild.classList.add("_appearing")
            directory.files.splice(index, 0, file)
            if(index==list.children.length) list.append(new_file_element)
            else list.children[index].before(new_file_element) 
            await sleep(200)
            new_file_element.firstElementChild.classList.remove("_appearing")
        }


        if(directory.color)element.style.setProperty("--dir-color", directory.color)
        return element
    }

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
            this.on_rename(before, new_name, [])
        })()
    }

    /**
     * Remove the item
     */
    remove(){
        this.explorer.synchronised(async()=>{
            if(confirm("Are you sure you want to delete this file?")){
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
        let remove = html.a`<span class="-icon" @${{click:this.remove.bind(this)}}>❌</span>`
        let header = html.a`<div @${{click:explorer.synchronised(on_rename_or_select)}}>${tag} ${name} ${remove}</div>`

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
                const name_input = /** @type {HTMLInputElement} */ (html.a`<input class="-name" type="text" value="${name.textContent}" }}>`)
                name_input.onblur = name_input.onchange = e=>{
                    const new_name = name_input.value
                    const name_element = html.a`<span class="-name">${file.name}</span>`
                    that.name.replaceWith(name_element)
                    that.rename(new_name)
                }
                that.name.replaceWith(name_input)
                name_input.focus()
                name_input.select()
                name_input
                that.name=name_input
            }
        }

        return header
    }
}

FileExplorer.File = class{

    /** @type {()=>void} */ on_duplicate = ()=>{} 

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

        this.element = this.item.createHeaderElement()
        
        this.element.classList.add("file")
        this.element.children[1].after(html`<span class="-icon" @${{click:duplicate}}>📋</span>`)

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
     * Remove a child from the directory
     * @param {File|Directory} file
     */
    remove_child(file){
        const {explorer} = this.item
        const {directory} = this
        explorer.synchronised(async()=>{
            let index = directory.files.indexOf(file); if(index==-1)return
            let element = this.list.children[index]
            element.classList.add("_disappearing")
            await sleep(200)
            element.classList.remove("_disappearing")
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

        let on_hide = async(e)=>{ e.stopPropagation(); this.hide() }
        
        let header = this.item.createHeaderElement()
        header.classList.add("-title")//▼▲
        header.children[1].after(html`
            <span class="-icon" @${{init:it=>this.hide_show_button=/** @type {HTMLElement} */ (it)}}>▼</span>
            <span class="-icon" @${{click:explorer.synchronised(on_add_dir)}}>📁</span>
            <span class="-icon" @${{click:explorer.synchronised(on_add)}}>➕</span>
        `)
        this.hide_show_button.onclick = explorer.synchronised(on_hide)
        
        this.element = html.a`
        <div class="directory">
            ${header}
            <ul @${it=>this.list=/** @type {HTMLUListElement} */ (it)}>
            ${function*(){
                let i=0
                for(const f of this.directory.files){
                    yield this.#create_child(f,i)
                    i++
                }
            }}
            </ul>
        </div>
        `

        // this.element.ondragover = e=>e.preventDefault()
        // this.element.ondrop = this.#synchronised(drop)

        // /** @param {DragEvent} e  */
        // async function drop(e){
        //     e.stopPropagation()
        //     let str = e.dataTransfer.getData("text/file_explorer_file"); if(!str) return
        //     let file = JSON.parse(str)
        //     let new_file_element = create_child(file)
        //     new_file_element.firstElementChild.classList.add("_appearing")
        //     directory.files.push(file)
        //     list.append(new_file_element)
        //     await sleep(200)
        //     new_file_element.firstElementChild.classList.remove("_appearing")
        // }

        if(this.directory.color)this.element.style.setProperty("--dir-color", this.directory.color)
    }
}