import { OArray, OArrayObservable } from "../observable/OArray.js";
import { Observable } from "../observable/Observable.js";
import { OValue } from "../observable/OValue.js";
import { Player } from "./Player.js";


export class Game{

    /** @type {Observable<{previous:number,current:number}>} */
    after_turn_change = new Observable()
    
    /**
     * The players of the game.
     * @type {OArray<Player>}
     */
    players = new OArray()
    
    /**
     * The current turn number
     */
    current_turn= new OValue(0)
}