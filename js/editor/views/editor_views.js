import { mergeAddons } from "../../workbench/addon.js";
import global from "../../workbench/common.js";
import file from "../../workbench/file.js";
import jauge, { JAUGE_TYPE_STATES } from "../../workbench/jauge.js";
import { BlocklyEditorView } from "./BlocklyEditorView.js";
import { EditorView } from "./EditorView.js";
import { PictureEditorView } from "./PictureEditorView.js";
import { StubEditorView } from "./StubEditorView.js";

/** @type {{[id:string]:EditorView}} */ 
export default {
    "🌡️jauges": new BlocklyEditorView(mergeAddons(global,file,jauge), {type:'save_file', inputs:{"VALUE":{block:JAUGE_TYPE_STATES[0]}}}),
    "🖼️picture": new PictureEditorView(),
    else: new StubEditorView()

}