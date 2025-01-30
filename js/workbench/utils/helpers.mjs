import { Blockly, Javascript } from "./blockly.mjs"

/**
 * @typedef {"Color"|"String"|"Number"|string} BMTypeA
 * @typedef {BMTypeA|BMTypeA[]} BMType
 * @typedef {"Read"|"Write"|"ReadWrite"} BMVisibility
 * 
 * @param {Object} options
 * @param {string} options.name
 * @param {[string,string,string]} options.texts
 * @param {string} options.type
 * @param {number} options.color
 * @param {string} options.helpUrl
 * @param {{[name:string]:BMType}} options.constructor
 * @param {[string,string,BMType,BMVisibility][]} options.members
 */
export function quickCustomBlock(options){
    const [un,le,de] = options.texts
    const params = Object.entries(options.constructor)
    /** @type {import("./blockly.mjs").BlockInfo[]} */ const ret = [] 
    

    /* CONSTRUCTOR */
    Blockly.defineBlocksWithJsonArray([
        {
            type: `create_${options.name}`,
            tooltip: `créer ${un}`,
            helpUrl: options.helpUrl,
            message0: params.length<=1 ? `créer ${un} %1` : `créer ${un} %1${params .map((it,i)=>`avec ${it[0]} %${i+2}`) .join(" ")}`,
            args0: [
                ...( params.length<=1 ? [] : [{ type: "input_dummy", name: "DUMMY" }]),
                ...( params .map((it,i) => ({type:"input_value", name: it[0].toUpperCase(), align: "RIGHT", check: it[1]})) )
            ],
            output: options.type,
            colour: options.color
        }
    ])
    Javascript.javascriptGenerator.forBlock["create_jauge_type"] = function(block,generator){
        return [
            `new ${options.type}(${params.forEach((it,i)=>`\${generator.valueToCode(block,"${it[0].toUpperCase()}",0)},`)})`,
            Javascript.Order.ATOMIC
        ]
    }
    ret.push({
        kind: 'block',
        type: `create_${options.name}`,
        inputs: Object.fromEntries((function*(){
            for(const [name,type] of params){
                let field = null
                if(type=="String") field = {type:"text",fields:{TEXT:name}}
                else if(type=="Color") field = {type:"color",fields:{VALUE:"#ff0000"}}
                else if(type=="Number") field = {type:"math_number",fields:{NUM:"0"}}
                if(field!=null) yield [name.toUpperCase(), {shadow:field} ]
            }
        })())
    })


    /* GETTERS */
    if(options.members.length>0){
        const type_map = Object.fromEntries(options.members.map(it=>[it[1],it[2]]))
        Blockly.Extensions.register(`get_${options.name}_init`, function(){
            const block = this
            this.getField("MEMBER").setValidator(function(input){
                block.outputConnection.setCheck(type_map[input])
            })
            block.setFieldValue(block.getFieldValue("MEMBER"),"MEMBER")
        })
        Blockly.defineBlocksWithJsonArray([
            {
                type: `get_${options.name}`,
                tooltip: `récupérer une valeur ${de}`,
                helpUrl: options.helpUrl,
                message0: `%1 de %2`,
                args0: [
                    {
                        type: "field_dropdown",
                        name: "MEMBER",
                        options: options.members .filter(it=>it[3].startsWith("Read")) .map(it=>[it[0],it[1]])
                    },
                    {
                        type: "input_value",
                        name: "SOURCE",
                        align: "RIGHT",
                        check: options.type
                    }
                ],
                output: "NOTHING",
                colour: options.color,
                extensions: [`get_${options.name}_init`]
            }
        ])
        Javascript.javascriptGenerator.forBlock[`get_${options.name}`] = function(block,generator){
            return [
                `${generator.valueToCode(block,"SOURCE",Javascript.Order.MEMBER)}.${block.getFieldValue("MEMBER")}`,
                Javascript.Order.ATOMIC
            ]
        }
        ret.push({
            kind: 'block',
            type: `get_${options.name}`,
        })
    }



    return ret
}