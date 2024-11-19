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
let brush = ["color", 0];
let light_direction = [1,0]

function render() {
  console.log("Render");

  // Draw
  const context = render_canvas.getContext("2d");
  context.save();
  context.scale(render_canvas.width, render_canvas.height);
  context.clearRect(0, 0, 1, 1);
  rendering_mode(context, picture, light_direction);
  context.restore();

  // Draw Editor
  const editor_context = editor_canvas.getContext("2d");
  editor_context.save();
  editor_context.scale(editor_canvas.width, editor_canvas.height);
  editor_context.clearRect(0, 0, 1, 1);
  if (brush[0] == "color" || brush[1] == -1)
    picture.drawColorTo(editor_context);
  else picture.drawDepthTo(editor_context);
  editor_context.restore();

  // Fill save load
  load_textarea.value = JSON.stringify([picture.colors, picture.pixel_colors, picture.pixel_depth]);
}

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
    const color = picture.colors[number];
    color_display.innerHTML = "C";
    color_display.style.backgroundColor = `rgba(${Math.floor(
      color[0] * 255
    )},${Math.floor(color[1] * 255)},${Math.floor(color[2] * 255)},${
      color[3]
    })`;
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

// Editor Draw
function setValue(x, y) {
  if (brush[0] == "color") {
    if (picture.get_depth(x, y) == -1) picture.set_depth(x, y, 0);
    picture.set_color_index(x, y, brush[1]);
  } else picture.set_depth(x, y, brush[1]);
  render();
}

editor_canvas.onmousedown = editor_canvas.onmousemove = (e) => {
  if (e.buttons == 0) return;
  e.preventDefault();

  const x = Math.floor((e.offsetX / editor_canvas.width) * picture.width);
  const y = Math.floor((e.offsetY / editor_canvas.height) * picture.height);

  // Pick
  if (e.buttons == 4) {
    if (picture.get_depth(x, y) == -1) selectBrush("depth", -1);
    else if (brush[0] == "depth" && brush[1] != -1)
      selectBrush("depth", picture.get_depth(x, y));
    else selectBrush("color", picture.get_color_index(x, y));
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
editor_canvas.oncontextmenu = (e) => e.preventDefault();

// Set color
/**
 * @param {number} index 
 * @param {[number,number,number,number]} color 
 */
function setColor(index,color){
    // Elements
    const color_picker = get(`#colors${index}`)
    const alpha_picker= get(`#alpha${index}`)
    const selector = get(`#color${index}`)

    picture.colors[index] = color

    // Set color
    const realcolor= color.slice(0,3).map(it=>Math.floor(it*255))
    const realalpha = color[3]

    color_picker.value = "#"+realcolor.map(it=>it.toString(16).padStart(2,"0")) .join("")
    alpha_picker.value = Math.floor(realalpha*100)
    selector.style.color = `rgba(${realcolor.join(",")},${color[3]})`

    render()
}

for(let i=0; i<4; i++){
    setColor(i,picture.colors[i])
    const color_picker= get(`#colors${i}`)
    const alpha_picker= get(`#alpha${i}`)
    color_picker.oninput = alpha_picker.oninput = (e)=>{
        const color = color_picker.value.slice(1).match(/.{2}/g).map(it=>parseInt(it,16)/255)
        const alpha = parseInt(alpha_picker.value)/100
        setColor(i,[...color,alpha])
    }
}

// Examples
const example_select = get("#examples")
const example_json = await fetch(import.meta.resolve("./picture/shapes.json")).then(it=>it.json())
for(const [name, data] of Object.entries(example_json)){
    const selection = html.a`<option value=${name}>${name}</option>`
    selection.onclick=()=>{
        picture = new Picture(...data)
        for(let i=0; i<4; i++) setColor(i,picture.colors[i])
    }
    example_select.appendChild(selection)
}
example_select.firstElementChild.click()

// Move
function translate(dx,dy){
    let moved = new Picture()
    moved.colors= picture.colors
    for(let [x,y] of moved.indexes()){
      const coords= [(x-dx+picture.width)%picture.width, (y-dy+picture.height)%picture.height]
      moved.set_color_index(x,y, picture.get_color_index(...coords))
      moved.set_depth(x,y, picture.get_depth(...coords))
    }
    picture = moved
    render()
}
document.querySelector("#move_top").onclick = ()=>translate(0,-1)
document.querySelector("#move_bottom").onclick = ()=>translate(0,1)
document.querySelector("#move_left").onclick = ()=>translate(-1,0)
document.querySelector("#move_right").onclick = ()=>translate(1,0)