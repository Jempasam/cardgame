import { Card } from "./card/Card.js";
import { Status } from "./status/Status.js";
import { Game } from "./Game.js";
import { Picture } from "./icon/Picture.js";
import { Field } from "./piece/Field.js";
import { StatusType } from "./status/StatusType.js";
import { MOAutoMap } from "../observable/collections/OAutoMap.js";
import { JaugeType } from "./jauge/JaugeType.js";
import { Jauge } from "./jauge/Jauge.js";
import { MOArray } from "../observable/collections/OArray.js";

/**
 * @typedef {Object} PlayerContext
 * 
 * @property {Game} game
 * @property {Player} player
 */

export class Player{

    /**
     * The card in the player hand
     * @type {MOArray<Card>}
     */
    hand = new MOArray()

    /**
     * The card in the player deck
     * @type {MOArray<Card>}
     */
    draw_pile = new MOArray()

    /**
     * The cards in the discard pile of the player
     * @type {MOArray<Card>}
     */
    discard_pile = new MOArray()

    /**
     * The Status applied to the player
     * @type {MOAutoMap<StatusType,Status>}
     */
    statuses = new MOAutoMap(it=>it.type)

    /**
     * The field of the player
     */
    field = new Field(3, 3)

    /**
     * The jauges of the player
     * @type {MOAutoMap<JaugeType,Jauge>}
     */
    jauges = new MOAutoMap(it=>it.type, it=>new Jauge(it))

    /**
     * The renderer used to draw the pictures
     * @type {function(CanvasRenderingContext2D, Picture, number):void}
     */
    renderer = (context,picture,player) => picture.drawShadedTo(context, player%2==0 ? [0.6,0.6] : [-0.6,-0.6])
    
}