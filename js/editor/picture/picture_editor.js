import { Picture } from "../../cardgame/icon/Picture.js"
import { html } from "../../utils/doc.js"
import effects from "./effects.js"
import rendering_modes from "./rendering_modes.js"

const example_json = await fetch(import.meta.resolve("./shapes.json")).then(it=>it.json())

const HTML = await fetch(import.meta.resolve("./picture_editor.html"))
    .then(it=>it.text())
    .then(it=>{
        const fragment = document.createElement("template")
        fragment.innerHTML = it
        return fragment.content
    })

export class PictureEditorElement extends HTMLElement{
    constructor(){
        super()
        const that = this

        this.attachShadow({mode: 'open'})
        this.shadowRoot.replaceChildren(HTML.cloneNode(true))

        // Elements
        this.render_canvas = /** @type {HTMLCanvasElement} */ (this.get("#renderer"));
        this.editor_canvas = /** @type {HTMLCanvasElement} */ (this.get("#editor_renderer"));
        this.input_load = /** @type {HTMLTextAreaElement} */ (this.get("#load_content"));
        this.button_load = /** @type {HTMLButtonElement} */ (this.get("#load"));
        this.color_display = this.get("#color_display");

        // State
        this.current_picture = new Picture()
        this.light_direction = [1,0]
        this.rendering_mode = rendering_modes.shaded
        this.current_effect = it=>it
        this.brush = ["color", 0];
        this.rollstack = []

        this.addEventListener("keydown", (e) => {
            if(e.ctrlKey && e.key=="z") this.rollback()
        })

        // Load textarea
        this.input_load.addEventListener("input", () => {
            try {
                const params = JSON.parse(this.input_load.value)
                this.deserialize(params)
            } catch (e) {}
        });

        const editor = this.get("#editor");

        editor.appendChild(html.a`<label for="depth-1">[ EMPTY ]</label>`);
        const added = html.a`<input type="radio" name="tileselect" id="depth-1"/>`;
        editor.appendChild(added);
        added.onchange = () => this.selectBrush("depth", -1);

        for (let i = 0; i < 4; i++) {
            editor.appendChild(html.a`<label for="color${i}">COLOR ${i + 1}</label>`);
            const added = html.a`<input type="radio" name="tileselect" id="color${i}"/>`;
            editor.appendChild(added);
            added.onchange = () => this.selectBrush("color", i);
        }
        for (let i = 0; i < 10; i++) {
            editor.appendChild(html.a`<label for="depth${i}">Depth ${i + 1}</label>`);
            const added = html.a`<input type="radio" name="tileselect" id="depth${i}">Depth ${i}</input>`;
            editor.appendChild(added);
            added.onchange = () => this.selectBrush("depth", i);
        }

        this.selectBrush("color", 0);

        // Light direciton
        this.get("#light_direction").oninput = (e)=>{
            const angle = e.target.value * Math.PI/180
            this.light_direction = [Math.cos(angle), Math.sin(angle)]
            this.render()
        }

        // Rendering Mode
        this.get("#rendering_mode").append(html`
            ${function*(){
                for(const [name, func] of Object.entries(rendering_modes)){
                    const option=html.a`<option value=${name}>${name}</option>`
                    option.onclick = ()=>{that.rendering_mode=func; that.render()}
                    yield option
                }
            }}
        `)

        this.get("#rendering_mode").firstElementChild.click()

        // Effects
        this.get("#effects").append(html`
            ${function*(){
                for(const [name, func] of Object.entries(effects)){
                    const option=html.a`<option value=${name}>${name}</option>`
                    option.onclick = ()=>{that.current_effect=func; that.render()}
                    yield option
                }
            }}
        `)

        this.get("#effects").firstElementChild.click()

        // Editor Draw
        function setValue(x, y) {
            if (that.brush[0] == "color") {
                if(that.brush[1]==that.current_picture.get_material_index(x,y) && that.current_picture.get_depth(x,y)!=-1) return
                that.add_rollback()
                if (that.current_picture.get_depth(x, y) == -1) that.current_picture.set_depth(x, y, 0);
                that.current_picture.set_material_index(x, y, that.brush[1]);
            } else{
                if(that.brush[1]==that.current_picture.get_depth(x,y)) return
                that.add_rollback()
                that.current_picture.set_depth(x, y, that.brush[1]);
            }
            that.render();
        }

        this.editor_canvas.onmousedown = this.editor_canvas.onmousemove = this.render_canvas.onmousedown = this.render_canvas.onmousemove = (e) => {
            let canvas = /** @type {HTMLCanvasElement} */ (e.target)

            if (e.buttons == 0) return
            e.preventDefault()

            const x = Math.floor((e.offsetX / canvas.width) * this.current_picture.width);
            const y = Math.floor((e.offsetY / canvas.height) * this.current_picture.height);

            // Pick
            if (e.buttons == 4) {
                if (this.current_picture.get_depth(x, y) == -1) this.selectBrush("depth", -1);
                else if (this.brush[0] == "depth" && this.brush[1] != -1)
                this.selectBrush("depth", this.current_picture.get_depth(x, y));
                else this.selectBrush("color", this.current_picture.get_material_index(x, y));
                return;
            }

            // Erase
            if (e.buttons == 2) {
                this.current_picture.set_depth(x, y, -1);
                this.render();
                return;
            }

            // Draw
            setValue(x, y);
        };
        that.editor_canvas.oncontextmenu = that.render_canvas.oncontextmenu = (e) => e.preventDefault();

        for(let i=0; i<4; i++){
            this.setMaterial(i,this.current_picture.materials[i])
            const color_picker= this.get(`#colors${i}`)
            const alpha_picker= this.get(`#alpha${i}`)
            const light_picker= this.get(`#light${i}`)
            const reflection_picker= this.get(`#reflection${i}`)
            color_picker.oninput = alpha_picker.oninput = light_picker.oninput = reflection_picker.oninput = (e)=>{
                const color = color_picker.value.slice(1).match(/.{2}/g).map(it=>parseInt(it,16)/255)
                const alpha = parseInt(alpha_picker.value)/100
                const light = parseInt(light_picker.value)/100
                const reflection = parseInt(reflection_picker.value)/100
                this.setMaterial(i,{color,alpha,light,reflection})
            }
        }

        // Examples
        const example_select = this.get("#examples")
        for(const [name, data] of Object.entries(example_json)){
            const selection = html.a`<option value=${name}>${name}</option>`
            selection.onclick=()=>{
                this.current_picture = new Picture(...structuredClone(data))
                for(let i=0; i<4; i++) this.setMaterial(i,this.current_picture.materials[i])
            }
            example_select.appendChild(selection)
        }
        example_select.firstElementChild.click()

        // Move
        function translate(dx,dy){
            let moved = new Picture(that.current_picture.materials, undefined, undefined, that.current_picture.width, that.current_picture.height)
            moved.materials= that.current_picture.materials
            for(let [x,y] of moved.indexes()){
            const coords= [(x-dx+this.current_picture.width)%that.current_picture.width, (y-dy+that.current_picture.height)%that.current_picture.height]
            moved.set_material_index(x,y, that.current_picture.get_material_index(...coords))
            moved.set_depth(x,y, that.current_picture.get_depth(...coords))
            }
            that.current_picture = moved
            that.render()
        }

        this.get("#move_top").onclick = ()=>translate(0,-1)
        this.get("#move_bottom").onclick = ()=>translate(0,1)
        this.get("#move_left").onclick = ()=>translate(-1,0)
        this.get("#move_right").onclick = ()=>translate(1,0)

        // Export
        this.get("#export_image").onclick = ()=>{
            html.a`<a href="${this.render_canvas.toDataURL("image/png")}" download></a>`.click()
        }

        // Symmetry
        this.get("#symmetrize").onclick = (e)=>{
            this.add_rollback()
            for(let x=this.current_picture.width/2+this.current_picture.width%2; x<this.current_picture.width; x++){
                for(let y=0; y<this.current_picture.height; y++){
                    const coords = [this.current_picture.width-x-1,y]
                    this.current_picture.set_material_index(x,y, this.current_picture.get_material_index(...coords))
                    this.current_picture.set_depth(x,y, this.current_picture.get_depth(...coords))
                }
            }
            this.render()
        }

        // Auto Depth
        this.get("#autodepth").onclick = (e)=>{
            this.add_rollback()
            let is_changed= Array.from({length:this.current_picture.width*this.current_picture.height}, ()=>true)

            // Set no depth
            for(let [x,y] of this.current_picture.indexes()){
                if(this.current_picture.get_depth(x,y)!=-1) is_changed[x+y*this.current_picture.width]=false
            }

            this.current_picture = effects.auto_depth(this.current_picture)
            this.render()
        }

        // Apply effects
        this.get("#apply_effects").onclick = (e)=>{
            this.add_rollback()
            this.current_picture = this.current_effect(this.current_picture)
            let select=/** @type {HTMLSelectElement} */ (this.get("#effects"))
            select.selectedIndex=0
            select.options[0].click()
            this.render()
        }

        // Resize
        this.get("#width").onchange = this.get("#height").onchange = (e)=>{
            this.add_rollback()
            const width = parseInt(this.get("#width").value)
            const height = parseInt(this.get("#height").value)
            this.get("#width").value = ""+width
            this.get("#height").value = ""+height
            const new_sized_picture= new Picture(this.current_picture.materials, undefined, undefined, width, height)
            const maxx=Math.min(width,this.current_picture.width)
            const maxy=Math.min(height,this.current_picture.height)
            for(let x=0; x<maxx; x++){
                for(let y=0; y<maxy; y++){
                    new_sized_picture.set_material_index(x,y, this.current_picture.get_material_index(x,y))
                    new_sized_picture.set_depth(x,y, this.current_picture.get_depth(x,y))
                }
            }
            this.current_picture=new_sized_picture
            this.render()
        }

        // Close button
        for(let menu of this.getAll(".menu")){
        let button = /** @type {HTMLElement} */ (menu.querySelector(":scope > ._hide_button"))
        button.onclick = (e)=>{
            if(menu.classList.contains("_hidden")){
            menu.classList.remove("_hidden")
            button.innerHTML = "X"
            }
            else{
            menu.classList.add("_hidden")
            button.innerHTML = "O"
            }
        }
        }
    }

