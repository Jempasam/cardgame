import { Picture } from "../cardgame/icon/Picture.js";
import { html } from "../utils/doc.js";
import { get } from "../utils/query.js";


const render_canvas = /** @type {HTMLCanvasElement} */ ( document.querySelector("#renderer"));
const editor_canvas = /** @type {HTMLCanvasElement} */ (document.querySelector("#editor_renderer"));
const load_textarea = /** @type {HTMLTextAreaElement} */ (document.querySelector("#load_content"));
const load_button = /** @type {HTMLButtonElement} */ (document.querySelector("#load"));
const color_display = document.querySelector("#color_display");

let picture = new Picture()

import rendering_modes from "./picture/rendering_modes.js";
let rendering_mode = rendering_modes.shaded
let current_effect = it=>it
let brush = ["color", 0];
let light_direction = [1,0]

function render() {
  // Draw
  const context = render_canvas.getContext("2d");
  context.save();
  context.scale(render_canvas.width, render_canvas.height);
  context.clearRect(0, 0, 1, 1);
  rendering_mode(context, current_effect(picture), light_direction);
  context.restore();

  // Draw Editor
  const editor_context = editor_canvas.getContext("2d");
  editor_context.save();
  editor_context.scale(editor_canvas.width, editor_canvas.height);
  editor_context.clearRect(0, 0, 1, 1);
  if (brush[0] == "color" || brush[1] == -1) picture.baked().draw(editor_context)
  else picture.baked().makeDepthmap().draw(editor_context)
  editor_context.restore();

  // Fill save load
  load_textarea.value = JSON.stringify([picture.materials, picture.pixel_materials, picture.pixel_depth]);
}

// Rollback
let rollstack = []
function rollback(){
  if(rollstack.length>0){
    picture = rollstack.pop()
    for(let i=0; i<4; i++) setMaterial(i,picture.materials[i])
    render()
  }
}
function add_rollback(){
  if(rollstack.length>10) rollstack.splice(0,1)
  rollstack.push(picture.clone())
}
document.addEventListener("keydown", (e) => {
  if(e.ctrlKey && e.key=="z") rollback()
})

render();

// Load textarea
load_textarea.addEventListener("input", () => {
  try {
    const params = JSON.parse(load_textarea.value)
    picture = new Picture(...params);
    render();
  } catch (e) {}
});

// Editor Select
function selectBrush(type, number) {
  brush = [type, number];
  document.getElementById(`${type}${number}`).checked = true;
  if (type == "color") {
    const {color,alpha} = picture.materials[number];
    color_display.innerHTML = "C";
    color_display.style.backgroundColor = `rgba(${Math.floor(color[0] * 255)},${Math.floor(color[1] * 255)},${Math.floor(color[2] * 255)},${alpha})`;
  } else {
    if (number == -1) {
      color_display.style.backgroundColor = "transparent";
      color_display.innerHTML = "X";
    } else {
      const depth = Math.floor((number / 10) * 225) + 20;
      color_display.style.backgroundColor = `rgba(${depth},${depth},${depth},1)`;
      color_display.innerHTML = "+" + number;
    }
  }
  render();
}

const editor = document.querySelector("#editor");

editor.appendChild(html.a`<label for="depth-1">[ EMPTY ]</label>`);
const added = html.a`<input type="radio" name="tileselect" id="depth-1"/>`;
editor.appendChild(added);
added.onchange = () => selectBrush("depth", -1);

for (let i = 0; i < 4; i++) {
  editor.appendChild(html.a`<label for="color${i}">COLOR ${i + 1}</label>`);
  const added = html.a`<input type="radio" name="tileselect" id="color${i}"/>`;
  editor.appendChild(added);
  added.onchange = () => selectBrush("color", i);
}
for (let i = 0; i < 10; i++) {
  editor.appendChild(html.a`<label for="depth${i}">Depth ${i + 1}</label>`);
  const added = html.a`<input type="radio" name="tileselect" id="depth${i}">Depth ${i}</input>`;
  editor.appendChild(added);
  added.onchange = () => selectBrush("depth", i);
}

