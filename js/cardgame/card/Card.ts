import { html } from "../../utils/doc.js";
import { PlayerContext } from "../Player.js";
import { createTextElement } from "../text/Text.js";
import { CardEffect } from "./CardEffect.js";
import { CardType } from "./CardType.js";


/**
 * A card.
 */
export class Card{

    /**
     * The effect dynamically applied to the card. 
     **/
    effects: CardEffect[] = []

    constructor(readonly type: CardType){}

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
    
    private onEvent(event: keyof CardEffect, type: "draw"|"play"|"discard"|"start", context: PlayerContext){
        const game= context.game
        const ccontext= {...context, card:this, type};
        for(let effect of [...this.type.effects, ...this.effects]){
            const econtext = {...ccontext, effect}
            game.on_card_effect.notify(
                econtext,
                (cancel)=>{
                    //@ts-ignore
                    if(!effect[event](econtext))cancel()
                }
            )
        }
    }

    /**
     * Called when a card with this effect is played.
     */
    onPlay(context: PlayerContext){
        this.onEvent("onPlay", "play", context)
    }

    /**
     * Called when a card with this effect is drawn.
     */
    onDraw(context: PlayerContext){
        this.onEvent("onDraw", "draw", context)
    }

    /**
     * Called when a card with this effect is discarded from the hand.
     */
    onDiscard(context: PlayerContext){
        this.onEvent("onDiscard", "discard", context)
    }

    /**
     * Called when the game starts if this card is in the deck, discardpile or hand of any player.
     */
    onGameStart(context: PlayerContext){
        this.onEvent("onGameStart", "start", context)
    }
    
}
