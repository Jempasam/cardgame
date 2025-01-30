

export class JaugeType {
    
    /**
     * A type of jauge
     * @param {string} name The name of the jauge 
     * @param {[number,number,number]} color The color of the jauge
     * @param {number} minimum The default minimum value of the jauge 
     * @param {number} maximum The default maximum value of the jauge 
     * @param {number} default_value The default value of the jauge  
     */
    constructor(name, color, minimum, maximum, default_value) {
        this.minimum = minimum;
        this.maximum = maximum;
        this.value = default_value;
        this.color = color;
        this.name = name;
    }
}