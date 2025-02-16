
import { AbstractMesh, Color4, Engine, Material, Mesh, MeshBuilder, Node, Scene, SceneLoader, StandardMaterial, Texture, TransformNode, Vector3 } from "@babylonjs/core/index.js"
import { PromiseChain } from "../../utils/promises.js"
import { Game } from "../Game.js"
import "../../bin/earcut.js"
import { Picture } from "../icon/Picture.js"
import { Status } from "../status/Status.js"
import { getRomanNumber } from "./helper.js"
import "@babylonjs/loaders/glTF/index.js"
import { Jauge } from "../jauge/Jauge.js"
import { MOValue, OValue } from "../../observable/collections/OValue.js"
import { BakedPictureUtils } from "../icon/BakedPicture.js"
import { Text } from "../text/Text.js"


interface Context{
    scene: Scene,
    materials: Record<string,Material>,
    fonts: Record<string,import("@babylonjs/core/index.js").IFontData>,
    chain: PromiseChain,
    meshes: Record<string,{node:TransformNode,config:any}>,
    hovered: OValue<AbstractMesh|null>
}


/**
 * Create a view for a game.
 * @param game The game to show
 * @param chain The promise chain used for the animations
 * @param field_url The scene to load
 * */
export async function createGameView(game: Game, chain: PromiseChain, field_url:[string,string]=["media/scene/","playground.glb"]){
    const canvas = document.createElement("canvas")
    canvas.width=800
    canvas.height=400
    const engine = new Engine(canvas, true)
    //const scene = new Scene(engine)

    const ro = new ResizeObserver(() => engine.resize())
    ro.observe(canvas)
    engine.resize()

    //// LOAD FIELD ////
    const scene = await SceneLoader.LoadAsync(field_url[0], field_url[1], engine)

    const context = {scene, materials:{}, fonts:{}, chain:new PromiseChain(), meshes:{}, hovered:new MOValue(null)}

    //// Get Models ////
    function loadTemplate(name){
        const node = context.meshes[name] = getMarker(scene.meshes, name)
        node.node.setEnabled(false)
    }
    loadTemplate("card")
    loadTemplate("status")
    loadTemplate("jauge")
    loadTemplate("pointer")


    //// CREATE CAMERA ////
    scene.activeCamera = scene.getCameraByName("camera{}")
    /*const camera = new ArcRotateCamera("camera", Math.PI/2, Math.PI/4, 7, Vector3.Zero(), scene)
    camera.attachControl(canvas, true)
    camera.speed=0.01
    camera.wheelPrecision=10
    camera.setTarget(Vector3.Zero())*/
    scene.clearColor = new Color4(0,0,0,1)

    //// MOUSE PICKING ////
    const pointer_mesh = intoTransformNode(context.meshes.pointer.node)
    pointer_mesh.getChildMeshes().forEach(it=>it.isPickable=false)
    pointer_mesh.parent=null
    scene.onPointerMove = (evt, pickResult) => {
        const picked = scene.pick(scene.pointerX,scene.pointerY)
        if(picked.pickedMesh){
            //pointer_mesh.lookAt(picked.pickedPoint.negate())
            pointer_mesh.position.addInPlace(picked.pickedPoint.scale(.1)).scaleInPlace(1/1.1)
            if(context.hovered.get()!=picked.pickedMesh)context.hovered.set(picked.pickedMesh)
        }
        else if(context.hovered.get()!=null) context.hovered.set(null)
    }

    //// FONTS ////
    context.fonts.droid = await fetch("media/font/pixel.json").then(it=>it.json())

    let last_frame=requestAnimationFrame(function tick(){
        scene.render()
        last_frame=requestAnimationFrame(tick)
    })


    // Hand
    {
        const {node,config} = getMarker(scene.meshes, "hand")
        const hand = createArrayView(game.players.get(0).hand, (card,ctx) => createCardView(card,ctx), context, config)
        copyAllFrom(hand.mesh, node)
        node.dispose()
    }

    // Drawpile
    createStackView(
        getMarker(scene.meshes, "drawpile").node,
        game.players.get(0).draw_pile,
        context
    )

    // Discard
    createStackView(
        getMarker(scene.meshes, "discard").node,
        game.players.get(0).discard_pile,
        context
    )
    
    // Statuses
    {
        const {node,config} = getMarker(scene.meshes, "statuses")
        const status_array = game.players.get(0).statuses.observable_values()
        const statuses = createArrayView(status_array, (status,ctx) => createStatusView(status,ctx), context, config)
        copyAllFrom(statuses.mesh, node)
        node.dispose()
    }

    // Jauges
    {
        const {node,config} = getMarker(scene.meshes, "jauges")
        const jauges_array = game.players.get(0).jauges.observable_values()
        const jauges = createArrayView(jauges_array, (jauge,ctx) => createJaugeView(jauge,ctx), context, config)
        copyAllFrom(jauges.mesh, node)
        node.dispose()
    }

    return {
        element:canvas,
        dispose(){
            cancelAnimationFrame(last_frame)
            engine.dispose()
        }
    }
}

