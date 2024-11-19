import { html } from "../../utils/doc.js";
import { drawIcon } from "../icon/Icon.js";
import { StatusType } from "./StatusType.js";

/**
 * An effect, appliable to a player.
 */
export class Status{

    /**
     * @param {StatusType} type The type of the effect instance. 
     * @param {number} level The level of the effect instance.
     * @param {number} lifetime The lifetime of the effect instance.
     */
    constructor(type, level, lifetime){
        this.type = type;
        this.level = level;
        this.lifetime = lifetime;
    }
    
    /**
     * @returns {HTMLElement}
     */
    createElement(){
        let canvas = /** @type {HTMLCanvasElement} */(html.a`<canvas class="-icon" width=16 height=16></canvas>`)
        let picture = this.type.picture
        const ctx = canvas.getContext("2d")
        ctx.scale(canvas.width, canvas.height);
        picture.drawSmoothShadedTo(ctx, [0.4,0.4], {haveoutline:true})
        return html.a`
            <div class="status">
                ${canvas}
                <div class="-lifetime">${this.lifetime}</div>
                <div class="-level">${getRomanNumber(this.level)}</div>
                <p class="-description">${this.type.name}: ${this.type.description}</p>
            </div>
        `
    }
}

/**
 * Stringify a number to a roman number.
 * @param {number} number 
 */
function getRomanNumber(number){
    let final=""
    if(number>1000){
        final+="M".repeat(Math.floor(number/1000))
        number%=1000
    }
    if(number>900){
        final+="CM"
        number-=900
    }
    if(number>500){
        final+="D"
        number-=500
    }
    if(number>400){
        final+="CD"
        number-=400
    }
    if(number>100){
        final+="C".repeat(Math.floor(number/100))
        number%=100
    }
    if(number>90){
        final+="XC"
        number-=90
    }
    if(number>50){
        final+="L"
        number-=50
    }
    if(number>40){
        final+="XL"
        number-=40
    }
    if(number>10){
        final+="X".repeat(Math.floor(number/10))
        number%=10
    }
    if(number>9){
        final+="IX"
        number-=9
    }
    if(number>5){
        final+="V"
        number-=5
    }
    if(number>4){
        final+="IV"
        number-=4
    }
    final+="I".repeat(number)

}