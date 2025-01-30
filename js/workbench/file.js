import { Blockly, Javascript } from "./utils/blockly.mjs";

Javascript.javascriptGenerator.addReservedWords("REGISTRY")

/** @type {import("./addon.js").BlocklyAddon} */
export default {
    toolbox:[
        {
            kind: "category",
            name: "File",
            contents: [
                { kind: 'block', type: 'get_file' },
                { kind: 'block', type: 'save_file' }
            ]
        }
    ]
} 



//// GET FILE ////
Blockly.defineBlocksWithJsonArray([
    {
        type: "get_file",
        message0: 'importer %1',
        args0: [
            { type: "input_dummy", name: "FILE" },
        ],
        output: "Number",
        colour: 179,
        tooltip: "Récupère l'objet exposé par le fichier.",
        extensions: ["file_inputs"]
    }
])

Javascript.javascriptGenerator.forBlock["get_file"] = function(block,generator){
    const file_type = block.getFieldValue("FILE_TYPE")
    let file_name = /** @type {string} */ (block.getFieldValue("FILE_NAME")).split("/").join(`","`)
    file_name = `["${file_name}"]`
    return [/*js*/`REGISTRY.get("${file_type}","${file_name}")`, Javascript.Order.NONE]
}

Blockly.Extensions.register('file_inputs', /** @type {function(this:import("./utils/blockly.mjs").Block)} */  function(){
    const {workspace} = this
    const block = this
    const file_system = /** @type {import("../editor/file_explorer.js").Directory|null} */ (workspace["file_system"])
    this
        .getInput('FILE')
        .appendField(new Blockly.FieldDropdown(
            function(){
                const options = [
                    ["none","none"],
                    ...file_system ?.files ?.map(f=>[f.type,f.name])??[]
                ]
                return /** @type {[String,string][]} */ (options)
            },
            function(input){
                block.setFieldValue('none','FILE_NAME')
                const root = file_system?.files?.find(it=>it.name==input)
                if(root!=null){
                    try{ block.setColour(root.color) }catch(e){ block.setColour(179) }
                    block.outputConnection.setCheck([root.metadata?.type ?? "NOTHING"])
                }
                else{
                    block.setColour(179)
                    block.outputConnection.setCheck(["NOTHING"])
                }
                return input
            }
        ),'FILE_TYPE')
        .appendField("/")
        .appendField(new Blockly.FieldDropdown(
            function(){
                let name = block.getFieldValue("FILE_TYPE")
                const files = /** @type {import("../editor/file_explorer.js").Directory} */ (file_system?.files?.find(it=>it.name==name))?.files ?? []
                const options = [
                    ["none","none"],
                    ...(files
                        .flatMap(function flatter(it){
                            if("files" in it)return it.files .flatMap(flatter) .map(sub=>`${it.name}/${sub}`)
                            else return it.name
                        })
                        .map(f=>/** @type {[string,string]} */ ([f,f])))
                ]
                return /** @type {[String,string][]} */ (options)
            }
        ),'FILE_NAME');
})



//// SAVE FILE ////
Blockly.defineBlocksWithJsonArray([
    {
        type: "save_file",
        message0: 'exporter %1',
        args0: [
            { type:"input_value", name:"VALUE", align:"RIGHT", check:null },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 179,
        tooltip: "Expose une objet pour qu'il soit récupérable depuis un autre fichier.",
        extensions: ["check_file_type"]
    }
])

Javascript.javascriptGenerator.forBlock["save_file"] = function(block,generator){
    return `REGISTRY.save(${generator.valueToCode(block,"VALUE",0)})`
}

Blockly.Extensions.register('check_file_type', /** @type {function(this:import("./utils/blockly.mjs").Block)} */  function(){
    const {workspace} = this
    this.getInput("VALUE").setCheck(workspace['file_type']??[])
})