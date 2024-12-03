import { OArray } from "../../observable/OArray.js";
import { MOMap, OMap } from "../../observable/OMap.js";
import { html } from "../../utils/doc.js";
import { PromiseChain, sleep } from "../../utils/promises.js";
import { Card } from "../card/Card.js";
import { Controller } from "../controller/Controller.js";
import { Game } from "../Game.js";
import { Jauge } from "../jauge/Jauge.js";
import { JaugeType } from "../jauge/JaugeType.js";
import { Player } from "../Player.js";
import { Status } from "../status/Status.js";
import { StatusType } from "../status/StatusType.js";
import { createTextElement } from "../text/Text.js";

export class HTMLViewController extends Controller{
    /**
     * @param {{players:HTMLElement[],display_container:HTMLElement,display:HTMLElement}} element 
     */
    constructor(element){
        super()
        this.players = element.players.map(player=>{
            let hand = player.querySelector(".hand")
            let statuses = player.querySelector(".status_list")
            let jauges = player.querySelector(".jauges")
            let pile = player.querySelector(".card_back")
            return {hand,statuses,jauges,pile}
        })
        this.display_container = element.display_container
        this.display = element.display
    }

    /** @type {Controller['askForCard']} */ 
    async askForCard(game,player,from,reason,retry_count,retry_reason){
        if(from != player.hand)return 0
        console.log("Asking for card",reason)

        // Get the player element
        let player_element = this.players[game.players.values().indexOf(player)]
        player_element.hand.classList.add("selectable")

        // Get selection
        let ret=await new Promise(resolve=>{
            let i=0
            console.log(player_element.hand.children)
            for(let card of player_element.hand.children)if(card.classList.contains("card")){
                //@ts-ignore
                console.log(card)
                let id=i
                card.onclick = e=>{ resolve(id) }   
                i++
            }
        })
        for(let card of player_element.hand.children)card.onclick=undefined
        player_element.hand.classList.remove("selectable")
        console.log("Selected card",ret)
        return ret
    }
}

/**
 * Create a view for a game.
 * @param {Game} game The game to show
 * @param {PromiseChain} chain The promise chain used for the animations
 * */
export function createGameView(game, chain){
    let disposes=[]

    // Create elements
    let element, display_container, display, player_views
    {
        player_views = game.players.values().map((it,ix)=>createPlayerView(game,it,ix,chain))
        player_views.forEach(it=>disposes.push(it.dispose))
        let childs = player_views.map( it => html`${it.element}<hr/>` )
        let child_elements = html`${childs}`
        child_elements.lastChild.remove()
        element = html`
            <div class="field">
                ${child_elements}
            </div>
            <div class="centered_display" @${it=>display_container=it}>
                <div class="_displayed" @${it=>display=it}></div>
            </div>
        `
    }

    // Change turn animation
    {
        game.current_turn.observable.register(()=>chain.do(async()=>{
            for(let player of player_views) player.element.classList.add("aside")
            let current_player = player_views[game.current_turn.value % player_views.length]
            current_player.element.classList.remove("aside")
            await sleep(500)
        }))
        for(let player of player_views) player.element.classList.add("aside")
        player_views[0].element.classList.remove("aside")
    }

    // Use Effect Animation
    {
        let display_container= element.querySelector(".centered_display")   
        disposes.push(game.on_card_effect.after.register(({card,effect})=>{
            chain.do(async()=>{
                let color = getCssColor([...effect.getColor(),1.0])
                display.replaceChildren(html`
                    <div class="effect" style="--effect-color:${color};">${createCardView(card)}</div>
                    <p class="text_box">${createTextElement(effect.getDescription())}</p>
                `)
                display_container.classList.add("_shown")
                await sleep(500)
                display.replaceChildren()
                display_container.classList.remove("_shown")
            })
        }))
    }

    return {
        players: player_views.map(it=>it.element),
        display_container,
        display,
        element,
        dispose(){ disposes.forEach(it=>it()) },
    }
}

/**
 * @param {Game} game
 * @param {Player} player
 * @param {number} number 
 * @param {PromiseChain} chain  
 **/
