import { Picture } from "../icon/Picture.js"
import { Text } from "../text/Text.js"
import { CardEffect } from "./CardEffect.js"

/**
 * A type of card.
 */
export class CardType{
    
    /**
     * A type of card
     * @param name 
     * @param picture 
     * @param description
     * @param effects 
     */
    constructor(
        readonly name: string, 
        readonly picture: Picture, 
        readonly description: Text, 
        readonly effects: CardEffect[]
    ){ }
}