/**
 * @param {Node[]} nodes 
 * @param {string} id
 * @returns {{node:Mesh, config:any}|null} 
 */
function getMarker(nodes, id){
    try{
        const prefix = `${id}{`
        for(const node of nodes){
            if(node.name.startsWith(prefix)){
                try{
                    return {node:/** @type {Mesh} */ (node), config:JSON.parse(node.name.slice(id.length))}
                } catch(e){ throw new Error(`For marker "${node.name}":`, {cause:e})}
            }
        }
    } catch(e){ throw new Error(`For marker "${id}":`, {cause:e})}
    throw new Error(`For marker "${id}": Not found`)
    return null
}

/**
 * @param {TransformNode} target 
 * @param {Node} from 
 */
function copyAllFrom(target, from){
    const tfrom = /** @type {TransformNode} */ (from)
    //target.setPivotPoint(from.getPivotPoint())
    target.parent = tfrom.parent
    target.setPivotPoint(tfrom.getPivotPoint())
    target.position.copyFrom(tfrom.position)
    target.rotation.copyFrom(tfrom.rotation)
    target.scaling.copyFrom(tfrom.scaling)
    if(tfrom.rotationQuaternion) target.rotation.copyFrom(tfrom.rotationQuaternion.toEulerAngles())
}

/**
 * @param {TransformNode} copied
 */
function intoTransformNode(copied){
    const ret = doDebugTransformNode
        ? (()=>{
            const mesh = MeshBuilder.CreateBox("cube",{size:1,})
            mesh.material = new StandardMaterial("wireframe")
            mesh.material.wireframe=true
            return mesh
        })()
        : new TransformNode(copied.name)
    copyAllFrom(ret, copied)
    for(const child of copied.getChildren()) child.clone(child.name, ret)
    ret.scaling.set(1,1,1)
    ret.position.set(0,0,0)
    ret.rotation.set(0,0,0)
    return ret
}
const doDebugTransformNode = false


/**
 * @param {TransformNode} target 
 * @param {OArray<any>} array 
 * @param {Context} context 
 */
export function createStackView(target, array, context){
    const container = new TransformNode("stack", context.scene)
    copyAllFrom(container, target)

    let stack = target
    target.parent = container
    target.position.set(0,0,0)
    target.scaling.set(1,1,1)
    target.rotation.set(0,0,0)
    target.rotationQuaternion = null

    function update(){
        if(array.length==0){
            stack.setEnabled(false)
        }
        else{
            stack.setEnabled(true)
            stack.scaling.set(1, array.length/50., 1)
            stack.position.set(0, -(1-array.length/50.)/2, 0)
        }
    }

    const add = array.observable.on_add.add(()=>update())
    const remove = array.observable.on_remove.add(()=>update())

    update()

    return { mesh:container, dispose(){add(), remove(), container.dispose()} }
}

/**
 * 
 * @param {Card} card 
 * @param {Context} context 
 * @returns 
 */
