
/**
 * A set of function.
 * @template T
 */
export class Observable{

    #observers = new Set()

    /**
     * 
     * @param {Observable<T>=} parent 
     */
    constructor(parent){
        this.parent = parent
    }
    
    /**
     * Register an observer
     * @param {function(T):void} observer
     * @returns {function():void}
     */
    register(observer){
        this.#observers.add(observer)
        return ()=> this.#observers.delete(observer)
    }

    /**
     * Unregister an observer
     * @param {function(T):void} observer
     */
    unregister(observer){
        this.#observers.delete(observer)
    }

    /**
     * Send a notification to the observers
     * @param {T} notification
     */
    notify(notification){
        for(let o of this.#observers)o(notification)
        if(this.parent)this.parent.notify(notification)
    }
    
}

/**
 * An helper object for handling a listener registrer on multiple observables.
 * @template T
 */
class MultiListener{
    
    /**
     * Register multiple listeners and save them to be able to unregister them later.
     * @param {(T)=>void} listener 
     * @param  {...Observable<T>} observables 
     */
    constructor(listener, ...observables){
        this.listener = listener
        this.observables = observables
        for(let o of observables)o.register(this.listener)
    }

    /**
     * Unregister the listeners
     */
    free(){
        for(let o of this.observables)o.unregister(this.listener)
    }
}

/**
 * Register a listener on multiple observables.
 * Returns an object that can be used to unregister the listener.
 * @template T
 * @param {(T)=>void} listener 
 * @param  {...Observable<T>} observables 
 */
export function listen_all(listener, ...observables){
    return new MultiListener(listener, ...observables)
}