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
    
    let pass_count=0 // Number of turn passed

    game.start()
    while(game.winner==null){
        const player = game.players.get(game.current_turn.value % game.players.length)
        const controller = controllers[game.current_turn.value % controllers.length]

        game.drawCard(player)
        if(player.hand.length==0){
            pass_count++
            if(pass_count>=4)break
            game.current_turn.value++
            continue
        }
        else pass_count=0

        yield
        let choosed=-1
        for(let i=0; i<10 && (choosed<0 || choosed>=player.hand.length); i++){
            console.log("Asking for card",choosed)
            choosed = await controller.askForCard(game, player, player.hand, "play a card", i, "bad card number")
        }
        if(choosed>=0 && choosed<player.hand.length){
            game.playCard(player, player.hand.get(choosed))
        }
        game.current_turn.value++
    }

}