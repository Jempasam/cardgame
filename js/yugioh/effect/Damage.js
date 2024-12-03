import { CardEffect } from "../../cardgame/card/CardEffect.js";
import { LIFE_BAR } from "../jauge/jauges.js";

export class DamageCardEffect extends CardEffect{

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
        const other_player= context.game.players.values().next(context.player)
        const lifebar = other_player.jauges.get_or_create(LIFE_BAR)
        lifebar.current-= this.count
        if(lifebar.current<=0){
            context.game.winner??=context.player
        }
        return true
    }

    getDescription(){
        return [`deal ${this.count} damages to the opponent`]
    }

    /** @type {CardEffect['getColor']} */ 
    getColor(){ return [1,0,0] }
}