export function createCardView(card, context){
    const {node, config} = context.meshes.card

    const card_element = intoTransformNode(node)

    {
        const {node,config} = getMarker(card_element.getChildren(), "picture")
        const picture = createPictureView(card.getPicture(),context)
        picture.material = node.material
        copyAllFrom(picture,node)
        node.dispose()
    }

    {
        const {node,config} = getMarker(card_element.getChildren(), "title")
        const title = MeshBuilder.CreateText("title", card.getName(), context.fonts.droid, {size:.5, depth:.5}, context.scene)
        title.material = node.material
        copyAllFrom(title,node)
        node.dispose()
    }

    {
        const {node,config} = getMarker(card_element.getChildren(), "description")
        const desc = createTextView(card.getDescription(), node.material, context, config)
        copyAllFrom(desc,node)
        node.dispose()
    }

    context.hovered.observable.add(({from,to})=>{
        if(to?.isDescendantOf(card_element)){
            card_element.scaling.setAll(2)
            card_element.position.set(0,1.5,0)
            card_element.rotation.set(Math.PI/4,0,0)
        }
        else{
            card_element.scaling.setAll(1)
            card_element.position.set(0,0,0)
            card_element.rotation.set(0,0,0)
        }
    })

    const card_container = new TransformNode("card_container", context.scene)
    card_element.parent = card_container

    return {
        mesh: card_container,
        dispose(){
            card_element.dispose()
        }
    }
}



export function createStatusView(status: Status, context: Context){
    const {node, config} = context.meshes.status
    const status_element = intoTransformNode(node)

    // Picture
    {
        const {node, config} = getMarker(status_element.getChildren(), "status_picture")
        const icon = createPictureView(status.type.picture, context)
        icon.material = node.material
        copyAllFrom(icon,node)
        node.dispose()
    }

    // Level
    {
        const {node,config} = getMarker(status_element.getChildren(), "status_level")
        const level_str = config?.roman ? getRomanNumber(status.level) : status.level.toString()
        const level = MeshBuilder.CreateText("level", level_str, context.fonts.droid, {size:.5, depth:.5}, context.scene)
        level.material = node.material
        copyAllFrom(level,node)
        node.dispose()
    }

    // Lifetime
    {
        const {node,config} = getMarker(status_element.getChildren(), "status_lifetime")
        const title = MeshBuilder.CreateText("lifetime", status.lifetime.toString(), context.fonts.droid, {size:.5, depth:.5}, context.scene)
        title.material = node.material
        copyAllFrom(title,node)
        node.dispose()
    }

    return {
        mesh: status_element,
        dispose(){
            status_element.dispose()
        }
    }
}


export function createJaugeView(jauge: Jauge, context: Context){
    const {node, config} = context.meshes.jauge
    const jauge_element = intoTransformNode(node)
    const dispose = []

    // Jauge content
    {
        const {node, config} = getMarker(jauge_element.getChildren(), "jauge_content")
        const base_height = node.scaling.y
        node.setVerticesData("color", Array(node.getTotalVertices()*4).fill([...jauge.type.color,1]).flat())

        function update(){ node.scaling.y = (jauge.current-jauge.minimum)/(jauge.maximum-jauge.minimum)*base_height }
        update()
        dispose.push(
            jauge.current_observable.add(()=>update()),
            jauge.minimum_observable.add(()=>update()),
            jauge.maximum_observable.add(()=>update())
        )
    }

    // Name
    {
        const {node,config} = getMarker(jauge_element.getChildren(), "jauge_name")
        const name = MeshBuilder.CreateText("level", jauge.type.name, context.fonts.droid, {size:.5, depth:.5}, context.scene)
        name.material = node.material
        copyAllFrom(name,node)
        node.dispose()
    }

    return {
        mesh: jauge_element,
        dispose(){
            jauge_element.dispose()
            dispose.forEach(it=>it())
        }
    }
}

/**
 * @template T
 * @param {OArray<T>} array 
 * @param {(item:T,context:Context)=>{mesh:TransformNode,dispose:()=>void}} factory 
 * @param {Context} context 
 * @param {{rotative?:boolean, tightening?:number, spacing?:number}} options
 */
