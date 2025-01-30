import { Blockly } from "../utils/blockly.mjs";



export const CHECK_RENDERER = "check_renderer";

export class CheckRenderer extends Blockly.thrasos.Renderer{
    constructor(id){
        super(id)
    }
    makeConstants_(){ return new ConstantProvider() }
}

Blockly.blockRendering.register(CHECK_RENDERER, CheckRenderer);



class ConstantProvider extends Blockly.geras.ConstantProvider {
    
  // Override a few properties.

  /** @type {import("../../../node_modules/blockly/core/renderers/geras/constants.js").ConstantProvider['shapeFor']} */ 
  shapeFor(connection) {
    const width = this.TAB_WIDTH;
    const height = this.TAB_HEIGHT;

    function makeMainPath(dir, size, width, height) {
      return Blockly.utils.svgPaths.line([
          Blockly.utils.svgPaths.point(-width, -dir*height*size),
          Blockly.utils.svgPaths.point(0, dir*height+dir*size*height*2),
          Blockly.utils.svgPaths.point(width, -dir*height*size),
      ])
    }

    function makeShape(size, width, height){
      return {width, height, pathUp: makeMainPath(-1,size,width,height), pathDown: makeMainPath(1,size,width,height)}
    }

    if(connection.type==2 || connection.type==1){
      let check = connection.getCheck()
      if(check==null || check.length==0)return super.shapeFor(connection)
      if(!Array.isArray(check)) check = [check]
      const hash = (check.map(it=>it.charCodeAt(0)+it.charCodeAt(1)+it.charCodeAt(2)+it.charCodeAt(3)).reduce((a,b)=>a+b)-5)%13
      switch(hash){
        case 0: return makeConnectionShape(width, height, -0.2, -0.5, 0)
        case 1: return makeConnectionShape(width, height, 0, 0, 0)
        case 2: return makeConnectionShape(width, height, 0.2, -0.1, 0)
        case 3: return makeConnectionShape(width, height, 0, 0.2, 0)
        case 4: return makeConnectionShape(width, height, -0.3, -0.3, 0)
        case 5: return makeConnectionShape(width, height, -0.5, 0, 0)
        case 6: return makeConnectionShape(width, height, 0, -0.5, 0)
        case 7: return makeConnectionShape(width, height, 0, 0, -0.5)
        case 8: return makeConnectionShape(width, height, -.5, 0, 0.5)
        case 8: return makeConnectionShape(width, height, -.3, 0.3, 0.5)
        case 9: return makeConnectionShape(width, height, 0, 0.3, -0.4)
        case 10: return makeConnectionShape(width, height, -.05, -0.2, 0.2)
        case 11: return makeConnectionShape(width, height, -.05, -0.2, -0.5)
        case 12: return makeConnectionShape(width, height, -.2, -.3, -1)
        default: return super.shapeFor(connection)
      }
    }
    else return super.shapeFor(connection)
  }
}


/**
 * @param {number} width 
 * @param {number} height 
 * @param {number} baseX
 * @param {number} tailX
 * @param {number} centerY
 */
function makeConnectionShape(width, height, baseX, tailX, centerY) {

  function makeSize(dir){
    const baseOffset = dir*baseX*height
    const tailOffset = dir*tailX*height
    return Blockly.utils.svgPaths.line([
      Blockly.utils.svgPaths.point(-width/2, -baseOffset),
      Blockly.utils.svgPaths.point(-width/2, +baseOffset-tailOffset),

      Blockly.utils.svgPaths.point(-width*centerY, (dir*height+tailOffset*2)/2),
      Blockly.utils.svgPaths.point(width*centerY, (dir*height+tailOffset*2)/2),

      Blockly.utils.svgPaths.point(width/2, -tailOffset+baseOffset),
      Blockly.utils.svgPaths.point(width/2, -baseOffset),

    ])
  }

  return {width,height, pathUp: makeSize(-1), pathDown: makeSize(1)}
}