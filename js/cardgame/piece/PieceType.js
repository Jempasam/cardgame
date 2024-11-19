import { Status } from "../status/Status.js"
import { PieceEffect } from "./PieceEffect.js"

export class PieceType{

    /**
     * A type of piece
     * @param {string} name 
     * @param {import("../icon/Icon").IconCode} icon 
     * @param {PieceEffect[]} effects 
     */
    constructor(name, icon, effects){
        this.name = name
        this.icon = icon
        this.effects = effects
    }
}