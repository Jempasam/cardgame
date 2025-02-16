
import { Game } from "../Game.js";
import { Picture } from "../icon/Picture.js";
import { Player } from "../Player.js";
import { Text } from "../text/Text.js";
import { Status } from "./Status.js";


export interface StatusEffectContext{
    game: Game
    player: Player
    card: Status
}

/**
 * A status effect.
 */
export class StatusType{
        
        /**
        * A type of effect
        * @param name 
        * @param picture
        */
        constructor(
            readonly name: string, 
            readonly picture: Picture
        ){ }
    
        /**
         * When the status effect is given to a player.
         */
        onGive(context: StatusEffectContext){
            console.log('Effect played');
        }
    
        /**
         * When the status effect is removed from a player.
         */
        onRemove(context: StatusEffectContext){
            console.log('Effect removed');
        }

        /**
         * When the status effect level is changed.
         */
        onChangeLevel(context: StatusEffectContext, from: number, to: number){
            console.log('Effect level changed');
        }

        /**
         * Get the description of the effect.
         */
        getDescription(): Text{
            return null
        }
}