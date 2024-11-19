import { Game } from "../Game.js";
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
     * @param {string} description 
     */
    constructor(description){
        this.description = description
    }

    /**
     * Called when a card with this effect is played.
     * @param {CardEffectContext} context
     */
    onPlay(context){
        console.log('Card played');
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
     * Called on the card name to decorate it.
     * @param {string} name
     * @returns {string}
     */
    decorateName(name){
        return name;
    }

    /**
     * Called on the card .
     * @param {import("../icon/Icon").IconCode} icon_code
     * @returns {import("../icon/Icon").IconCode}
     */
    decorateIcon(icon_code){
        return icon_code;
    }

}