

export class PromiseChain{

    promise = Promise.resolve()
    waiting = false

    /**
     * Call the promise after the previous one is done
     * @param {()=>Promise<void>} promise 
     * @returns 
     */
    do(promise){
        this.waiting=true
        this.promise = this.promise.then(promise).then(it=>{this.waiting=false})
        return this
    }

    /**
     * Call the promise if no promise is currently running
     * @param {()=>Promise<void>} promise
     * @returns
     */
    try_do(promise){
        if(!this.waiting){
            return this.do(promise)
        }
        return this
    }

}

/**
 * Sleep for a certain amount of time
 * @param {number} time
 * @returns {Promise<void>}
 */
export function sleep(time){
    return new Promise(resolve=>setTimeout(resolve,time))
}

/**
 * Wait until an event is triggered
 * @param {EventTarget} event_source 
 * @param {string} event 
 * @returns 
 */
export function until(event_source,event){
    return new Promise(resolve=>event_source.addEventListener(event,resolve,{once:true}))
}

/**
 * Wait until a promise is resolved for a maximum amount of time
 * @param {Promise} promise
 * @param {number} timeout
 */
export function timed_out(promise,timeout){
    let resolved=false
    return new Promise(resolve=>{
        promise.then(()=>{if(!resolved)resolve();resolved=true})
        setTimeout(()=>{if(!resolved)resolve();resolved=true},timeout)
    })
}