import { Picture } from "../../cardgame/icon/Picture.js";
import { BakedPicture } from "../../cardgame/icon/BakedPicture.js";

/** @type {{ [key:string]: function(CanvasRenderingContext2D, Picture, [number,number]):void }} */
export default {

    smooth_complete(context, picture, light_direction){
        new BakedPicture(picture)
            .addOcclusion()
            .addShadow(light_direction)
            .addReflection(light_direction)
            .addAlphaThickness()
            .addOuterOutline(undefined,true)
            .addCastedShadow(light_direction)
            .addGloom()
            .smoothed()
            .draw(context)
    },

    smooth_no_outline(context, picture, light_direction){
        new BakedPicture(picture)
            .addOcclusion()
            .addShadow(light_direction)
            .addReflection(light_direction)
            .addAlphaThickness()
            .addGloom()
            .smoothed()
            .draw(context)
    },

    shaded(context, picture, light_direction){
        picture.baked()
            .addOcclusion()
            .addShadow(light_direction)
            .addReflection(light_direction)
            .addOuterOutline(undefined,true)
            .addAlphaThickness()
            .addCastedShadow(light_direction)
            .addGloom()
            .draw(context)
    },

    color(context, picture){
        picture.baked().draw(context)
    },

    depth(context, picture){
        picture.baked().makeDepthmap().draw(context)
    },

    simple(context, picture){
        picture.baked().addOuterOutline().addOcclusion().draw(context)
    },

}