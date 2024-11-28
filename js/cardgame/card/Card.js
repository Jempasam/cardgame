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
        for(let effect of this.type.effects) text.push(effect.getDescription())
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
     * @param {keyof CardEffect} event
     * @param {"draw"|"play"|"discard"|"start"} type 
     * @param {import("../Player.js").PlayerContext} context 
     */
    #onEvent(event, type, context){
        const game= context.game
        const ccontext= {...context, card:this, type};
        for(let effect of [...this.type.effects, ...this.effects]){
            console.log("Effect", effect)
            const econtext = {...ccontext, effect}
            game.on_card_effect.notify(
                econtext,
                ()=>{
                    //@ts-ignore
                    effect[event](econtext)
                }
            )
        }
    }

    /**
     * Called when a card with this effect is played.
     * @param {import("../Player.js").PlayerContext} context
     */
    onPlay(context){
        this.#onEvent("onPlay", "play", context)
    }

    /**
     * Called when a card with this effect is drawn.
     * @param {import("../Player.js").PlayerContext} context
     */
    onDraw(context){
        this.#onEvent("onDraw", "draw", context)
    }

    /**
     * Called when a card with this effect is discarded from the hand.
     * @param {import("../Player.js").PlayerContext} context
     */
    onDiscard(context){
        this.#onEvent("onDiscard", "discard", context)
    }

    /**
     * Called when the game starts if this card is in the deck, discardpile or hand of any player.
     * @param {import("../Player.js").PlayerContext} context
     */
    onGameStart(context){
        this.#onEvent("onGameStart", "start", context)
    }
    
}
