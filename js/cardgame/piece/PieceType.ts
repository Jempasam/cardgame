import { Picture } from "../icon/Picture.js"
import { PieceEffect } from "./PieceEffect.js"

export class PieceType{

    /**
     * A type of piece
     */
    constructor(
        readonly name: string,
        readonly icon: Picture,
        readonly effects: PieceEffect[]
    ){ }
}