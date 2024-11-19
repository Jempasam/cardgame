import { html } from "../../utils/doc.js";
import { drawIcon } from "../icon/Icon.js";
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
        this.type.effects.forEach(it => it.onPlay(context))
        this.effects.forEach(effect => effect.onPlay({...context, card:this, effect}))
    }

    /**
     * Called when a card with this effect is drawn.
     * @param {import("../Player").PlayerContext} context
     */
    onDraw(context){
        this.type.effects.forEach(it => it.onDraw(context))
        this.effects.forEach(effect => effect.onDraw({...context, card:this, effect}))
    }

    /**
     * Called when a card with this effect is discarded from the hand.
     * @param {import("../Player").PlayerContext} context
     */
    onDiscard(context){
        this.type.effects.forEach(it => it.onDiscard(context))
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
        let desc = this.type.description[0].toUpperCase() + this.type.description.substring(1) + "."
        for(let effect of this.effects){
            const description = effect.description
            if(description.length > 0) desc+= "\n" + effect.description[0].toUpperCase() + effect.description.substring(1) + "."
        }
        return desc
    }

    /** Get the icon of the card. */
    getIcon(){
        let icon = this.type.icon
        for(let effect of this.effects){
            icon = effect.decorateIcon(icon)
        }
        return icon;
    }

    /**
     * @returns {HTMLElement}
     */
    createElement(){
        let icon = /** @type {HTMLCanvasElement} */(html.a`<canvas class="-icon" width=100 height=100></canvas>`)
        let code = this.getIcon()
        const ctx = icon.getContext("2d")
        ctx.scale(icon.width / 2.2, icon.height / 2.2);
        ctx.translate(1.05, 1.05);
        drawIcon(ctx, code, 60)
        return html.a`
            <div class=card>
                <h3>${this.getName()}</h3>
                ${icon}
                <p>${this.getDescription()}</p>
            </div>
        `
    }
}