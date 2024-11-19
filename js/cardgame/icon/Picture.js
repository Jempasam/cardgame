

/**
 * A card picture information as a indexed color image with depth.
 * A maximum of 4 different colors can be used.
 * The depth is a number between 0 and 10.
 * A depth of -1 means the pixel is fully transparent, independtly of the used color.
 */
export class Picture{

    /** @type {[number,number,number,number][]}  */
    colors

    /** @type {number[]} */
    pixel_colors

    /** @type {number[]} */
    pixel_depth

    /**
     * Create a picture. By default the picture is entirely empty.
     * @param {[number,number,number,number][]=} colors A array of 4 colors. 
     * @param {number[]=} pixel_colors  A array of width*height indexes to the colors array.
     * @param {number[]=} pixel_depth  A array of width*height depth values.
     * @param {number=} width The width of the picture. 16 by default.
     * @param {number=} height The height of the picture. 16 by default.
     */
    constructor(colors, pixel_colors, pixel_depth, width, height){
        this.width = width ?? 16
        this.height = height ?? 16
        if(colors) console.assert(colors.length == 4 && colors.every(c=>c.length==4))
        if(pixel_colors) console.assert(pixel_colors.length == this.width*this.height)
        if(pixel_depth) console.assert(pixel_depth.length == this.width*this.height)
        this.colors = colors ?? [[1,0,0,1],[0,1,0,1],[0,1,0,1],[1,1,1,1]]
        this.pixel_colors = pixel_colors ?? Array.from({length:this.width*this.height}, ()=>0)
        this.pixel_depth = pixel_depth ?? Array.from({length:this.width*this.height}, ()=>-1)
    }

    get_color_index(x,y){ return this.pixel_colors[x+y*this.width] }
    set_color_index(x,y,index){ this.pixel_colors[x+y*this.width] = Math.max(0, Math.min(index,3)) }
    
    get_color(x,y){ return this.colors[this.pixel_colors[x+y*this.width]] }

    get_depth(x,y){ return this.pixel_depth[x+y*this.width] }
    set_depth(x,y,depth){ this.pixel_depth[x+y*this.width] = Math.max(-1, Math.min(depth, 10)) }

    *indexes(){
        for(let x=0; x<this.width; x++){
            for(let y=0; y<this.height; y++){
                yield [x,y]
            }
        }
    }

    /**
     * Create a new picture of three times the dimensions of this picture.
     * Mixing the colors of the pixels in a smart way.
     */
    superSampled(){
        const supersampled=new Picture(structuredClone(this.colors), undefined, undefined, this.width*3, this.height*3)
        for(let [x,y] of this.indexes()){
            let xx=x*3
            let yy=y*3
            for(let dx of [-1,0,1])
            for(let dy of [-1,0,1]){
                
                let depth=undefined
                let color=undefined
                if( (0<=x+dx && x+dx<this.width) && (0<=y+dy && y+dy<this.height) ){
                    const a = this.get_color_index(x+dx,y); const b = this.get_color_index(x,y+dy); const c = this.get_color_index(x+dx,y+dy)
                    const ad = this.get_depth(x+dx,y); const bd = this.get_depth(x,y+dy); const cd = this.get_depth(x+dx,y+dy)
                    const ae = ad!=-1; const be = bd!=-1; const ce = cd!=-1
                    const ap = ae?ad:0; const bp = be?bd:0; const cp = ce?cd:0

                    if(Math.abs(dx)+Math.abs(dy)>=2){
                        if(a==b) color= this.get_color_index(x+dx,y)
                        if(!ae && !be) depth = -1
                    }
                    if(depth==undefined && (dx!=0 || dy!=0) && (ae && be)){
                    
                        depth= (ap+bp+cp+this.get_depth(x,y)*3)/6
                    }

                    

                }
                depth ??= this.get_depth(x,y)
                color ??= this.get_color_index(x,y)
                    
                supersampled.set_depth(xx+1+dx, yy+1+dy, depth)
                supersampled.set_color_index(xx+1+dx, yy+1+dy, color)

            }
        }
        return supersampled
    }

