

export class JaugeType {
    
    /**
     * A type of jauge
     * @param name The name of the jauge 
     * @param color The color of the jauge
     * @param minimum The default minimum value of the jauge 
     * @param maximum The default maximum value of the jauge 
     * @param default_value The default value of the jauge  
     */
    constructor(
        readonly name: string, 
        readonly color: [number,number,number], 
        readonly minimum: number, 
        readonly maximum: number, 
        readonly default_value: number
    ) {
    }
}