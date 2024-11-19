import { Player } from "./Player.js";


export class Game{
    
    /**
     * The players of the game.
     * @type {Player[]}
     */
    players = []

    /**
     * The global effects applied to both player at the same time.
     */
    global_effects = []
}