import { Card } from "./card/Card.js";
import { Status } from "./status/Status.js";
import { Game } from "./Game.js";
import { Picture } from "./icon/Picture.js";
import { Field } from "./piece/Field.js";
import { StatusList } from "./status/StatusList.js";

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
     */
    status = new StatusList()

    /**
     * The field of the player
     */
    field = new Field(3, 3);

    /**
     * The renderer used to draw the pictures
     * @type {function(CanvasRenderingContext2D, Picture, number):void}
     */
    renderer = (context,picture,player) => picture.drawShadedTo(context, player%2==0 ? [0.6,0.6] : [-0.6,-0.6])
}