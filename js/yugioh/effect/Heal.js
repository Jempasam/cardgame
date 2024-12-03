import { CardEffect } from "../../cardgame/card/CardEffect.js";
import { LIFE_BAR } from "../jauge/jauges.js";

export class HealCardEffect extends CardEffect{

    /**
     * 
     * @param {number} count 
     */
    constructor(count){
        super()
        this.count = count
    }

    /**
     * @override
     * @param {import("../../cardgame/card/CardEffect.js").CardEffectContext} context 
     */
    onPlay(context){
        const lifebar = context.player.jauges.get_or_create(LIFE_BAR)
        lifebar.current+= this.count
        return true
    }
    
    getDescription(){
        return [`heal ${this.count} lifepoints to the caster`]
    }

    /** @type {CardEffect['getColor']} */ 
    getColor(){ return [0,1,0] }
}