export function createPlayerView(game,player,number,chain){
    let hand = createCardListView(chain,player.hand)
    let statuses = createStatusListView(chain,player.statuses)
    let jauges = createJaugesView(chain,player.jauges)
    let pile = createDeckPile(40, chain, player.draw_pile)
    let element
    if(number%2==0){
        element = html`
            <div>${hand.element}</div>
            <div class="columns">
                <div>
                    <div class="status_list">${statuses.element}</div>
                    <div class="jauges">${jauges.element}</div>
                </div>
                <ul><li><div>${pile.element}</div></li></ul>
            </div>
            
        `
    }
    else {
        element = html`
            <div class="columns">
                <div>
                    <div class="jauges">${jauges.element}</div>
                    <div class="status_list">${statuses.element}</div>
                </div>
                <ul><li><div>${pile.element}</div></li></ul>
            </div>
            <div>${hand.element}</div>
        `
    }
    element = html.a`
        <div class="player asideable" style="--team-color:${player_colors[number%player_colors.length]};">
        ${element}
        </div>
    `
    return { element, dispose(){hand.dispose(),statuses.dispose(),jauges.dispose(),pile.dispose()} }
}

const player_colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown"]

/**
 * @param {PromiseChain} chain The promise chain used for the animations
 * @param {OArray<Card>} cards
 * @param {function(Card,HTMLElement):void=} callback
 * */
export function createCardListView(chain, cards, callback){
    return createListView(chain,"hand -overlap card-height", cards, it=>{
        let elem=createCardView(it);
        if(callback) callback(it,elem);
        return {element:elem,dispose:()=>{}}
    })
}

/**
 * Create a deck visual growing and shortening depending on his content.
 * @param {number} max_size The size of the full deck
 * @param {PromiseChain} chain The promise chain used for the animations
 * @param {OArray<any>} list
 * @param {function(any,HTMLElement):void=} callback
 */
export function createDeckPile(max_size, chain, list, callback){
    let element = html.a`<div class="card_back"></div>`

    function updatesize(){
        element.classList.remove("_deck1","_deck2","_deck3","_deck4","_deck5","_deck6","_deck7","_deck8","_deck9","_empty")
        if(list.length==0) element.classList.add("_empty")
        const ret = Math.min(9, Math.floor(list.length/max_size*9))
        if(ret>0) element.classList.add("_deck"+ret)
    }

    updatesize()

    let onadd = list.observable.on_add.register(()=> chain.do(async()=>{
        let over = html.a`<div class="card_back _over anim_add"></div>`
        element.appendChild(over)
        await sleep(190)
        updatesize()
        await sleep(10)
        over.remove()
    }))

    let onremove = list.observable.on_remove.register(()=>chain.do(async()=>{
        let over = html.a`<div class="card_back _over anim_remove"></div>`
        element.appendChild(over)
        await sleep(190)
        updatesize()
        await sleep(10)
        over.remove()
    }))

    return { element, dispose(){onadd(),onremove()} }
}

/**
 * @param {PromiseChain} chain
 * @param {OMap<StatusType,Status>} statuses
 * */
export function createStatusListView(chain, statuses){
    let element = html.a`<ul class="status_list"></ul>`
    let list = statuses.observable_values()
    return createListView(chain,"status_list", list, it=>({element:createStatusView(it), dispose(){}}))
}

/**
 * @param {PromiseChain} chain The promise chain used for the animations
 * @param {OMap<JaugeType,Jauge>} jauges
 * */
export function createJaugesView(chain,jauges){
    let list = jauges.observable_values()
    let { element, dispose } = createListView(chain,"jauges", list, it=>createJaugeView(chain,it))
    return { element, dispose(){ list.dispose(), dispose() }}
}



/**
 * Create a view for a array of objects.
 * @template T
 * @param {PromiseChain} chain The promise chain used for the animations
 * @param {string} classes
 * @param {OArray<T>} array
 * @param {function(T):{element:HTMLElement,dispose:function():void}} view_fn
 */
export function createListView(chain, classes, array, view_fn){
    let element = html.a`<ul class="${classes}"><div style="display:none;"></div></ul>`
    let disposables = []
    array.values().forEach(card =>{
        let {element:elem,dispose} =  view_fn(card)
        disposables.push(dispose)
        element.appendChild(elem)
    })
    let add= array.observable.on_remove.register( ({index}) =>{
        chain.do(async()=>{
            const removed= element.children[index]
            removed.classList.add("anim_remove","anim_grow")
            await sleep(200)
            removed.classList.remove("anim_remove")
            removed.remove()
            disposables[index]()
            disposables.splice(index,1)
        })
        
    })
    let remove= array.observable.on_add.register( ({value,index}) =>{
        chain.do(async()=>{
            let {element:elem,dispose} =  view_fn(value)
            disposables.splice(index,0,dispose)
            element.children[index].before(elem)
            elem.classList.add("anim_add")
            await sleep(200)
            elem.classList.remove("anim_add")
        })
    })
    return { element, dispose(){add(),remove()} };
}