selectBrush("color", 0);

// Light direciton
document.querySelector("#light_direction").oninput = (e)=>{
    const angle = e.target.value * Math.PI/180
    light_direction = [Math.cos(angle), Math.sin(angle)]
    render()
    console.log(light_direction)
}

// Rendering Mode
get("#rendering_mode").append(html`
  ${function*(){
      for(const [name, func] of Object.entries(rendering_modes)){
          const option=html.a`<option value=${name}>${name}</option>`
          option.onclick = ()=>{rendering_mode=func; render()}
          yield option
      }
  }}
`)

get("#rendering_mode").firstElementChild.click()

// Effects
import effects from "./picture/effects.js";
import { chest } from "../yugioh/pictures.js";
get("#effects").append(html`
  ${function*(){
      for(const [name, func] of Object.entries(effects)){
          const option=html.a`<option value=${name}>${name}</option>`
          option.onclick = ()=>{current_effect=func; render()}
          yield option
      }
  }}
`)

get("#effects").firstElementChild.click()

// Editor Draw
function setValue(x, y) {
  if (brush[0] == "color") {
    if(brush[1]==picture.get_material_index(x,y) && picture.get_depth(x,y)!=-1) return
    add_rollback()
    if (picture.get_depth(x, y) == -1) picture.set_depth(x, y, 0);
    picture.set_material_index(x, y, brush[1]);
  } else{
    if(brush[1]==picture.get_depth(x,y)) return
    add_rollback()
    picture.set_depth(x, y, brush[1]);
  }
  render();
}

editor_canvas.onmousedown = editor_canvas.onmousemove = render_canvas.onmousedown = render_canvas.onmousemove = (e) => {
  let canvas = /** @type {HTMLCanvasElement} */ (e.target);

  if (e.buttons == 0) return;
  e.preventDefault();

  const x = Math.floor((e.offsetX / canvas.width) * picture.width);
  const y = Math.floor((e.offsetY / canvas.height) * picture.height);

  // Pick
  if (e.buttons == 4) {
    if (picture.get_depth(x, y) == -1) selectBrush("depth", -1);
    else if (brush[0] == "depth" && brush[1] != -1)
      selectBrush("depth", picture.get_depth(x, y));
    else selectBrush("color", picture.get_material_index(x, y));
    return;
  }

  // Erase
  if (e.buttons == 2) {
    picture.set_depth(x, y, -1);
    render();
    return;
  }

  // Draw
  console.log(x, y, brush);
  setValue(x, y);
};
editor_canvas.oncontextmenu = render_canvas.oncontextmenu = (e) => e.preventDefault();

// Set color
/**
 * @param {number} index 
 * @param {import("../cardgame/icon/Picture.js").PictureMaterial} material 
 */
function setMaterial(index,material){
    // Elements
    const color_picker = get(`#colors${index}`)
    const alpha_picker= get(`#alpha${index}`)
    const light_picker= get(`#light${index}`)
    const reflection_picker= get(`#reflection${index}`)
    const selector = get(`[for=color${index}]`)
    console.log(selector)


    picture.materials[index] = material

    // Set color
    const realcolor= material.color.map(it=>Math.floor(it*255))
    const realalpha = material.alpha

    color_picker.value = "#"+realcolor.map(it=>it.toString(16).padStart(2,"0")) .join("")
    alpha_picker.value = Math.floor(realalpha*100)
    light_picker.value = Math.floor(material.light*100)
    reflection_picker.value = Math.floor(material.reflection*100)
    selector.style.color = `rgba(${realcolor.join(",")},${realalpha})`

    render()
}

