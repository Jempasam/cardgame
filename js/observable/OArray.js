import { FriendlyIterable } from "../utils/FriendlyIterable.js"
import { Observable } from "./Observable.js"

/**
 * A observable array
 * @template T
 */
export class OArrayObservable{

    /** @type {Observable<{value:T,index:number}>} */ on_add

    /** @type {Observable<{value:T,index:number}>} */ on_remove

    /**
     * @param {OArrayObservable<T>=} parent 
     */
    constructor(parent){
        this.on_add = new Observable(parent?.on_add)
        this.on_remove = new Observable(parent?.on_remove)
    }
}

/**
 * A observable array 
 * @template T
 */
export class OArray{

    /** @type {OArrayObservable<T>} */ observable

    #content

    /**
     * @param {T[]=} init 
     * @param {OArrayObservable<T>=} parent
     */
    constructor(init,parent){
        this.observable = new OArrayObservable(parent)
        this.#content= init ?? []
    }

    /**
     * @param {number} start
     * @param {number} deleteCount
     * @param {T[]} added 
     */
    splice(start, deleteCount, ...added){
        const removed= this.#content.splice(start,deleteCount,...added)
        removed.forEach((value, index) => this.observable.on_remove.notify({value, index: start+index}))
        added.forEach((value, index) => this.observable.on_add.notify({value, index: start+index}))
        return removed
    }

    /**
     * @param  {...T} added 
     */
    push(...added){ this.splice(this.length,0,...added) }

    /**
     * @param {number} index 
     * @param {T} value 
     */
    insert(index,value){ this.splice(index,0,value) }

    /**
     * @param {number} index 
     * @returns {T}
     */
    remove(index){ return this.splice(index,1)[0] }

    /**
     * @returns {T}
     */
    pop(){ return this.remove(this.length-1) }

    get length(){
        return this.#content.length
    }

    /**
     * 
     * @param {number} index 
     */
    get(index){
        return this.#content[index]
    }

    [Symbol.iterator](){ return this.#content[Symbol.iterator]() }

    values(){ return new FriendlyIterable(this.#content) }
}