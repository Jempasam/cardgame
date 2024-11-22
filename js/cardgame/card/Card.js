import { html } from "../../utils/doc.js";
import { createTextElement } from "../text/Text.js";
import { CardEffect } from "./CardEffect.js";
import { CardType } from "./CardType.js";


/**
 * A card.
 */
export class Card{

    /**
     * The effect dynamically applied to the card. 
     * @type {CardEffect[]}
     **/
    effects = []

    /**
     * @param {CardType} type 
     */
    constructor(type){
        this.type = type;
    }

    /**
     * Called when a card with this effect is played.
     * @param {import("../Player").PlayerContext} context
     */
    onPlay(context){
        this.type.effects.forEach(it => it.onPlay({...context, card:this, effect:it}))
        this.effects.forEach(effect => effect.onPlay({...context, card:this, effect}))
    }

    /**
     * Called when a card with this effect is drawn.
     * @param {import("../Player").PlayerContext} context
     */
    onDraw(context){
        this.type.effects.forEach(it => it.onDraw({...context, card:this, effect:it}))
        this.effects.forEach(effect => effect.onDraw({...context, card:this, effect}))
    }

    /**
     * Called when a card with this effect is discarded from the hand.
     * @param {import("../Player").PlayerContext} context
     */
    onDiscard(context){
        this.type.effects.forEach(it => it.onDiscard({...context, card:this, effect:it}))
        this.effects.forEach(effect => effect.onDiscard({...context, card:this, effect}))
    }

    /** Get the name of the card. */
    getName(){
        let name = this.type.name
        for(let effect of this.effects){
            name = effect.decorateName(name)
        }
        return name;
    }

    /** Get the description of the card. */
    getDescription(){
        let text = [this.type.description]
        for(let effect of this.effects) text.push(effect.getDescription())
        return text
    }

    /** Get the picture of the card. */
    getPicture(){
        let picture = this.type.picture
        for(let effect of this.effects){
            picture = effect.decoratePicture(picture)
        }
        return picture;
    }

    /**
     * @returns {HTMLElement}
     */
    createElement(){
        let canvas = /** @type {HTMLCanvasElement} */(html.a`<canvas class="-icon" width=64 height=64></canvas>`)
        let picture = this.getPicture()
        const ctx = canvas.getContext("2d")
        ctx.scale(canvas.width, canvas.height);
        picture.drawSmoothShadedTo(ctx, [0.4,0.4], {outline:true,shadow:true})
        return html.a`
            <div class=card>
                <h3>${this.getName()}</h3>
                ${canvas}
                <div class="-description">
                    ${createTextElement(this.getDescription())}
                </div>
            </div>
        `
    }
}