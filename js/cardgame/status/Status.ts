import { StatusType } from "./StatusType.js";

/**
 * An effect, appliable to a player.
 */
export class Status{

    /**
     * @param type The type of the effect instance. 
     * @param level The level of the effect instance.
     * @param lifetime The lifetime of the effect instance.
     */
    constructor(
        readonly type: StatusType, 
        readonly level: number, 
        readonly lifetime: number
    ){ }

    clone(){ return new Status(this.type, this.level, this.lifetime) }
    
}

