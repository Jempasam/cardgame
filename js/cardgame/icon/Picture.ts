import { Matrix } from "../../utils/container/Matrix.js"
import { BakedPicture } from "./BakedPicture.js"


export interface PictureMaterial{
    color: [number,number,number]
    alpha: number
    light: number
    reflection: number
}
/**
 * A card picture information as a indexed color image with depth.
 * A maximum of 4 different colors can be used.
 * The depth is a number between 0 and 10.
 * A depth of -1 means the pixel is fully transparent, independtly of the used color.
 */
export class Picture{

    readonly matids: Matrix<number>
    readonly depths: Matrix<number>

    /**
     * Create a picture. By default the picture is entirely empty.
     * @param {PictureMaterial[]=} materials A array of 4 colors. 
     * @param {number[]=} pixel_materials  A array of width*height indexes to the colors array.
     * @param {number[]=} pixel_depth  A array of width*height depth values.
     * @param {number=} width The width of the picture. 16 by default.
     * @param {number=} height The height of the picture. 16 by default.
     */
    constructor(
        readonly materials: PictureMaterial[] = [
            {color:[1,0,0], alpha:1, light: 0, reflection: 0},
            {color:[1,0,0], alpha:1, light: 0, reflection: 0},
            {color:[1,0,0], alpha:1, light: 0, reflection: 0},
            {color:[1,0,0], alpha:1, light: 0, reflection: 0},
        ], 
        readonly pixel_materials: number[] = Array.from({length:this.width*this.height}, ()=>0), 
        readonly pixel_depth: number[] = Array.from({length:this.width*this.height}, ()=>-1), 
        readonly width: number = 16, 
        readonly height: number = 16
    ){
        if(materials) console.assert(materials.length == 4)
        if(pixel_materials) console.assert(pixel_materials.length == this.width*this.height)
        if(pixel_depth) console.assert(pixel_depth.length == this.width*this.height)
        this.matids = new Matrix(this.width, this.height, this.pixel_materials)
        this.depths = new Matrix(this.width, this.height, this.pixel_depth)
    }

    get_material_index(x:number, y:number){ return this.pixel_materials[x+y*this.width] }
    set_material_index(x:number, y:number, index:number){ this.pixel_materials[x+y*this.width] = Math.max(0, Math.min(index,3)) }
    
    get_material(x:number, y:number){ return this.materials[this.pixel_materials[x+y*this.width]] }

    get_depth(x:number, y:number){ return this.pixel_depth[x+y*this.width] }
    set_depth(x:number, y:number, depth:number){ this.pixel_depth[x+y*this.width] = Math.max(-1, Math.min(depth, 10)) }

    *indexes(){ for(let x=0; x<this.width; x++) for(let y=0; y<this.height; y++) yield [x,y] }
    
    /**
     * Check if the pixel is inside the picture.
     */
    contains(x:number, y:number): boolean{
        return 0<=x && x<this.width && 0<=y && y<this.height
    }

    /**
     * Create a new picture of three times the dimensions of this picture.
     * Mixing the colors of the pixels in a smart way.
     */
    superSampled(){
        const supersampled=new Picture(structuredClone(this.materials), undefined, undefined, this.width*3, this.height*3)
        for(let [x,y] of this.indexes()){
            let xx=x*3
            let yy=y*3
            for(let dx of [-1,0,1])
            for(let dy of [-1,0,1]){
                
                let depth=undefined
                let color=undefined
                if( (0<=x+dx && x+dx<this.width) && (0<=y+dy && y+dy<this.height) ){
                    const a = this.get_material_index(x+dx,y); const b = this.get_material_index(x,y+dy); const c = this.get_material_index(x+dx,y+dy)
                    const ad = this.get_depth(x+dx,y); const bd = this.get_depth(x,y+dy); const cd = this.get_depth(x+dx,y+dy)
                    const ae = ad!=-1; const be = bd!=-1; const ce = cd!=-1
                    const ap = ae?ad:0; const bp = be?bd:0; const cp = ce?cd:0

                    if(Math.abs(dx)+Math.abs(dy)>=2){
                        if(a==b) color= this.get_material_index(x+dx,y)
                        if(!ae && !be) depth = -1
                    }
                    if(depth==undefined && (dx!=0 || dy!=0) && (ae && be)){
                    
                        depth= (ap+bp+cp+this.get_depth(x,y)*3)/6
                    }

                    

                }
                depth ??= this.get_depth(x,y)
                color ??= this.get_material_index(x,y)
                    
                supersampled.set_depth(xx+1+dx, yy+1+dy, depth)
                supersampled.set_material_index(xx+1+dx, yy+1+dy, color)

            }
        }
        return supersampled
    }

    clone(){
        return new Picture(structuredClone(this.materials), structuredClone(this.pixel_materials), structuredClone(this.pixel_depth), this.width, this.height)
    }

    baked(){
        return new BakedPicture(this)
    }

}

/**
 * Create a new material that is a linear interpolation of two materials.
 */
export function lerpMaterial(mata: PictureMaterial, matb: PictureMaterial, ratio: number): PictureMaterial{
    const nratio= 1-ratio
    return {
        //@ts-ignore
        color: mata.color.map((a,i)=>a*nratio+matb.color[i]*ratio),
        alpha: mata.alpha*nratio+matb.alpha*ratio,
        light: mata.light*nratio+matb.light*ratio,
        reflection: mata.reflection*nratio+matb.reflection*ratio,
    }
}