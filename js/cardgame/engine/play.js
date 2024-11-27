import { Controller } from "../controller/Controller.js";
import { Game } from "../Game.js";


/**
 * Play the game with the given controllers.
 * A game can be resumed after a call to this function.
 * Yield before each player action 
 * @param {Game} game 
 * @param {Controller[]} controllers 
 */
export async function *playGame(game, controllers){
    console.assert(controllers.length==game.players.length)
    
    game.start()
    while(game.winner==null){
        const player = game.players.get(game.current_turn.value % game.players.length)
        const controller = controllers[game.current_turn.value % controllers.length]

        yield
        let choosed=-1
        for(let i=0; i<10 && choosed>=0 && choosed<player.hand.length; i++)
            choosed = await controller.askForCard(game, player, player.hand, "play a card", i, "bad card number")

        if(choosed>=0 && choosed<player.hand.length){
            game.playCard(player, player.hand.get(choosed))
        }
        game.current_turn.value++
    }

}