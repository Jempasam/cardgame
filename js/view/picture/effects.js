import { Picture } from "../../cardgame/icon/Picture.js";

/** @type { {[name:string]:function(Picture):Picture} } */
const effects ={

    normal(it){ return it },

    sayan(it){
        const ret = it.clone()
        ret.materials[0].color[0]= 1.0
        ret.materials[0].color[1]= 0.8
        ret.materials[0].color[2]= 0.0
        ret.materials[0].light+= 0.1

        ret.materials[2].color[0]= 0.0
        ret.materials[2].color[1]= 0.0
        ret.materials[2].color[2]= 1.0
        ret.materials[2].light+= 0.4

        for(let x=0; x<ret.width; x++)if(x%3==0){
            for(let y=0; y<ret.height; y++){
                const depth = ret.get_depth(x,y)
                if(depth==-1)continue
                if(y-1>=0){
                    const color = ret.get_material_index(x,y)
                    ret.set_depth(x,y-1, depth)
                    ret.set_material_index(x,y-1, color)
                }
                if(y-2>=0){
                    const color = ret.get_material_index(x,y)
                    ret.set_depth(x,y-2, depth)
                    ret.set_material_index(x,y-2, color)
                }
                break
            }
        }

        return ret
    },

    zombie(picture){
        const ret = picture.clone()
        ret.materials[0][0] = Math.max(0.0, picture.materials[0].color[0]-0.3)
        ret.materials[0][1] = Math.min(1.0, picture.materials[0].color[1]+0.3)
        ret.materials[0][2] = Math.max(0.0, picture.materials[0].color[2]-0.3)

        ret.materials[1][0] = Math.min(1.0, picture.materials[1].color[0]+0.3)
        ret.materials[1][1] = Math.max(0.0, picture.materials[1].color[1]-0.3)
        ret.materials[1][2] = Math.max(0.0, picture.materials[1].color[2]-0.3)

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
        ret.materials[0][0] = Math.min(1.0, picture.materials[0].color[0]+0.2)
        ret.materials[0][1] = Math.max(0.0, picture.materials[0].color[1]-0.2)
        ret.materials[0][2] = Math.min(1.0, picture.materials[0].color[2]+0.3)

        ret.materials[2][0] = Math.min(1.0, picture.materials[2].color[0]+0.3)
        ret.materials[2][1] = Math.max(.0, picture.materials[2].color[1]-0.3)
        ret.materials[2][2] = Math.max(.0, picture.materials[2].color[2]-0.3)
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


}
export default effects;