    rollback(){
        if(this.rollstack.length>0){
            this.this.current_picture = this.rollstack.pop()
            for(let i=0; i<4; i++) this.setMaterial(i,this.current_picture.materials[i])
            this.render()
        }
    }

    add_rollback(){
        if(this.rollstack.length>10) this.rollstack.splice(0,1)
        this.rollstack.push(this.current_picture.clone())
    }

    render() {
        // Draw
        const context = this.render_canvas.getContext("2d");
        context.save();
        context.scale( this.render_canvas.width,  this.render_canvas.height);
        context.clearRect(0, 0, 1, 1);
        this.rendering_mode(context, this.current_effect(this.current_picture), this.light_direction);
        context.restore();

        // Draw Editor
        const editor_context = this.editor_canvas.getContext("2d");
        editor_context.save();
        editor_context.scale(this.editor_canvas.width, this.editor_canvas.height);
        editor_context.clearRect(0, 0, 1, 1);
        if (this.brush[0] == "color" || this.brush[1] == -1) this.current_picture.baked().draw(editor_context)
        else this.current_picture.baked().makeDepthmap().draw(editor_context)
        editor_context.restore();

        // Fill save load
        this.input_load.value = JSON.stringify(this.serialize())
    }

    serialize(){ return [this.current_picture.materials, this.current_picture.pixel_materials, this.current_picture.pixel_depth] }

