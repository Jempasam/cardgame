import { MOValue, OValue } from "../../observable/collections/OValue.js";
import { JaugeType } from "./JaugeType.js";


export class Jauge{
    
    #current = new MOValue(0);
    #minimum = new MOValue(0);
    #maximum = new MOValue(0);
    

    /**
     * Create a jauge
     * @param {JaugeType} type 
     */
    constructor(type){
        this.type = type;
        this.#minimum.value = type.minimum;
        this.#maximum.value = type.maximum;
        this.#current.value = type.value;
    }

    get current() { return this.#current.value }
    get minimum() { return this.#minimum.value }
    get maximum() { return this.#maximum.value }
    
    set current(value){
        if (value < this.#minimum.value) value = this.#minimum.value;
        if (value > this.#maximum.value) value = this.#maximum.value;
        this.#current.value = value;
    }

    set minimum(value){
        if (value > this.#maximum.value) value = this.#maximum.value;
        this.#minimum.value = value;
    }

    set maximum(value){
        if (value < this.#minimum.value) value = this.#minimum.value;
        this.#maximum.value = value;
    }

    get current_observable() { return this.#current.observable }
    get minimum_observable() { return this.#minimum.observable }
    get maximum_observable() { return this.#maximum.observable }
}