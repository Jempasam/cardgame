import { Observable } from "./Observable.js"


/**
 * @template T
 */
export class OValue{

    #value

    /**
     * 
     * @param {T} value 
     * @param {Observable<{from:T, to:T}>=} parent
     */
    constructor(value, parent){
        this.observable = new Observable(parent)
        this.#value=value
    }

    /**
     * Set the value
     * @param {T} value 
     */
    set(value){
        let old = this.#value
        this.#value = value
        this.observable.notify({from:old, to:value})
    }

    /**
     * Get the value
     * @returns {T}
     */
    get(){
        return this.#value
    }

    /**
     * Set the value
     * @param {T} value 
     */
    set value(value){
        this.set(value)
    }

    /**
     * Get the value
     * @returns {T}
     */
    get value(){
        return this.get()
    }

}