    /**
     * Draw the picture with the farthest pixel the darker.
     * @param {CanvasRenderingContext2D} context 
     */
    drawTo(context){
        this.drawToUsing(context, (x,y)=>{
            let color = this.get_color(x,y)
            let depth = this.get_depth(x,y)
            if(depth == -1) return null
            depth/=10
            depth = depth*8/10 + 0.2
            return [...color.slice(0,3).map(it=>it*depth), color[3]]
        })
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context
     * @param {[number,number]} direction 
     */
    drawShadedTo(context, direction, light_strength=1.0, occlusion_strength=1.0){
        context.save()
        context.scale(1/this.width,1/this.height)
        for(let [x,y] of this.indexes()){
            let color = this.get_color(x,y)
            let depth = this.get_depth(x,y)

            if(depth == -1) continue

            let [normal_x,normal_y] = PictureUtils.get_normal(this, x, y).map(it=>it*light_strength)
            let occlusion = PictureUtils.get_occlusion(this, x, y)
            
            let light = (Math.max(0, 2+(normal_x)*direction[0]) + Math.max(0, 2+(normal_y)*direction[1]))/8
            light = light - occlusion *occlusion_strength

            const alpha = color[3]
            const powalpha = Math.pow(alpha, 6)
            const alpha_ratio = depth/9
            const final_alpha = alpha*alpha_ratio + powalpha*(1-alpha_ratio)

            context.fillStyle = `rgba(${Math.floor(color[0]*255*light)},${Math.floor(color[1]*255*light)},${Math.floor(color[2]*255*light)},${final_alpha})`
            context.fillRect(x,y,1.05,1.05)
        }
        context.restore()
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context
     * @param {[number,number]} direction 
     */
    drawSmoothShadedTo(context, direction){
        const color_map = Array.from({length:this.width*this.height}, ()=>[[0,0,0,0],0,0])

        // Get the colors
        for(let [x,y] of this.indexes()){
            let color_index = this.get_color_index(x,y)
            let color = this.get_color(x,y)
            let depth = this.get_depth(x,y)

            if(depth == -1){
                color_map[x+y*this.width] = [[],0,-1]
                continue
            }

            let [normal_x,normal_y] = PictureUtils.get_normal(this, x, y)
            let occlusion = PictureUtils.get_occlusion(this, x, y)

            let light = (Math.max(0, 2+(normal_x)*direction[0]) + Math.max(0, 2+(normal_y)*direction[1]))/8  - occlusion
            const alpha = color[3]
            const powalpha = Math.pow(alpha, 6)
            const alpha_ratio = depth/9
            const final_alpha = alpha*alpha_ratio + powalpha*(1-alpha_ratio)

            color_map[x+y*this.width] = [color.map((it,i)=>i==3?final_alpha:it*light),color_index,depth]
            //[color[0]*light,color[1]*light,color[2]*light,final_alpha,depth]
        }

        // Draw the pixels
        context.save()
        context.scale(1/this.width,1/this.height)
        for(const [x,y] of this.indexes()){
            const [color,material,depth] = color_map[x+y*this.width]

            // Center color
            if(depth != -1){
                context.fillStyle = PictureUtils.get_css_color(color)
                context.fillRect(x,y,1.05,1.05) 
            }

            // Corner Colors"
            for(const dx of [-1,1]){
                for(const dy of [-1,1]){
                    if(x+dx<0 || x+dx>=this.width || y+dy<0 || y+dy>=this.height) continue
                    const b= color_map[x+(y+dy)*this.width]
                    const c= color_map[x+dx+y*this.width]
                    const corner = color_map[x+dx+(y+dy)*this.width]
                    if(c[2]==-1 && b[2]==-1 && corner[2]==-1){
                        context.clearRect(x+0.3 + dx/3, y+0.3 + dy/3, 0.42, 0.42)
                    }
                    else if(c[1]==b[1] && c[2]!=-1 && b[2]!=-1){
                        let final_color
                        if(depth!=-1) final_color = Array.from({length:4}, (_,i)=>(color[i] + b[0][i] + c[0][i])/3)
                        else final_color = Array.from({length:4}, (_,i)=>(b[0][i] + c[0][i])/2)
                        context.fillStyle = PictureUtils.get_css_color(final_color)
                        context.clearRect(x+0.35 + dx/3, y+0.35 + dy/3, 0.30, 0.30)
                        context.fillRect(x+0.33 + dx/3, y+0.33 + dy/3, 0.33, 0.33)
                    }
                }
            }
            //const color=mapping.slice(0,4)
        }
        context.restore()
    }

    /**
     * Draw the color of the pixels.
     * @param {CanvasRenderingContext2D} context
     */
    drawColorTo(context){
        this.drawToUsing(context, (x,y)=>this.get_color(x,y), true)
    }

    /**
     * Draw the depth as grayscale heightmap.
     * @param {CanvasRenderingContext2D} context
     */
    drawDepthTo(context){
        this.drawToUsing(context, (x,y)=>{
            let depth = this.get_depth(x,y)
            if(depth == -1) return null
            depth = depth/10
            return [depth,depth,depth,1]
        })
    }

    /**
     * Draw the picture using a color getter.
     * @param {CanvasRenderingContext2D} context
     * @param {function(number,number):[number,number,number,number]|null} color_getter
     * @param {boolean} test_empty Ignore empty pixels.
     */
    drawToUsing(context, color_getter, test_empty=false){
        context.save()
        context.scale(1/this.width,1/this.height)
        for(let [x,y] of this.indexes()){
            if (test_empty && this.get_depth(x,y) == -1) continue
            let color = color_getter(x,y)
            if(color == null) continue
            context.fillStyle = `rgba(${Math.floor(color[0]*255)},${Math.floor(color[1]*255)},${Math.floor(color[2]*255)},${color[3]})`
            context.fillRect(x,y,1.05,1.05)
        }
        context.restore()
    }

}

export const PictureUtils = {
    
    /**
     * Get the normal of a pixel of a picture.
     * @param {Picture} picture
     * @param {number} x
     * @param {number} y
     */
    get_normal(picture, x, y){
        let depth = picture.get_depth(x,y)
        let normal_x = 0
        let normal_y = 0

        if(x==0) normal_x = depth-picture.get_depth(x+1,y)
        else if(x==picture.width-1) normal_x = picture.get_depth(x+1,y)-depth
        else normal_x = (depth-picture.get_depth(x-1,y))+(picture.get_depth(x+1,y)-depth)/2

        if(y==0) normal_y = depth-picture.get_depth(x,y+1)
        else if(y==picture.width-1) normal_y = picture.get_depth(x,y-1)-depth
        else normal_y = (depth-picture.get_depth(x,y-1))+(picture.get_depth(x,y+1)-depth)/2

        return [normal_x, normal_y]
    },

    /**
     * Get the occlusion factor of a pixel of a picture.
     */
    get_occlusion(picture, x, y){
        let depth = picture.get_depth(x,y)
        let occlusion = 0
        if(x!=0 && x!=picture.width-1) occlusion += (picture.get_depth(x+1,y)-depth) - (depth-picture.get_depth(x-1,y))
        if(y!=0 && y!=picture.height-1) occlusion += (picture.get_depth(x,y+1)-depth) - (depth-picture.get_depth(x,y-1))
        return Math.max(0,occlusion)/20
    },

    /**
     * Get the color in css format
     * @param {[number,number,number,number]} color 
     */
    get_css_color(color){
        return `rgba(${Math.floor(color[0]*255)},${Math.floor(color[1]*255)},${Math.floor(color[2]*255)},${color[3]})`
    }
}