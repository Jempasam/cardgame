
import { ArcRotateCamera, Color3, Color4, Engine, FreeCamera, Material, Mesh, MeshBuilder, Scene, StandardMaterial, Texture, TransformNode, Vector3 } from "../../../node_modules/@babylonjs/core/index.js"
import { PromiseChain } from "../../utils/promises.js"
import { Card } from "../card/Card.js"
import { Game } from "../Game.js"
import "../../bin/earcut.js"
import { Picture } from "../icon/Picture.js"

/**
 * @typedef {{
 *  scene:Scene,
 *  materials:Record<string,Material>,
 *  fonts:Record<string,import("../../../node_modules/@babylonjs/core/index.js").IFontData>,
 * }} Context
 **/

/**
 * Create a view for a game.
 * @param {Game} game The game to show
 * @param {PromiseChain} chain The promise chain used for the animations
 * */
export async function createGameView(game, chain){
    const canvas = document.createElement("canvas")
    canvas.width=800
    canvas.height=400
    const engine = new Engine(canvas, true)
    const scene = new Scene(engine)
    
    //const camera = new FreeCamera("camera", new Vector3(0,5,1), scene)
    const camera = new ArcRotateCamera("camera", Math.PI/2, Math.PI/2, 5, Vector3.Zero(), scene)
    camera.attachControl(canvas, true)
    camera.speed=0.01
    camera.wheelPrecision=10
    camera.setTarget(Vector3.Zero())

    scene.createDefaultLight()
    scene.clearColor = new Color4(0,0,0,1)

    const context = {scene, materials:{}, fonts:{}}

    //// FONTS ////
    context.fonts.droid = await fetch("media/font/pixel.json").then(it=>it.json())

    //// MATERIALS ////
    {
        const mat = context.materials.wood = new StandardMaterial("wood", scene)
        mat.diffuseTexture = new Texture("img/woodsquare.png", scene)
        mat.diffuseTexture.hasAlpha = true
        mat.bumpTexture = new Texture("img/woodsquare_normal.png", scene)
        mat.transparencyMode = StandardMaterial.MATERIAL_ALPHATEST
        mat.useAlphaFromDiffuseTexture = true
        mat.specularColor = new Color3(.2,.2,.2)
    }
    
    {
        const mat = context.materials.paper = new StandardMaterial("card", scene)
        mat.diffuseTexture = new Texture("img/card.png", scene)
        mat.bumpTexture = new Texture("img/paper_normal.png", scene)
        mat.diffuseTexture.hasAlpha = true
        mat.specularColor = new Color3(.2,.2,.2)
        mat.transparencyMode = StandardMaterial.MATERIAL_ALPHATEST
        mat.useAlphaFromDiffuseTexture = true
    }

    {
        const mat = context.materials.black = new StandardMaterial("black", scene)
        mat.diffuseColor = new Color3(0,0,0)
        mat.specularColor = new Color3(.2,.2,.2)
    }

    {
        const mat = context.materials.white = new StandardMaterial("white", scene)
        mat.diffuseColor = new Color3(1,1,1)
        mat.specularColor = new Color3(.2,.2,.2)
    }


    //// WOOD GROUND ////
    const block = MeshBuilder.CreateGround("box", {width:8,height:4}, scene)
    block.material = context.materials.wood
    block.position = Vector3.Zero()

    let last_frame=requestAnimationFrame(function tick(){
        scene.render()
        last_frame=requestAnimationFrame(tick)
    })


    //// GET CARD ////
    const card = createCardView(game.players.get(0).draw_pile.get(0), context)
    card.mesh.position = new Vector3(0,0.1,0)

    return {
        element:canvas,
        dispose(){
            cancelAnimationFrame(last_frame)
            engine.dispose()
        }
    }
}

/**
 * 
 * @param {Card} card 
 * @param {Context} context 
 * @returns 
 */
export function createCardView(card, context){
    //const card_element = MeshBuilder.CreateBox("card", {width:0.8, height:0.05, depth:1}, context.scene)
    const card_element = new TransformNode("card", context.scene)
    
    const back = MeshBuilder.CreatePlane("back", {width:0.8, height:1}, context.scene)
    back.parent = card_element
    back.rotation = new Vector3(Math.PI/2,0,0)
    back.material = context.materials.paper
    
    const title = MeshBuilder.CreateText("title", card.getName(), context.fonts.droid, {size:0.06, depth:0.01}, context.scene)
    title.parent = card_element
    title.position = new Vector3(0,0.01,-.38)
    title.rotation = new Vector3(Math.PI/2,Math.PI,0)
    title.material = context.materials.black

    const desc = createTextView(card.getDescription(),context)
    desc.parent = card_element
    desc.position = new Vector3(0,0.01,0.19)
    
    const picture = createPictureView(card.getPicture(),context)
    picture.parent = card_element
    picture.position = new Vector3(0,0.01,-0.1)
    picture.scaling = new Vector3(0.5,0.1,0.5)

    return {
        mesh: card_element,
        dispose(){
            card_element.dispose()
        }
    }
}

/**
 * 
 * @param {Picture} picture 
 * @param {Context} context 
 */
export function createPictureView(picture,context){
    const baked = picture.baked().addShadow([.44,.44]).addOcclusion(.5).addReflection([.44,.44])
    const meshes = []

    const pixel_width = 1/picture.width
    const pixel_height = 1/picture.height
    for(const [x,y] of baked.indexes()){
        const pixel = baked.get(x,y)
        if(!pixel.is_empty){
            const box = MeshBuilder.CreateBox("pixel", {width:pixel_width, height:pixel.depth*1.5+.2, depth:pixel_height}, context.scene)
            box.position = new Vector3(x*pixel_width-0.5, 0.2, y*pixel_height-0.5)
            box.setVerticesData("color", Array(24).fill([...pixel.color,pixel.alpha]).flat())
            meshes.push(box)
        }
    }
    const merged = Mesh.MergeMeshes(meshes, true)
    merged.material = context.materials.white
    return merged
}

/**
 * Create a html element from a text object.
 * @param {import("../text/Text.js").Text} text
 * @param {Context} context 
 */
export function createTextView(text,context){
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
        if(text.length>28){
            texts[i] = text.slice(0,28)
            texts.splice(i+1, 0, text.slice(28))
        }
    }

    const parent = new TransformNode("text", context.scene)
    for(let i=0; i<texts.length; i++){
        const text = texts[i]
        console.log(text)
        if(text==null) continue
        const mesh = MeshBuilder.CreateText("text", text, context.fonts.droid, {size:0.035, depth:0.01}, context.scene)
        mesh.parent = parent
        mesh.position = new Vector3(0,0,0.037*i)
        mesh.rotation = new Vector3(Math.PI/2,Math.PI,0)
        mesh.material = context.materials.black
    }
    return parent
}