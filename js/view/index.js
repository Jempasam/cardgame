import { Card } from "../cardgame/card/Card.js"
import { CardType } from "../cardgame/card/CardType.js"
import { Game } from "../cardgame/Game.js"
import { drawIcon } from "../cardgame/icon/Icon.js"
import { Picture } from "../cardgame/icon/Picture.js"
import { JaugeType } from "../cardgame/jauge/JaugeType.js"
import { Player } from "../cardgame/Player.js"
import { Status } from "../cardgame/status/Status.js"
import { StatusType } from "../cardgame/status/StatusType.js"
import { createCardListView, createGameView, createJaugesView, createStatusListView } from "../cardgame/view/html_view.js"
import { html } from "../utils/doc.js"
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

//let status= [poison_type,bleed_type].map(it=>new Status(it, 2, 3))

// Create game
let game=new Game()
game.players.push(new Player(), new Player())

// Create view
get("main") .replaceChildren(createGameView(game).element)

document.addEventListener("keydown", (event) => {
    switch(event.key){
        case "d":
            console.log("Add card")
            game.players.get(0).hand.push(new Card([dragon_type, fish_type, goblin_type][Math.floor(Math.random()*3)]))
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
