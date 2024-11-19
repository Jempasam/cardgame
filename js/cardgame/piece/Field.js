

export class Field{

    constructor(width, height){
        this.width = width;
        this.height = height;
        this.cells = Array.from({length: width}, () => Array.from({length: height}, () => null));
    }
    
}