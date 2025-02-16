

export class PromiseChain{

    private promise = Promise.resolve()
    private waiting = false

    /**
     * Call the promise after the previous one is done
     */
    do(promise: ()=>Promise<void>){
        this.waiting=true
        this.promise = this.promise.then(promise).then(it=>{this.waiting=false})
        return this
    }

    /**
     * Call the promise if no promise is currently running
     */
    try_do(promise: ()=>Promise<void>){
        if(!this.waiting){
            return this.do(promise)
        }
        return this
    }

}

/**
 * Sleep for a certain amount of time
 */
export function sleep(time: number): Promise<void>{
    return new Promise(resolve=>setTimeout(resolve,time))
}

/**
 * Wait until an event is triggered
 */
export function until(event_source: EventTarget, event: string){
    return new Promise(resolve=>event_source.addEventListener(event,resolve,{once:true}))
}

/**
 * Wait until a promise is resolved for a maximum amount of time
 */
export function timed_out(promise: Promise<any>, timeout: number): Promise<void>{
    let resolved=false
    return new Promise<void>(resolve=>{
        promise.then(()=>{if(!resolved)resolve();resolved=true})
        setTimeout(()=>{if(!resolved)resolve();resolved=true},timeout)
    })
}