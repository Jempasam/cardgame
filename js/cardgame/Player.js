import { Card } from "./card/Card.js";
import { Status } from "./effect/Status.js";
import { Game } from "./Game.js";
import { Field } from "./piece/Field.js";

/**
 * @typedef {Object} PlayerContext
 * 
 * @property {Game} game
 * @property {Player} player
 */

export class Player{

    /**
     * The card in the player hand
     * @type {Card[]}
     */
    hand = []

    /**
     * The card in the player deck
     * @type {Card[]}
     */
    drawpile = []

    /**
     * The Status applied to the player
     * @type {Status[]}
     */
    effects = []

    /**
     * The field of the player
     */
    field = new Field(3, 3);
}