
/**
 * A type of card.
 */
export class CardType{
    
    /**
     * A type of card
     * @param {string} name 
     * @param {import("../icon/Icon").IconCode} icon 
     * @param {string} description
     * @param {CardEffect[]} effects 
     */
    constructor(name, icon, description, effects){
        this.name = name
        this.icon = icon
        this.description = description
        this.effects = effects
    }
}