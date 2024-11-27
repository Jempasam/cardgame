

export class JaugeType {
    
    /**
     * A type of jauge
     * @param {number} minimum The default minimum value of the jauge 
     * @param {number} maximum The default maximum value of the jauge 
     * @param {number} value The default value of the jauge 
     * @param {[number,number,number]} color The color of the jauge 
     * @param {string} name The name of the jauge 
     */
    constructor(minimum, maximum, value, color, name) {
        this.minimum = minimum;
        this.maximum = maximum;
        this.value = value;
        this.color = color;
        this.name = name;
    }
}