import { html } from "../../utils/doc.js";

/**
 * A text part can be:
 * - A string to be shown directly.
 * - A number
 * - A Stringifiable object that can stringified differently depending on
 *   the rendering method.
 * - Another Text, that well be written as sub higlighted text.
 * - A strong text, that will be shown in bold.
 */
export type TextPart = string|number|Object|Text|StrongText|null|undefined

export type Text = TextPart[]

export type StrongText = {strong:string}

/**
 * Create a html element from a text object.
 */
export function createTextElement(text: Text){
    let ret=[]

    let first=true
    function treat(str: string){
        if(first && str.length>0){
            first=false
            return str[0].toUpperCase()+str.slice(1)
        }
        return str
    }

    for(let part of text){
        // A null or undefined value is ignored
        if(part == null || part==undefined) continue
        // A simple string
        else if(typeof part == "string") ret.push(html`${treat(part)}`)
        // A number
        else if(typeof part == "number") ret.push(html`<span class="-number">${part}</span>`)
        // A strong text
        else if(typeof part == "object" && "strong" in part) ret.push(html`<strong>${treat(part.strong)}</strong>`)
        // A sub text
        else if(Array.isArray(part)) ret.push(createTextElement(part))
        // Stringified
        else ret.push(html`${treat(part.toString())}`)
    }

    ret.push(html`.`)

    return html`<p class="text">${ret}</p>`
}