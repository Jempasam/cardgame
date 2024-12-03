import { CancellableObserver } from "../observable/CancellableObserver.js";
import { MOArray } from "../observable/OArray.js";
import { Observable } from "../observable/Observable.js";
import { MOValue } from "../observable/OValue.js";
import { Card } from "./card/Card.js";
import { Player } from "./Player.js";


export class Game{
    
    /**
     * The players of the game.
     * @type {MOArray<Player>}
     */
    players = new MOArray()
    
    /**
     * The current turn number
     */
    current_turn= new MOValue(0)

    /**
     * The current winner of the game
     * @type {Player|null}
     */
    winner = null

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
     * @param {Player} player 
     * @param {Card} card 
     */
    playCard(player, card){
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
     * @param {Player} player 
     */
    drawCard(player){
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

    /** @type {CancellableObserver<{game:Game, player:Player, card:Card, cancelled:boolean}>} */
    on_play_card = new CancellableObserver()

    /** @type {CancellableObserver<{game:Game, player:Player, card:Card, cancelled:boolean}>} */
    on_draw_card = new CancellableObserver()

    /** @type {CancellableObserver<import("./card/CardEffect.js").CardEffectContext&{type:"draw"|"play"|"discard"|"start"}>} */
    on_card_effect = new CancellableObserver()

    /** @type {Observable<{game:Game}>} */
    on_game_start = new Observable()
}