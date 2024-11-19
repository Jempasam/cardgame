
import { Game } from "../Game.js";
import { Player } from "../Player.js";
import { Status } from "./Status.js";


/**
 * @typedef {Object} StatusEffectContext
 * 
 * @property {Game} game
 * @property {Player} player
 * @property {Status} card
 */

/**
 * A status effect.
 */
export class StatusType{
        
        /**
        * A type of effect
        * @param {string} name 
        * @param {string} description 
        */
        constructor(name, description, icon){
            this.name = name;
            this.description = description
            this.icon = icon;
        }
    
        /**
         * When the status effect is given to a player.
         * @param {StatusEffectContext} context 
         */
        onGive(context){
            console.log('Effect played');
        }
    
        /**
         * When the status effect is removed from a player.
         * @param {StatusEffectContext} context 
         */
        onRemove(context){
            console.log('Effect removed');
        }

        /**
         * When the status effect level is changed.
         * @param {StatusEffectContext} context
         * @param {number} from
         * @param {number} to 
         */
        onChangeLevel(context, from, to){
            console.log('Effect level changed');
        }
}