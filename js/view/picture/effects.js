import { Picture } from "../../cardgame/icon/Picture.js";

/** @type { {[name:string]:function(Picture,...any|undefined):Picture} } */
const effects ={

    normal(it){ return it },

    drippy(input, dx=0, dy=1, lens={0:2, 1:1, 2:1, 3:1}, only_ins={}){
        if(dx!=0)input = effects.fit_to(input, 0, -Math.sign(dx))
        if(dy!=0)input = effects.fit_to(input, 1, -Math.sign(dy))
        const output = input.clone()
        for(const [x,y] of input.indexes()){
            const depth = input.get_depth(x,y)
            const material = input.get_material_index(x,y)
            if(depth==-1)continue
            let distance_to_center = Math.max(Math.abs(Math.floor(input.width/2)-x), Math.abs(Math.ceil(input.width/2)-1-x))
            console.log(x,distance_to_center)
            if(distance_to_center%2!=material%2)continue
            const len = lens[material] ?? 0
            const only_in = only_ins[material] ?? false
            for(let l=1; l<=len; l++){
                let xx=x+dx*l, yy=y+dy*l
                if(
                    input.contains(xx,yy)
                    && (
                        (input.get_material_index(xx,yy)!=material && (input.contains(xx+dx,yy+dy) && input.get_material_index(xx+dx,yy+dy)==input.get_material_index(xx,yy) && input.get_depth(xx+dx,yy+dy)!=-1)) // Drip on material
                        || (input.get_depth(xx,yy)==-1 && !only_in) // Drip on empty
                    )
                ){
                    output.set_depth(xx, yy, depth)
                    output.set_material_index(xx, yy, input.get_material_index(x,y))
                }
                else break
            }
        }
        return output
    },

    look_right(it, dx=-1, dy=0){
        const ret = it.clone()

        // Get max
        let max = 0
        for(let [x,y] of ret.indexes()){
            const depth= ret.get_depth(x,y)
            if(depth==-1)continue
            max = Math.max(max, depth)
        }

        // Move
        let [xmin,xmax,xi] = dx>=0 ? [0, ret.width-dx, 1] : [ret.width+dx, 0, -1]
        let [ymin,ymax,yi] = dy>=0 ? [0, ret.height-dy, 1] : [ret.height+dy, 0, -1]
        for(let x=xmin; x!=xmax; x+=xi){
            for(let y=ymin; y!=ymax; y+=yi){
                const depth= ret.get_depth(x+dx,y+dy)
                if(depth<=Math.floor(max/2))continue
                ret.set_depth(x, y, depth)
                ret.set_material_index(x, y, ret.get_material_index(x+dx, y+dy))
                if(x+dx<ret.width-1 && y+dy<ret.width-1){
                    ret.set_depth(x+dx, y+dy, ret.get_depth(x+dx*2, y+dy*2))
                    ret.set_material_index(x+dx, y+dy, ret.get_material_index(x+dx*2, y+dy*2))
                }
                else{
                    ret.set_depth(x+dx, y+dy, -1)
                }
            }
        }

        return ret
    },
    look_left(it){ return effects.look_right(it, 1, 0) },
    look_up(it){ return effects.look_right(it, 0, 1) },
    look_down(it){ return effects.look_right(it, 0, -1) },

    sayan(it){
        let ret = it.clone()
        ret.materials[0].color[0]= 1.0
        ret.materials[0].color[1]= 0.8
        ret.materials[0].color[2]= 0.0
        ret.materials[0].light+= 0.2

        ret.materials[2].color[0]= 0.0
        ret.materials[2].color[1]= 0.0
        ret.materials[2].color[2]= 1.0
        ret.materials[2].light+= 0.4

        ret = effects.drippy(ret, 0, -1, {0:2, 1:1, 2:1}, {1:true})
        return ret
    },

    slimy(it){
        let ret = it.clone()
        ret.materials[0].color = lerp_colors(it.materials[0].color, [0.2, 1.0, 0.2], 0.5)
        ret.materials[0].alpha = lerp(it.materials[0].alpha, 0.8, 0.4)
        ret.materials[0].reflection = lerp(it.materials[1].reflection, 0.5, 0.4)

        ret.materials[1].color = lerp_colors(it.materials[1].color, [0.2, 1.0, 0.2], 0.3)
        ret.materials[1].reflection = lerp(it.materials[1].reflection, 0.5, 0.3)

        ret.materials[2].color = lerp_colors(it.materials[2].color, [0.2, 1.0, 0.2], 0.2)
        ret.materials[2].reflection = lerp(it.materials[2].reflection, 0.5, 0.2)

        ret.materials[3].color = lerp_colors(it.materials[3].color, [0.2, 1.0, 0.2], 0.2)
        ret.materials[3].reflection = lerp(it.materials[3].reflection, 0.5, 0.1)

        ret = effects.drippy(ret, 0, 1, {0:2, 1:1, 2:1, 3:1})
        return ret
    },

    zombie(picture){
        const ret = picture.clone()
        ret.materials[0].color[1] = Math.min(1.0, picture.materials[0].color[1]+0.3)
        ret.materials[0].color[0] = Math.max(0.0, picture.materials[0].color[0]-0.3)
        ret.materials[0].color[2] = Math.max(0.0, picture.materials[0].color[2]-0.3)

        ret.materials[1].color[0] = Math.min(1.0, picture.materials[1].color[0]+0.3)
        ret.materials[1].color[1] = Math.max(0.0, picture.materials[1].color[1]-0.3)
        ret.materials[1].color[2] = Math.max(0.0, picture.materials[1].color[2]-0.3)

        for(let [x,y] of ret.indexes()){
            if((x+y)%5==0 && y%4!=0)ret.set_depth(x,y,-1)
        }
        return ret
    },

    drug(picture){
        const ret = picture.clone()

        for(let [x,y] of picture.indexes()){
            const color = picture.get_material_index(x,y)
            const depth = picture.get_depth(x,y)
            if(depth==-1 || (color!=1 && color!=2))continue
            ret.set_depth(x, y, Math.min(10, depth+1))
            for(let [dx,dy] of [[0,1],[0,-1],[1,0],[-1,0]]){
                if(!picture.contains(x+dx, y+dy))continue
                const old_color = picture.get_material_index(x+dx, y+dy)
                if(old_color==1 || old_color==2)continue
                ret.set_material_index(x+dx, y+dy, color)
                ret.set_depth(x+dx, y+dy, depth)
                if(picture.contains(x+dx*2,y+dy*2) && picture.get_depth(x+dx*2, y+dy*2)==-1){
                    ret.set_material_index(x+dx*2, y+dy*2, picture.get_material_index(x+dx, y+dy))
                    ret.set_depth(x+dx*2, y+dy*2, picture.get_depth(x+dx, y+dy))
                }
            }
        }
        return ret
    },

    weird(picture){
        const ret = picture.clone()

        for(let y=0; y<ret.height; y++){
            const direction= y%2
            for(let x=0; x<ret.width-direction; x++){
                ret.set_depth(x, y, picture.get_depth(x+direction, y))
                ret.set_material_index(x, y, picture.get_material_index(x+direction, y))
            }
        }
        ret.materials[0].color[0] = Math.min(1.0, picture.materials[0].color[0]+0.2)
        ret.materials[0].color[1] = Math.max(0.0, picture.materials[0].color[1]-0.2)
        ret.materials[0].color[2] = Math.min(1.0, picture.materials[0].color[2]+0.3)

        ret.materials[2].color[0] = Math.min(1.0, picture.materials[2].color[0]+0.3)
        ret.materials[2].color[1] = Math.max(.0, picture.materials[2].color[1]-0.3)
        ret.materials[2].color[2] = Math.max(.0, picture.materials[2].color[2]-0.3)
        return ret
    },

    thin(picture){
        const ret = picture.clone()

        for(let [x,y] of picture.indexes()){
            if(ret.get_depth(x,y)!=-1)
                ret.set_depth(x, y, Math.max(-1,picture.get_depth(x, y)-1))
        }
        return ret
    },

    fat(picture){
        const ret = picture.clone()

        for(let [x,y] of picture.indexes()){
            if(ret.get_depth(x,y)!=-1)
                ret.set_depth(x, y, Math.min(10,picture.get_depth(x, y)+1))
        }

        pixel_loop: for(let [x,y] of picture.indexes()){
            const depth= picture.get_depth(x,y)
            if(depth!=-1)continue

            dirloop: for(let [dx,dy] of [-1,0,1].flatMap(x=>[-1,0,1].map(y=>[x,y]))){
                if (dx==0 && dy==0) continue
                for(let i=1; i<=4; i++){
                    if(!picture.contains(x+dx*i, y+dy*i) || picture.get_depth(x+dx*i, y+dy*i)==-1){
                        continue dirloop
                    }
                }
                ret.set_depth(x, y, Math.max(0, picture.get_depth(x+dx, y+dy)-1))
                ret.set_material_index(x, y, picture.get_material_index(x+dx, y+dy))
                continue pixel_loop
            }
        }
        return ret
    },

    /**
     * Move all the pixel to to make, the picture, close fit a side if possible by keepeing a space of at least one pixel. 
     **/
    fit_to(input, axes=1, direction=1){
        direction = -direction

        const output = input.clone()
        let dims = [input.width, input.height]
        let axes2 = (axes+1)%2
        let len = 0

        // Get the amount of movement possible
        let maxi = direction==1 ? dims[axes]-1 : -1
        let mini = direction==1 ? 0 : dims[axes]-1
        let diri = direction==1 ? 1 : -1
        loop: for(let i=mini; i!=maxi; i+=diri){
            for(let j=0; j<dims[axes2]; j++){
                let coords = [0,0]
                coords[axes] = i
                coords[axes2] = j
                if(input.get_depth(...coords)!=-1) break loop
            }
            len++
        }
        console.log(len)

        // At least one empty space before border
        len--

        // Move the pixels
        for(let i=0; i<dims[axes]; i++){
            for(let j=0; j<dims[axes2]; j++){
                let output_coords = [0,0]
                let input_coords = /** @type {[Number,number]} */ ([0,0])
                output_coords[axes] = i
                output_coords[axes2] = j
                input_coords[axes] = i + len * direction
                input_coords[axes2] = j
                if(input.contains(...input_coords)){
                    output.set_depth(...output_coords, input.get_depth(...input_coords))
                    output.set_material_index(...output_coords, input.get_material_index(...input_coords))
                }
                else{
                    output.set_depth(...output_coords, -1)
                }
            }
        }

        return output
    },


}

/**
 * Linear interpolation between two arrays.
 * @param {Array<number>} a
 * @param {Array<number>} b
 * @param {number} t
 * @returns {Array<number>}
 */
function lerp_arrays(a,b,t){
    return a.map((v,i)=>v*(1-t)+b[i]*t)
}

/**
 * Linear interpolation between two colors.
 * @param {[number,number,number]} a
 * @param {[number,number,number]} b
 * @param {number} t
 * @returns {[number,number,number]}
 */
function lerp_colors(a,b,t){
    return /** @type {[number,number,number]} */ (lerp_arrays(a,b,t))
}

/**
 * Linear interpolation between two values.
 * @param {number} a
 * @param {number} b
 * @param {number} t
 * @returns {number}
 */
function lerp(a,b,t){
    return a*(1-t)+b*t
}

export default effects;