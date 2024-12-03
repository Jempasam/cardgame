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
     * @returns {boolean} True if the card was played, false if it was cancelled.
     */
    onPlay(context){
        return false
    }

    /**
     * Called when a card with this effect is drawn.
     * @param {CardEffectContext} context
     * @returns {boolean} True if the card was played, false if it was cancelled.
     */
    onDraw(context){
        return false
    }

    /**
     * Called when a card with this effect is discarded from the hand.
     * @param {CardEffectContext} context
     * @returns {boolean} True if the card was played, false if it was cancelled.
     */
    onDiscard(context){
        return false
    }

    /**
     * Called when the game starts if this card is in the deck, discardpile or hand of any player.
     * @param {CardEffectContext} context
     * @returns {boolean} True if the card was played, false if it was cancelled.
     */
    onGameStart(context){
        return false
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

    /**
     * Get the color of the effect.
     * @returns {[number,number,number]}
     */
    getColor(){
        return [0,0,0]
    }

}