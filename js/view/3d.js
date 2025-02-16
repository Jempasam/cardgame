import { Card } from "../cardgame/card/Card.js"
import { Game } from "../cardgame/Game.js"
import { Picture } from "../cardgame/icon/Picture.js"
import { JaugeType } from "../cardgame/jauge/JaugeType.js"
import { Player } from "../cardgame/Player.js"
import { Status } from "../cardgame/status/Status.js"
import { StatusType } from "../cardgame/status/StatusType.js"
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

for(let i=0; i<5; i++) game.drawCard(game.players.get(0))

    // Create view
let chain = new PromiseChain()
const gui = await createGameView(game,chain)
get("main") .replaceChildren(gui.element)


// Debug keys
let pictures = await fetch(import.meta.resolve("../editor/picture/shapes.json"))
    .then(it=>it.json())
    .then(it=>Object.fromEntries(Object.entries(it).map(([key, value]) => [key, new Picture(...value)])))
let poison_type = new StatusType("Poison", pictures.poison)
let bleed_type = new StatusType("Bleeding", pictures.blood)
let life_type = new JaugeType("Life", [1,0,0],0, 100, 50,)

document.addEventListener("keydown", (event) => {
    switch(event.key){
        case "d":
            console.log("Add card")
            game.players.get(0).hand.push(new Card(card_types[Math.floor(Math.random()*card_types.length)]))
            break
        case "e":
            console.log("Add card to drawpile")
            game.players.get(0).draw_pile.push(new Card(card_types[Math.floor(Math.random()*card_types.length)]))
            break
        case "r":
            console.log("Draw a card")
            game.drawCard(game.players.get(0))
            break
        case "t":
            console.log("Add to discardpile")
            game.players.get(0).discard_pile.push(new Card(card_types[Math.floor(Math.random()*card_types.length)]))
        case "p":
            console.log("Add poison")
            game.players.get(0).statuses.set(new Status(poison_type, 2, 3))
            break
        case "b":
            console.log("Add bleeding")
            game.players.get(0).statuses.set(new Status(bleed_type, 1, 4))
            break
        case "j":
            console.log("Add jauge")
            game.players.get(0).jauges.get_or_create(life_type)
            break
    }
})