export function createArrayView(array, factory, context, options={}){
    const container = new TransformNode("array", context.scene)
    const childs = /** @type {{mesh:TransformNode,dispose:()=>void}[]} */ ([])
    
    async function reorder(){
        const spacing = Math.max(.1,(options.spacing??1) - (options.tightening??0)*childs.length)
        const start = -childs.length*spacing/2 + 0.5

        //// Get new positions ////
        let new_positions = /** @type {[Vector3,Vector3][]} */ ([])
        for(let i=0; i<childs.length; i++){
            const height = Math.random()*0.01 + (i%2==0 && spacing<1 ? 0.1 : 0)
            const rotation = -(i-childs.length/2.+.5)/childs.length*Math.PI/4
            new_positions.push([
                new Vector3(i*spacing+start, height, 0),
                options.rotative ? new Vector3(0, rotation, 0) : Vector3.Zero()
            ])
        }

        //// Animate ////
        for(let y=0; y<20; y++){
            for(let i=0; i<childs.length; i++){
                childs[i].mesh.position.addInPlace(new_positions[i][0]).scaleInPlace(.5)
                childs[i].mesh.rotation.addInPlace(new_positions[i][1]).scaleInPlace(.5)
            }
            console.log("aa")
            await new Promise(resolve=>requestAnimationFrame(()=>resolve()))
        }
        for(let i=0; i<childs.length; i++){
            childs[i].mesh.position.copyFrom(new_positions[i][0])
            childs[i].mesh.rotation.copyFrom(new_positions[i][1])
        }
    }

    context.chain.do(async()=>{
        for(const item of array){
            const child = factory(item,context)
            childs.push(child)
            child.mesh.parent=container
        }
        await reorder()
    })

    const dispose_add = array.observable.on_add.add(({value,index})=>{
        context.chain.do(async()=>{
            const child = factory(value,context)
            childs.splice(index,0,child)
            child.mesh.parent=container
            await reorder()
        })
    })

    const dispose_removed = array.observable.on_remove.add(({value,index})=>{
        context.chain.do(async()=>{
            const child = childs.splice(index,1)[0]
            child.dispose()
            await reorder()
        })
    })

    return {mesh:container, dispose(){dispose_add(), dispose_removed(), childs.forEach(it=>it.dispose())}}
}


export function createPictureView(picture: Picture, context: Context){
    const baked = picture.baked().addShadow([.44,.44]).addOcclusion(.5).addReflection([.44,.44]).addGloom().addOuterOutline()
    const meshes = []

    const pixel_width = 1/picture.width
    const pixel_height = 1/picture.height
    for(const [x,y] of baked.indexes()){
        const pixel = baked.get(x,y)
        const [dx,dy] = BakedPictureUtils.get_normal(baked,x,y)
        if(!pixel.is_empty){
            
            const box = MeshBuilder.CreateBox("pixel", {width:pixel_width, height:pixel.depth*2+.2, depth:pixel_height}, context.scene)
            box.position = new Vector3(x*pixel_width-0.5, 0, y*pixel_height-0.5)
            box.setVerticesData("color", Array(24).fill([...pixel.color,pixel.alpha]).flat())
            meshes.push(box)
        }
    }
    const merged = Mesh.MergeMeshes(meshes, true)
    return merged
}

/**
 * Create a html element from a text object.
 */
export function createTextView(text: Text, material: Material, context: Context, options:{max_length?:number}={}){
    const max_length = options.max_length??30
    let accumulator=""
    let texts = /** @type {(string|null)[]} */ ([])
    
    /**
     * @param {import("../text/Text.js").Text} text 
     */
    function createTexts(text){
        if(accumulator.length>0){
            accumulator=""
            texts.push(accumulator)
        }
        for(let part of text){
            if(part == null || part==undefined) continue
            else if(typeof part == "string") accumulator+=part
            else if(typeof part == "number") accumulator+=part
            else if(typeof part == "object" && "strong" in part) accumulator+=part.strong
            else if(Array.isArray(part)) createTexts(part)
            else return accumulator+=part.toString()
        }
        if(accumulator.length>0){
            accumulator = accumulator[0].toUpperCase()+accumulator.slice(1)
            texts.push(accumulator+".")
            texts.push(null)
            accumulator=""
        }
    }
    createTexts(text)

    // Return to line under
    for(let i=0; i<texts.length; i++){
        const text = texts[i]
        if(text==null) continue
        if(text.length>max_length){
            texts[i] = text.slice(0,max_length)
            texts.splice(i+1, 0, text.slice(max_length))
        }
    }

    const parent = new TransformNode("text", context.scene)
    for(let i=0; i<texts.length; i++){
        const text = texts[i]
        if(text==null) continue
        const mesh = MeshBuilder.CreateText("text", text, context.fonts.droid, {size:.5, depth:.5}, context.scene)
        mesh.parent = parent
        mesh.position = new Vector3(0,-.5*i,0)
        mesh.material = material
    }
    return parent
}