/**
 * Create view for a given card.
 * @param {Card} card 
 * @returns {HTMLElement}
 */
export function createCardView(card){
    let canvas = /** @type {HTMLCanvasElement} */(html.a`<canvas class="-icon" width=48 height=48></canvas>`)
    let picture = card.getPicture()
    const ctx = canvas.getContext("2d")
    ctx.scale(canvas.width, canvas.height);
    const angle = Math.random()*Math.PI*2
    const light_direction = /** @type {[number,number]} */ ([0.5,0.4])
    picture.baked()
        .addOcclusion()
        .addShadow(light_direction)
        .addReflection(light_direction)
        .addOuterOutline(undefined,true)
        .addAlphaThickness()
        .addCastedShadow(light_direction)
        .addGloom()
        .smoothed()
        .draw(ctx)
    return html.a`
        <div class=card>
            <h3>${card.getName()}</h3>
            ${canvas}
            <div class="-description">
                ${createTextElement(card.getDescription())}
            </div>
        </div>
    `
}

/**
 * Create view for a given status.
 * @param {Status} status
 * @returns {HTMLElement}
 */
export function createStatusView(status){
    let canvas = /** @type {HTMLCanvasElement} */(html.a`<canvas class="-icon" width=16 height=16></canvas>`)
    let picture = status.type.picture
    const ctx = canvas.getContext("2d")
    ctx.scale(canvas.width, canvas.height);
    picture.baked()
        .addOcclusion()
        .addShadow([0.4,0.4])
        .addReflection([0.4,0.4])
        .addOuterOutline(undefined,true)
        .addAlphaThickness()
        .addCastedShadow([0.4,0.4])
        .addGloom()
        .smoothed()
        .draw(ctx)
    return html.a`
        <div class="status">
            ${canvas}
            <div class="-lifetime">${status.lifetime}</div>
            <div class="-level">${getRomanNumber(status.level)}</div>
            <p class="-description">${createTextElement([{"strong":status.type.name},status.type.getDescription()])}</p>
        </div>
    `
}

/**
 * Create view for a given jauge.
 * @param {PromiseChain} chain
 * @param {Jauge} jauge
 * @returns {{element:HTMLElement,dispose:function():void}}
 */
export function createJaugeView(chain,jauge){
    const progress = Math.round(jauge.current/(jauge.maximum-jauge.minimum)*100)
    let filler_element
    const element=html.a`
    <li>
        <div class="jauge" style="--jauge-color:${getCssColor([...jauge.type.color,1.0])};">
            <div class="-filler" style="width:${progress}%;" @${e=>filler_element=e}>${jauge.current}</div>
        </div>
    </li>
    `
    function update(){
        chain.do(async()=>{
            const progress = Math.round(jauge.current/(jauge.maximum-jauge.minimum)*100)
            filler_element.style.width=`${progress}%`
            filler_element.textContent=jauge.current
            element.classList.add("anim_bump")
            await sleep(400)
            element.classList.remove("anim_bump")
        })
    }
    let c = jauge.current_observable.register(update)
    let m = jauge.maximum_observable.register(update)
    let n = jauge.minimum_observable.register(update)
    return { element, dispose(){c(),m(),n()} }
}

/**
 * Create a css string for a rgba color.
 * @param {[number,number,number,number]} rgba 
 */
export function getCssColor(rgba){
    return `rgba(${Math.floor(rgba[0]*255)},${Math.floor(rgba[1]*255)},${Math.floor(rgba[2]*255)},${rgba[3]})`
}

/**
 * Stringify a number to a roman number.
 * @param {number} number 
 */
function getRomanNumber(number){
    let final = "";
    if (number > 1000) final += "M".repeat(Math.floor(number / 1000)), number %= 1000;
    if (number > 900) final += "CM", number -= 900;
    if (number > 500) final += "D", number -= 500;
    if (number > 400) final += "CD", number -= 400;
    if (number > 100) final += "C".repeat(Math.floor(number / 100)), number %= 100;
    if (number > 90) final += "XC", number -= 90;
    if (number > 50) final += "L", number -= 50;
    if (number > 40) final += "XL", number -= 40;
    if (number > 10) final += "X".repeat(Math.floor(number / 10)), number %= 10;
    if (number > 9) final += "IX", number -= 9;
    if (number > 5) final += "V", number -= 5;
    if (number > 4) final += "IV", number -= 4;
    final += "I".repeat(number);
    return final;
}