    deserialize(serialized){
        if(serialized.length!=3)return
        this.current_picture = new Picture(...serialized)
        for(let i=0; i<4; i++) this.setMaterial(i,this.current_picture.materials[i])
        this.render()
    }

    selectBrush(type, number) {
        this.brush = [type, number];
        this.get(`#${type}${number}`).checked = true;
        if (type == "color") {
            const {color,alpha} = this.current_picture.materials[number];
            this.color_display.innerHTML = "C";
            this.color_display.style.backgroundColor = `rgba(${Math.floor(color[0] * 255)},${Math.floor(color[1] * 255)},${Math.floor(color[2] * 255)},${alpha})`;
        } else {
            if (number == -1) {
                this.color_display.style.backgroundColor = "transparent";
                this.color_display.innerHTML = "X";
            } else {
                const depth = Math.floor((number / 10) * 225) + 20;
                this.color_display.style.backgroundColor = `rgba(${depth},${depth},${depth},1)`;
                this.color_display.innerHTML = "+" + number;
            }
        }
    }

    /**
     * @param {number} index 
     * @param {import("../../cardgame/icon/Picture.js").PictureMaterial} material 
     */
    setMaterial(index,material){
        // Elements
        const color_picker = this.get(`#colors${index}`)
        const alpha_picker= this.get(`#alpha${index}`)
        const light_picker= this.get(`#light${index}`)
        const reflection_picker= this.get(`#reflection${index}`)
        const selector = this.get(`[for=color${index}]`)

        this.current_picture.materials[index] = material

        // Set color
        const realcolor= material.color.map(it=>Math.floor(it*255))
        const realalpha = material.alpha

        color_picker.value = "#"+realcolor.map(it=>it.toString(16).padStart(2,"0")) .join("")
        alpha_picker.value = Math.floor(realalpha*100)
        light_picker.value = Math.floor(material.light*100)
        reflection_picker.value = Math.floor(material.reflection*100)
        selector.style.color = `rgba(${realcolor.join(",")},${realalpha})`

        this.render()
    }


    /** @param {string} selector */
    get(selector){ return /** @type {HTMLElement} */ (this.shadowRoot.querySelector(selector)) }

    /** @param {string} selector */
    getAll(selector){ return /** @type {NodeListOf<HTMLElement>} */ (this.shadowRoot.querySelectorAll(selector)) }
}

customElements.define(`sam-${crypto.randomUUID().toString().replace("-","")}`, PictureEditorElement)