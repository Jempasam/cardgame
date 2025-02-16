import { MOArray } from "../observable/collections/OArray.js";
import { MOValue } from "../observable/collections/OValue.js";
import { CancellableOSource } from "../observable/source/CancellableOSource.js";
import { OSource } from "../observable/source/OSource.js";
import { Card } from "./card/Card.js";
import { Player } from "./Player.js";


export class Game{
    
    /**
     * The players of the game.
     */
    players = new MOArray<Player>()
    
    /**
     * The current turn number
     */
    current_turn= new MOValue(0)

    /**
     * The current winner of the game
     */
    winner = null as Player|null

    /**
     * Start the game, initializing the players and the deck.
     */
    start(){
        for(let player of this.players){
            for(let card of [...player.draw_pile, ...player.hand, ...player.discard_pile]){
                card.onGameStart({game:this, player})
            }
        }
    }

    /**
     * Make the player play a card
     * @param player 
     * @param card 
     */
    playCard(player: Player, card: Card){
        console.assert(player.hand.values().includes(card))
        this.on_play_card.notify(
            {game:this, player, card, cancelled:false},
            ()=>{
                card.onPlay({game:this, player})
                const index= player.hand.values().indexOf(card)
                if(index>=0) player.hand.remove(index)
            },
            ()=>{
                player.discard_pile.push(card)
                card.onDiscard({game:this, player})
            }
        )
    }

    /**
     * Make the player draw a card
     * @param player 
     */
    drawCard(player: Player){
        if(player.draw_pile.length<=0)return
        this.on_draw_card.notify({game:this, player, card:null, cancelled:false},
            ()=>{
                const card = player.draw_pile.pop()
                player.hand.push(card)
                return card
            },
            (card)=>{
                card.onDraw({game:this, player})
            }
        )
    }

    on_play_card = new CancellableOSource<{game:Game, player:Player, card:Card, cancelled:boolean}>()

    on_draw_card = new CancellableOSource<{game:Game, player:Player, card:Card, cancelled:boolean}>()

    on_card_effect = new CancellableOSource<import("./card/CardEffect.js").CardEffectContext&{type:"draw"|"play"|"discard"|"start"}>()

    on_game_start = new OSource<{game:Game}>()
}