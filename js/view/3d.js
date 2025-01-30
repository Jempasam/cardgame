import { Card } from "../cardgame/card/Card.js"
import { Game } from "../cardgame/Game.js"
import { Player } from "../cardgame/Player.js"
import { createGameView } from "../cardgame/view/3d_view.js"
import { PromiseChain } from "../utils/promises.js"
import { get } from "../utils/query.js"

const card_types = Object.values(await import("../yugioh/cards.js"))

// Create game
let game=new Game()
game.players.push(new Player(), new Player())
for(let i=0; i<20; i++)for(const p of [0,1]){
    game.players.get(p).draw_pile.push(new Card(card_types[Math.floor(Math.random()*card_types.length)]))
}

// Create view
let chain = new PromiseChain()
const gui = await createGameView(game,chain)
get("main") .replaceChildren(gui.element)
