// Import Blockly and Blockly JavaScript generator
import "../../node_modules/blockly/blockly_compressed.js"
import "../../node_modules/blockly/blocks_compressed.js"
import "../../node_modules/blockly/javascript_compressed.js"
import "../../node_modules/blockly/msg/fr.js"

/** @typedef {import("../../node_modules/blockly/index.js").WorkspaceSvg} WorkspaceSvg */
/** @typedef {import("../../node_modules/blockly/index.js").Block} Block */

/** @type {import("../../node_modules/blockly/index.js")} */
// @ts-ignore
export const Blockly = window.Blockly

/** @type {import("../../node_modules/blockly/javascript.js")} */
// @ts-ignore
export const Javascript = window.javascript

/**
 * 
 * @param {WorkspaceSvg} workspace 
 */
export function getBlocksInToolbox(workspace){
    /** @param {import("../../node_modules/blockly/core/utils/toolbox.js").ToolboxItemInfo[]} items */
    function getBlocks(items){
        const blocks = /** @type {string[]} */ ([])
        for(const item of items){
            if(item.kind=="category"){
                blocks.push(...getBlocks(item['contents']??[]))
            }
            else if(item.kind=="block"){
                blocks.push(item['type'])
            }
        }
        return blocks
    }
    return getBlocks(workspace.options.languageTree.contents)
}