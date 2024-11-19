

/**
 * A card picture information as a indexed color image with depth.
 * A maximum of 4 different colors can be used.
 * The depth is a number between 0 and 10.
 * A depth of -1 means the pixel is fully transparent, independtly of the used color.
 * The picture have a fixed resolution of 16x16 pixels.
 */
export class Picture{

    /** @type {[number,number,number,number][]}  */
    colors = [[0,0,0,1],[0,0,0,1],[0,0,0,1],[0,0,0,1]]

    /** @type {number[]} */
    pixel_colors = Array.from({length:16*16}, ()=>0)

    /** @type {number[]} */
    pixel_depth = Array.from({length:16*16}, ()=>0)

    /**
     * Create a picture. By default the picture is entirely empty.
     * @param {[number,number,number,number][]=} colors A array of 4 colors. 
     * @param {number[]=} pixel_colors  A array of 16*16 indexes to the colors array.
     * @param {number[]=} pixel_depth  A array of 16*16 depth values.
     */
    constructor(colors, pixel_colors, pixel_depth){
        if(colors) console.assert(colors.length == 4 && colors.every(c=>c.length==4))
        if(pixel_colors) console.assert(pixel_colors.length == 16*16)
        if(pixel_depth) console.assert(pixel_depth.length == 16*16)
        this.colors = colors ?? [[1,0,0,1],[0,1,0,1],[0,1,0,1],[1,1,1,1]]
        this.pixel_colors = pixel_colors ?? Array.from({length:16*16}, ()=>0)
        this.pixel_depth = pixel_depth ?? Array.from({length:16*16}, ()=>-1)
    }

    get_color_index(x,y){ return this.pixel_colors[x+y*16] }
    set_color_index(x,y,index){ this.pixel_colors[x+y*16] = Math.max(0, Math.min(index,3)) }
    
    get_color(x,y){ return this.colors[this.pixel_colors[x+y*16]] }

    get_depth(x,y){ return this.pixel_depth[x+y*16] }
    set_depth(x,y,depth){ this.pixel_depth[x+y*16] = Math.max(-1, Math.min(depth, 10)) }

    *indexes(){
        for(let x=0; x<16; x++){
            for(let y=0; y<16; y++){
                yield [x,y]
            }
        }
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    drawTo(context){
        context.save()
        context.scale(1/16,1/16)
        for(let [x,y] of this.indexes()){
            let color = this.get_color(x,y)
            let depth = this.get_depth(x,y)
            if(depth == -1) continue
            depth = this.get_depth(x,y)/10
            context.fillStyle = `rgba(${Math.floor(color[0]*255*depth)},${Math.floor(color[1]*255*depth)},${Math.floor(color[2]*255*depth)},${color[3]})`
            context.fillRect(x,y,1.05,1.05)
        }
        context.restore()
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context
     * @param {[number,number]} direction 
     */
    drawShadedTo(context, direction){
        context.save()
        context.scale(1/16,1/16)
        for(let [x,y] of this.indexes()){
            let color = this.get_color(x,y)
            let depth = this.get_depth(x,y)

            let normal_x = 0
            let normal_y = 0

            if(x==0) normal_x = depth-this.get_depth(x+1,y)
            else if(x==15) normal_x = this.get_depth(x+1,y)-depth
            else normal_x = (depth-this.get_depth(x-1,y))+(this.get_depth(x+1,y)-depth)/2

            if(y==0) normal_y = depth-this.get_depth(x,y+1)
            else if(y==15) normal_y = this.get_depth(x,y-1)-depth
            else normal_y = (depth-this.get_depth(x,y-1))+(this.get_depth(x,y+1)-depth)/2

            let occlusion = 0
            if(x!=0 && x!=15) occlusion += (this.get_depth(x+1,y)-depth) - (depth-this.get_depth(x-1,y))
            if(y!=0 && y!=15) occlusion += (this.get_depth(x,y+1)-depth) - (depth-this.get_depth(x,y-1))
            occlusion = Math.max(0,occlusion)/20
            
            let light = (Math.max(0, 2+(normal_x)*direction[0]) + Math.max(0, 2+(normal_y)*direction[1]))/8
            light = light - occlusion

            if(depth == -1) continue
            context.fillStyle = `rgba(${Math.floor(color[0]*255*light)},${Math.floor(color[1]*255*light)},${Math.floor(color[2]*255*light)},${color[3]})`
            context.fillRect(x,y,1.05,1.05)
        }
        context.restore()
    }

    /**
     * @param {CanvasRenderingContext2D} context
     */
    drawColorTo(context){
        context.save()
        context.scale(1/16,1/16)
        for(let [x,y] of this.indexes()){
            if(this.get_depth(x,y) == -1) continue
            let color = this.get_color(x,y)
            context.fillStyle = `rgba(${Math.floor(color[0]*255)},${Math.floor(color[1]*255)},${Math.floor(color[2]*255)},${color[3]})`
            context.fillRect(x,y,1.05,1.05)
        }
        context.restore()
    }

    /**
     * @param {CanvasRenderingContext2D} context
     */
    drawDepthTo(context){
        context.save()
        context.scale(1/16,1/16)
        for(let [x,y] of this.indexes()){
            let depth = this.get_depth(x,y)
            if(depth == -1) continue
            depth = Math.floor((depth/10)*255)
            context.fillStyle = `rgba(${depth},${depth},${depth},1)`
            context.fillRect(x,y,1.05,1.05)
        }
        context.restore()
    }
}