import { PieceType } from "./PieceType.js";


export class Field{

    readonly cells: (PieceType|null)[][]

    constructor(
        readonly width: number,
        readonly height: number
    ){
        this.cells = Array.from({length: width}, () => Array.from({length: height}, () => null as PieceType|null));
    }
    
}