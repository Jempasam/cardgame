import { OArray } from "../../observable/OArray.js";
import { MOMap, OMap } from "../../observable/OMap.js";
import { html } from "../../utils/doc.js";
import { PromiseChain, sleep } from "../../utils/promises.js";
import { Card } from "../card/Card.js";
import { Game } from "../Game.js";
import { Jauge } from "../jauge/Jauge.js";
import { JaugeType } from "../jauge/JaugeType.js";
import { Player } from "../Player.js";
import { Status } from "../status/Status.js";
import { StatusType } from "../status/StatusType.js";
import { createTextElement } from "../text/Text.js";

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

    // Use Effect Animation
    {
        let display_container= element.querySelector(".centered_display")   
        disposes.push(game.on_card_effect.after.register(({card,effect})=>{
            chain.do(async()=>{
                display.replaceChildren(html`
                    ${createCardView(card)}
                    <p class="text_box">${createTextElement(effect.getDescription())}</p>
                `)
                display_container.classList.add("_shown")
                await sleep(500)
                display.replaceChildren()
                display_container.classList.remove("_shown")
            })
        }))
    }
    return { element, dispose(){ disposes.forEach(it=>it()) } }
}

/**
 * @param {Game} game
 * @param {Player} player
 * @param {number} number 
 * @param {PromiseChain} chain  
 **/
export function createPlayerView(game,player,number,chain){
    let hand = createCardListView(player.hand, (card,element) => {
        element.onclick = () => {
            chain.try_do(async()=>{
                element.classList.add("anim_go_up")
                await sleep(200)
                game.playCard(player,card)
                element.classList.remove("anim_go_up")
            })
        }
    })
    let statuses = createStatusListView(player.statuses)
    let jauges = createJaugesView(player.jauges)
    let element
    if(number%2==0){
        element = html`
            <div class="hand">${hand.element}</div>
            <div class="status_list">${statuses.element}</div>
            <div class="jauges">${jauges.element}</div>
        `
    }
    else {
        element = html`
            <div class="jauges">${jauges.element}</div>
            <div class="status_list">${statuses.element}</div>
            <div class="hand">${hand.element}</div>
        `
    }
    element = html.a`
        <div class="player" style="--team-color:${player_colors[number%player_colors.length]};">
        ${element}
        </div>
    `
    return { element, dispose(){hand.dispose(),statuses.dispose(),jauges.dispose()} }
}

const player_colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown"]

/**
 * @param {OArray<Card>} cards
 * @param {function(Card,HTMLElement):void=} callback
 * */
export function createCardListView(cards, callback){
    return createListView("hand -overlap card-height", cards, it=>{
        let elem=createCardView(it);
        if(callback) callback(it,elem);
        return {element:elem,dispose:()=>{}}
    })
}

/** @param {OMap<StatusType,Status>} statuses */
export function createStatusListView(statuses){
    let element = html.a`<ul class="status_list"></ul>`

    function generate(){
        element.replaceChildren()
        let sorted= [...statuses.values()]
        sorted.sort((a,b)=>b.lifetime-a.lifetime)
        sorted.forEach( status => element.appendChild(createStatusView(status)) )
    }

    generate()
    let change= statuses.observable.on_change.register(generate)

    return { element, dispose: change };
}

/** @param {OMap<JaugeType,Jauge>} jauges */
export function createJaugesView(jauges){
    let list = jauges.observable_values()
    let { element, dispose } = createListView("jauges", list, it=>createJaugeView(it))
    return { element, dispose(){ list.dispose(), dispose() }}
}



/**
 * Create a view for a array of objects.
 * @template T
 * @param {string} classes
 * @param {OArray<T>} array
 * @param {function(T):{element:HTMLElement,dispose:function():void}} view_fn
 */
export function createListView(classes, array, view_fn){
    let element = html.a`<ul class="${classes}"><div style="display:none;"></div></ul>`
    let disposables = []
    array.values().forEach(card =>{
        let {element:elem,dispose} =  view_fn(card)
        disposables.push(dispose)
        element.appendChild(elem)
    })
    let add= array.observable.on_remove.register( ({index}) =>{
        element.children[index].remove()
        disposables[index]()
        disposables.splice(index,1)
    })
    let remove= array.observable.on_add.register( ({value,index}) =>{
        let {element:elem,dispose} =  view_fn(value)
        disposables.splice(index,0,dispose)
        element.children[index].before(elem)
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
 * @param {Jauge} jauge
 * @returns {{element:HTMLElement,dispose:function():void}}
 */
export function createJaugeView(jauge){
    const element=html.a`<li></li>`
    function show(){
        const progress = Math.round(jauge.current/(jauge.maximum-jauge.minimum)*100)
        element.replaceChildren(html`
            <div class="jauge" style="--jauge-color:${getCssColor([...jauge.type.color,1.0])};">
                    <div class="-filler" style="width:${progress}%;">${jauge.current}</div>
            </div>
        `)
    }
    show()
    let c = jauge.current_observable.register(show)
    let m = jauge.maximum_observable.register(show)
    let n = jauge.minimum_observable.register(show)
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
