import { Card } from "../cardgame/card/Card.js"
import { CardType } from "../cardgame/card/CardType.js"
import { drawIcon } from "../cardgame/icon/Icon.js"
import { Picture } from "../cardgame/icon/Picture.js"
import { Status } from "../cardgame/status/Status.js"
import { StatusType } from "../cardgame/status/StatusType.js"
import { html } from "../utils/doc.js"

let pictures = await fetch(import.meta.resolve("./picture/shapes.json"))
    .then(it=>it.json())
    .then(it=>Object.fromEntries(Object.entries(it).map(([key, value]) => [key, new Picture(...value)])))

console.log(pictures)

let dragon_type = new CardType( "Dragon", pictures.dragon, "A dangerous and terrifying dragon.", [] )
let fish_type = new CardType( "Fish", pictures.bird, "A delicours fish.", [] )
let goblin_type = new CardType( "Goblin", pictures.goblin, "A mischievelous goblin.", [] )

let poison_type = new StatusType("Poison", "A deadly poison.", pictures.poison)
let bleed_type = new StatusType("Bleeding", "Loosing blood.", pictures.blood)

let cards = Array.from({length: 5}, (_, i) => new Card(Math.random() > 0.5 ? dragon_type : Math.random() > 0.5 ? fish_type : goblin_type))
let status= [poison_type,bleed_type].map(it=>new Status(it, 2, 3))

let hands = document.querySelector(".player .hand")
hands.replaceChildren(html`
    ${cards.map(card => html`<li>${card.createElement()}</li>`)}
`)

let status_list = document.querySelector(".player .status_list")
status_list.replaceChildren(html`
    ${status.map(it=>html`<li>${it.createElement()}</li>`)}
`)