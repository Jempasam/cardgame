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


export interface PlayerContext{
    game: Game
    player: Player
}

export class Player{

    /**
     * The card in the player hand
     */
    hand = new MOArray<Card>()

    /**
     * The card in the player deck
     */
    draw_pile = new MOArray<Card>()

    /**
     * The cards in the discard pile of the player
     */
    discard_pile = new MOArray<Card>()

    /**
     * The Status applied to the player
     */
    statuses = new MOAutoMap<StatusType,Status>(it=>it.type)

    /**
     * The field of the player
     */
    field = new Field(3, 3)

    /**
     * The jauges of the player
     */
    jauges = new MOAutoMap<JaugeType,Jauge>(it=>it.type, it=>new Jauge(it))

    /**
     * The renderer used to draw the pictures
     */
    renderer = (context: CanvasRenderingContext2D, picture: Picture, player: number) => picture.drawShadedTo(context, player%2==0 ? [0.6,0.6] : [-0.6,-0.6])
    
}