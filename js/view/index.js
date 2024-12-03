import { Card } from "../cardgame/card/Card.js"
import { CardType } from "../cardgame/card/CardType.js"
import { playGame } from "../cardgame/engine/play.js"
import { Game } from "../cardgame/Game.js"
import { drawIcon } from "../cardgame/icon/Icon.js"
import { Picture } from "../cardgame/icon/Picture.js"
import { JaugeType } from "../cardgame/jauge/JaugeType.js"
import { Player } from "../cardgame/Player.js"
import { Status } from "../cardgame/status/Status.js"
import { StatusType } from "../cardgame/status/StatusType.js"
import { createCardListView, createGameView, createJaugesView, createStatusListView, HTMLViewController } from "../cardgame/view/html_view.js"
import { html } from "../utils/doc.js"
import { PromiseChain, until } from "../utils/promises.js"
import { get } from "../utils/query.js"

let pictures = await fetch(import.meta.resolve("./picture/shapes.json"))
    .then(it=>it.json())
    .then(it=>Object.fromEntries(Object.entries(it).map(([key, value]) => [key, new Picture(...value)])))

let dragon_type = new CardType( "Dragon", pictures.dragon, ["a ",{strong:"dangerous"}," and terrifying dragon having ",32," teeth."], [] )
let fish_type = new CardType( "Fish", pictures.bird, ["a delicours fish"], [] )
let goblin_type = new CardType( "Goblin", pictures.goblin, ["a mischievelous goblin"], [] )

let poison_type = new StatusType("Poison", pictures.poison)
let bleed_type = new StatusType("Bleeding", pictures.blood)

let life_type = new JaugeType(0, 100, 50, [1,0,0], "Life")

const card_types = Object.values(await import("../yugioh/cards.js"))

//let status= [poison_type,bleed_type].map(it=>new Status(it, 2, 3))

// Create game
let game=new Game()
game.players.push(new Player(), new Player())
for(let i=0; i<20; i++)for(const p of [0,1]){
    game.players.get(p).draw_pile.push(new Card(card_types[Math.floor(Math.random()*card_types.length)]))
}

// Create view
let chain = new PromiseChain()
const gui = createGameView(game,chain)
get("main") .replaceChildren(gui.element)

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

let it = playGame(game, [new HTMLViewController(gui),new HTMLViewController(gui)])
while(true){
    await new Promise(resolve=>chain.do(async()=>resolve()))
    if((await it.next()).done)break
}