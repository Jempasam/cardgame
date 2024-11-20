import { Card } from "./card/Card.js";
import { Status } from "./status/Status.js";
import { Game } from "./Game.js";
import { Picture } from "./icon/Picture.js";
import { Field } from "./piece/Field.js";
import { StatusList } from "./status/StatusList.js";
import { OArray } from "../observable/OArray.js";

/**
 * @typedef {Object} PlayerContext
 * 
 * @property {Game} game
 * @property {Player} player
 */

export class Player{

    /**
     * The card in the player hand
     * @type {OArray<Card>}
     */
    hand = new OArray()

    /**
     * The card in the player deck
     * @type {OArray<Card>}
     */
    draw_pile = new OArray()

    /**
     * The cards in the discard pile of the player
     * @type {OArray<Card>}
     */
    discard_pile = new OArray()

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