import { Game } from "../Game.js";
import { Picture } from "../icon/Picture.js";
import { Player } from "../Player.js";
import { Card } from "./Card.js";

/**
 * @typedef {Object} CardEffectContext
 * 
 * @property {Game} game
 * @property {Player} player
 * @property {Card} card
 * @property {CardEffect} effect
 */

/**
 * A card effect.
 */
export class CardEffect{

    /**
     * Called when a card with this effect is played.
     * @param {CardEffectContext} context
     */
    onPlay(context){
    }

    /**
     * Called when a card with this effect is drawn.
     * @param {CardEffectContext} context
     */
    onDraw(context){
    }

    /**
     * Called when a card with this effect is discarded from the hand.
     * @param {CardEffectContext} context
     */
    onDiscard(context){
    }

    /**
     * Called when the game starts if this card is in the deck, discardpile or hand of any player.
     * @param {CardEffectContext} context
     */
    onGameStart(context){
    }

    /**
     * Called on the card name to decorate it.
     * @param {string} name
     * @returns {string}
     */
    decorateName(name){
        return name;
    }

    /**
     * Called on the card .
     * @param {Picture} picture
     * @returns {Picture}
     */
    decoratePicture(picture){
        return picture;
    }

    /**
     * Get the description of the effect.
     * @returns {import("../text/Text.js").Text}
     */
    getDescription(){
        return null;
    }

}