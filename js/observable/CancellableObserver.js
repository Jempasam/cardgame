import { Observable } from "./Observable.js";


/**
 * @template T
 */
export class CancellableObserver{

    /** @type {Observable<T&{cancel:boolean}>} */
    before= new Observable()

    /** @type {Observable<T>} */
    after= new Observable()

    /** @type {Observable<T>} */
    cancel= new Observable()

    /**
     * Notify the observer and return false if the notification was cancelled
     * @template Y
     * @param {T} value 
     * @param {(cancel:()=>void)=>Y=} action An action to perform if the notification is not cancelled and before the after event
     * @param {(it:Y)=>void=} postaction An action to perform after the after event
     */
    notify(value, action, postaction){
        let event={...value, cancel:false}
        this.before.notify(event)
        if(event.cancel){
            this.cancel.notify(value)
            return false
        }else{
            let cancelled=false
            let it=action?.(()=>cancelled=true)
            if(!cancelled){
                this.after.notify(value)
                postaction?.(it)
            }
            return true
        }
    }
}