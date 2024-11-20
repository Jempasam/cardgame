import { Observable } from "../../observable/Observable.js";
import { Status } from "./Status.js";
import { StatusType } from "./StatusType.js";

/**
 * A list of status.
 */
export class StatusList{

    /** @type {Observable<{type:StatusType, before: Status|null, after: Status|null}>} */
    on_status_change = new Observable()

    /** @type {Map<StatusType,Status>} */
    #list = new Map();

    /**
     * Get all the status.
     */
    *getAllStatus(){
        for(let status of this.#list.values()){
            yield status;
        }
    }

    /**
     * Get the status by the status type.
     * @param {StatusType|null} type 
     * @returns 
     */
    getStatus(type){
        return this.#list.get(type)?.clone() ?? null;
    }

    /**
     * Set the status
     * @param {StatusType} type 
     * @param {Status|null} status 
     */
    setStatus(type, status){
        this.on_status_change.notify({type, before: this.#list.get(type), after: status});
        if(status!=null) this.#list.set(type, status.clone());
        else this.#list.delete(type);
    }
    
}