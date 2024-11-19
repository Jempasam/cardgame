import { Picture } from "../../cardgame/icon/Picture.js";

/** @type {{ [key:string]: function(CanvasRenderingContext2D, Picture, [number,number]):void }} */
export default {

    smooth_outlined(context, picture, light_direction){
        picture.drawSmoothShadedTo(context, light_direction, {haveoutline:true})
    },

    smooth(context, picture, light_direction){
        picture.drawSmoothShadedTo(context, light_direction)
    },

    depthX2(color, picture, light_direction){
        picture.superSampled().drawDepthTo(color)
    },

    shaderX2(color, picture, light_direction){
        picture.superSampled().drawShadedTo(color, light_direction, 3, .5)
    },

    shaderX4(color, picture, light_direction){
        picture.superSampled().superSampled().drawShadedTo(color, light_direction, 10, .5)
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
    },

}