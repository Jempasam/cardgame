import { Picture } from "../icon/Picture.js"
import { CardEffect } from "./CardEffect.js"

/**
 * A type of card.
 */
export class CardType{
    
    /**
     * A type of card
     * @param {string} name 
     * @param {Picture} picture 
     * @param {import("../text/Text.js").Text} description
     * @param {CardEffect[]} effects 
     */
    constructor(name, picture, description, effects){
        this.name = name
        this.picture = picture
        this.description = description
        this.effects = effects
    }
}