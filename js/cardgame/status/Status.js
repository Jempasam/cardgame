import { html } from "../../utils/doc.js";
import { createTextElement } from "../text/Text.js";
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

    clone(){ return new Status(this.type, this.level, this.lifetime) }
    
}

