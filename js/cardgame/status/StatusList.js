import { Status } from "./Status.js";
import { StatusType } from "./StatusType.js";

/**
 * A list of status.
 */
export class StatusList{

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
     * @param {StatusType} type 
     * @returns 
     */
    getStatus(type){
        return this.#list.get(type);
    }

    /**
     * Set the status
     * @param {StatusType} type 
     * @param {Status|null} status 
     */
    setStatus(type, status){
        if(status!=null) this.#list.set(type, status);
        else this.#list.delete(type);
    }
}