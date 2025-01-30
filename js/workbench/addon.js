
/**
 * @typedef {import("./utils/blockly.mjs").WorkspaceSvg} WorkspaceSvg
 * @typedef {import("../../node_modules/blockly/core/utils/toolbox.js").FlyoutDefinition} FlyoutDefinition
 * @typedef {import("../../node_modules/blockly/core/utils/toolbox.js").ToolboxItemInfo} ToolboxItemInfo
 * @typedef {import("../../node_modules/blockly/core/block.js").Block} Block
 */
/**
 * @typedef {Object} BlocklyAddon
 * @prop {{ [id:string] : (workspace:WorkspaceSvg)=>FlyoutDefinition }} [category_callbacks=[]]
 * @prop {ToolboxItemInfo[]} [toolbox=[]] 
 **/


/**
 * 
 * @param {BlocklyAddon[]} mergeds 
 */
export function mergeAddons(...mergeds){
    return {
        category_callbacks: Object.fromEntries(mergeds.flatMap(m=>Object.entries(m.category_callbacks??{}))),
        toolbox: mergeds.flatMap(m=>m.toolbox??[]),
    }
}

/**
 * 
 * @param {WorkspaceSvg} workspace 
 * @param {BlocklyAddon} extension
 */
export function useAddon(workspace, extension){
    for(const [id, callback] of Object.entries(extension.category_callbacks??[])){
        workspace.registerToolboxCategoryCallback(id, callback)
    }
}