for(let i=0; i<4; i++){
    setMaterial(i,picture.materials[i])
    const color_picker= get(`#colors${i}`)
    const alpha_picker= get(`#alpha${i}`)
    const light_picker= get(`#light${i}`)
    const reflection_picker= get(`#reflection${i}`)
    color_picker.oninput = alpha_picker.oninput = light_picker.oninput = reflection_picker.oninput = (e)=>{
        const color = color_picker.value.slice(1).match(/.{2}/g).map(it=>parseInt(it,16)/255)
        const alpha = parseInt(alpha_picker.value)/100
        const light = parseInt(light_picker.value)/100
        const reflection = parseInt(reflection_picker.value)/100
        setMaterial(i,{color,alpha,light,reflection})
    }
}

// Examples
const example_select = get("#examples")
const example_json = await fetch(import.meta.resolve("./picture/shapes.json")).then(it=>it.json())
for(const [name, data] of Object.entries(example_json)){
    const selection = html.a`<option value=${name}>${name}</option>`
    selection.onclick=()=>{
        picture = new Picture(...data)
        for(let i=0; i<4; i++) setMaterial(i,picture.materials[i])
    }
    example_select.appendChild(selection)
}
example_select.firstElementChild.click()

// Move
function translate(dx,dy){
    let moved = new Picture()
    moved.materials= picture.materials
    for(let [x,y] of moved.indexes()){
      const coords= [(x-dx+picture.width)%picture.width, (y-dy+picture.height)%picture.height]
      moved.set_material_index(x,y, picture.get_material_index(...coords))
      moved.set_depth(x,y, picture.get_depth(...coords))
    }
    picture = moved
    render()
}

document.querySelector("#move_top").onclick = ()=>translate(0,-1)
document.querySelector("#move_bottom").onclick = ()=>translate(0,1)
document.querySelector("#move_left").onclick = ()=>translate(-1,0)
document.querySelector("#move_right").onclick = ()=>translate(1,0)

// Export
get("#export_image").onclick = ()=>{
  html.a`<a href="${render_canvas.toDataURL("image/png")}" download></a>`.click()
}

// Symmetry
get("#symmetrize").onclick = (e)=>{
  add_rollback()
  for(let x=picture.width/2+picture.width%2; x<picture.width; x++){
      for(let y=0; y<picture.height; y++){
          const coords = [picture.width-x-1,y]
          picture.set_material_index(x,y, picture.get_material_index(...coords))
          picture.set_depth(x,y, picture.get_depth(...coords))
      }
  }
  render()
}

// Auto Depth
get("#autodepth").onclick = (e)=>{
  add_rollback()
  let is_changed= Array.from({length:picture.width*picture.height}, ()=>true)

  // Set no depth
  for(let [x,y] of picture.indexes()){
      if(picture.get_depth(x,y)!=-1) is_changed[x+y*picture.width]=false
  }

  // Fill
  let remaining = false
  do{
    remaining=false
    const new_is_changed=structuredClone(is_changed)
    for(let [x,y] of picture.indexes()){
      if(is_changed[x+y*picture.width])continue
      let max=-2
      for(let [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]]){
        const [xx,yy] = /** @type {[Number,number]} */ ([x+dx,y+dy])
        if(!picture.contains(xx,yy) || !is_changed[xx+yy*picture.width]) continue
        max = Math.max(max, picture.get_depth(xx,yy))
      }
      if(max>-2){
        new_is_changed[x+y*picture.width]=true
        picture.set_depth(x,y,max+1)
        console.log(max+1)
      }
      else remaining=true
    }
    is_changed=new_is_changed
  }while(remaining)
  render()
}

// Resize
get("#width").onchange = get("#height").onchange = (e)=>{
  add_rollback()
  const width = parseInt(get("#width").value)
  const height = parseInt(get("#height").value)
  get("#width").value = ""+width
  get("#height").value = ""+height
  const new_sized_picture= new Picture(picture.materials, undefined, undefined, width, height)
  const maxx=Math.min(width,picture.width)
  const maxy=Math.min(height,picture.height)
  for(let x=0; x<maxx; x++){
    for(let y=0; y<maxy; y++){
      new_sized_picture.set_material_index(x,y, picture.get_material_index(x,y))
      new_sized_picture.set_depth(x,y, picture.get_depth(x,y))
    }
  }
  picture=new_sized_picture
  render()
}