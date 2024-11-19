import { Picture } from "../../cardgame/icon/Picture.js";

/** @type {{ [key:string]: function(CanvasRenderingContext2D, Picture, [number,number]):void }} */
export default {

    smooth(context, picture, light_direction){
        picture.drawSmoothShadedTo(context, light_direction)
    },
    
    shaded(context, picture, light_direction){
        picture.drawShadedTo(context, light_direction)
    },

    color(context, picture){
        picture.drawColorTo(context)
    },

    depth(context, picture){
        picture.drawDepthTo(context)
    },

    simple(context, picture){
        picture.drawTo(context)
    }

}