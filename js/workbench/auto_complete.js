import { Blockly, getBlocksInToolbox } from "./blockly.mjs"

/**
 * 
 * @param {import("./blockly.mjs").WorkspaceSvg} workspace
 * @param {string} id
 * @param {(block: import("./blockly.mjs").Block)=>boolean} searched_filter
 * @param {(block: import("./blockly.mjs").Block)=>boolean} target_filter
 * @param {(block: import("./blockly.mjs").Block)=>string[]|null} searched_checks
 * @param {(block: import("./blockly.mjs").Block)=>string[]|null} target_checks
 */
export function registerAutoComplete(workspace, id, target_filter, searched_filter, target_checks, searched_checks){
    let rec=0
    workspace.registerToolboxCategoryCallback(id,(workspace)=>{
        rec++
        if(rec>1)return

        // Get the currently selected block output connection
        const outputBlock = Blockly.getSelected()
        if(!(outputBlock instanceof Blockly.Block)){rec=0; return}

        // Filter
        if(!target_filter(outputBlock)){rec=0; return}

        // Get all the toolbox blocks        
        const blocks = getBlocksInToolbox(workspace)

        // Get the output checks
        const outputChecks = target_checks(outputBlock)

        // Get the list of blocks that can be connected to the output connection
        const selecteds = []
        const temporaryWorkspace = new Blockly.WorkspaceSvg(new Blockly.Options({}))
        temporaryWorkspace.setMetricsManager(new Blockly.FlyoutMetricsManager(temporaryWorkspace, this))
        temporaryWorkspace.setVisible(true)
        document.body.append(temporaryWorkspace.createDom())
        for(const id of blocks){
            const block = Blockly.serialization.blocks.appendInternal({type:id},temporaryWorkspace)

            // Filter
            if(!searched_filter(block)){ continue }

            // Always matches if no checks for the output
            if(outputChecks==null){
                selecteds.push(id)
                continue
            }

            // Check if any of the input checks matches the output checks
            let checks = searched_checks(block)
            if(checks==null){
                selecteds.push(id)
                continue
            }
            let anyMatches = checks.some(inputCheck=>outputChecks.includes(inputCheck))
            if(anyMatches){
                selecteds.push(id)
                continue
            }
        }
        temporaryWorkspace.dispose()

        // Create list
        /** @type {import("../../node_modules/blockly/core/utils/toolbox.js").FlyoutItemInfoArray} */
        let definition=[]
        for(const selected of selecteds){
            definition.push({kind:"block",type:selected})
        }
        console.log(definition)

        rec=0
        return definition
    })
}

/**
 * 
 * @param {import("./blockly.mjs").WorkspaceSvg} workspace 
 */
export function registerAllAutoComplete(workspace){
    registerAutoComplete(workspace, "OUTPUT_COMPLETE",
        (block)=>block.outputConnection!=null,
        (block)=>block.inputList.length>0,
        (block)=>block.outputConnection?.getCheck(),
        (block)=>{
            const checks = block.inputList.filter(it=>it.connection!=null).map(it=>it.connection.getCheck()).filter(it=>it!=null)
            return checks.flatMap(it=>it)
        }
    )

    registerAutoComplete(workspace, "GETTER_COMPLETE",
        (block)=>block.outputConnection!=null,
        (block)=>block.inputList.length>0 && block.outputConnection!=null,
        (block)=>block.outputConnection?.getCheck(),
        (block)=>{
            const checks = block.inputList.filter(it=>it.connection!=null).map(it=>it.connection.getCheck()).filter(it=>it!=null)
            return checks.flatMap(it=>it)
        }
    )

    registerAutoComplete(workspace, "PARAMETER_COMPLETE",
        (block)=>block.inputList.length>0,
        (block)=>block.outputConnection!=null,
        (block)=>{
            const checks = block.inputList
                .filter(it=>it.connection!=null && it.connection.isConnected)
                .map(it=>it.connection.getCheck())
            if(checks.some(it=>it==null))return null
            else return checks.flatMap(it=>it)
        },
        (block)=>block.outputConnection?.getCheck(),

    )
}
