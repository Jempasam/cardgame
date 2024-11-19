import { drawIcon } from "../cardgame/icon/Icon.js";
import { html } from "../utils/doc.js";

// Canvas
const canvas = document.getElementsByTagName("canvas")[0];
const graphics = canvas.getContext("2d");
graphics.scale(canvas.width / 2.2, canvas.height / 2.2);
graphics.translate(1.05, 1.05);

const objects = {
  dragon: [
    1.0, 0.1, 0.1, 1.0, 0.5, 0.1, 0.1, 1.0, 0.5, 0.1, 0.1, 1.0, 1.0, 0.0, 0.0,
    1.0,

    1.0, 0.5, 0.0, 0.4, 0.1, 0.1,

    0.3, 0.2, 0.2, 0.2, 0.3, 0.5, 0.9, 1, 0.9, 0.5, 0.3, 0.2, 0.2, 0.2, 0.3, 1,
    0.9, 0.7, 0.4, 0.5, 1, 0.4, 0.3, 0.4, 1, 0.5, 0.4, 0.7, 0.9, 1,
  ],
  spider: [
    0.286, 0.17, 0.155, 0.988, 0.155, 0.008, 0.055, 0.996, 0.155, 0.093, 0.093,
    0.988, 0.047, 0.024, 0.001, 0.988, 0.957, 0.525, 0.525, 0.255, 0.016, 0.355,
    0.988, 0.109, 0.988, 0.109, 0.672, 0.001, 0.433, 0.502, 0.433, 0.001, 0.672,
    0.109, 0.988, 0.109, 0.988, 0.001, 0.718, 0.008, 0.309, 0.51, 0.687, 0.772,
    0.896, 0.772, 0.687, 0.51, 0.309, 0.008, 0.718, 0.001,
  ],
  goblin: [
    0.12, 0.7, 0.1, 1.0, 0.12, 0.48, 0.1, 1.0, 0.3, 0.34, 0.1, 1.0, 0.29, 0.26,
    0.0, 1.0, 0.41, 0.35, 0.0, 0.38, 0.05, 0.07, 0.3, 0.13, 0.1, 0.13, 0.3,
    0.35, 0.71, 0.79, 0.71, 0.35, 0.3, 0.13, 0.1, 0.13, 0.3, 0.38, 0.51, 0.51,
    0.66, 0.99, 0.72, 0.4, 0.3, 0.4, 0.72, 0.99, 0.66, 0.51, 0.51, 0.38, 0.82,
  ],
  fish: [
    0.54, 0.64, 0.15, 0.22, 0.76, 0.91, 0.78, 0.44, 0.4, 0.57, 0.43, 0.48, 0.11,
    0.35, 0.14, 0.34, 0.06, 0.68, 0.98, 0.25, 0.47, 0.93, 0.02, 0.01, 0.07,
    0.13, 0.26, 0.48, 0.66, 0.84, 0.66, 0.47, 0.31, 0.22, 0.13, 0.2, 0.28, 0.4,
    0.4, 0.0, 0.05, 0.11, 0.19, 0.86, 0.71, 0.86, 0.19, 0.11, 0.05, 0.0, 0.0,
    0.0, 0.93,
  ],
  fire: [
    1.0, 0.61, 0.16, 0.34, 0.96, 0.1, 0.1, 0.43, 0.99, 0.07, 0.14, 0.96, 0.98,
    0.06, 0.02, 0.3, 0.58, 1.0, 0.4, 0.4, 0.1, 0.02, 0.24, 0.23, 0.22, 0.22,
    0.28, 0.27, 0.28, 0.27, 0.28, 0.27, 0.28, 0.22, 0.22, 0.23, 0.24, 0.19, 0.2,
    0.24, 0.28, 0.35, 0.5, 0.67, 0.81, 0.67, 0.5, 0.35, 0.28, 0.24, 0.2, 0.19,
    0.23, 0.21, 0.2, 0.2,
  ],
};

const transitions = {
    linear: (a, b, r, i, m)=> a*(1-r) + b*r,
    pow: (a, b, r, i, m)=> Math.sqrt(a*a*(1-r) + b*b*r),
    sqrt: (a, b, r, i, m)=> Math.pow(Math.sqrt(a)*(1-r) + Math.sqrt(b)*r, 2),
    progressive : (a, b, r, i, m)=>{
        let wait = Math.min(1, Math.abs((i)-(m-1)/2)/((m*1.2)/2))
        let progression = Math.min(1,Math.max(0, r - wait)* (1/(1-wait)))
        return a*(1-progression) + b*progression
    }
}

const effects = {

    none: it => it,

    thin: it => it.map((v,i) => i > 21 ? Math.pow(v, 2) : v),

    fat: it => it.map((v,i) => i > 21 ? Math.sqrt(v) : v),

    broken: it => it.map((v,i) => i > 21 ? v*0.7 + Math.random()*v*0.3 : v),

    slashed: it => it.map((v,i) =>{
        if(i==40 || i==25) return 0
        if(i==41 || i==26) return 1
        return v
    }),

    hitten: it => it.map((v,i) =>{
        let distance = Math.abs(44-i)
        if(distance<4) return v*(distance/4)
        return v
    }),

    burning: it => it.map((v,i) =>{
        if(i==0 || i==4 || i==16) return Math.min(1,v+0.2)
        else if(i>=8 && i<=11) return Math.max(0,v-0.2)
        else if(i==16) return (v+1)/2
        else if(i==17) return (v+0.2)/2
        else if(i==18) return (v+0)/2
        else if(i==19) return (v+0.5)/2
        else if(i==20) return Math.min(1,v+0.1)
        else return v
    })
}

const target = [...objects.dragon]
let resolution = 60
let effect = (target) => target
let effect_strength = 1
let fusion = [...target]
let fusion_strength = 0
let transition = transitions.linear

// Transition
const transition_selector = document.getElementById("transition")
for (const key in transitions) {
    transition_selector.appendChild(html.a`<option value=${key}>${key}</option>`).onclick = () => {
        transition = transitions[key]
        redraw()
    }
}

// Selector
const selector = document.getElementById("selector");
for (const key in objects) {
  selector.appendChild(html.a`<option value=${key}>${key}</option>`).onclick =
    () => {
      objects[key].forEach((value, index) => (target[index] = value));
      redraw();
    };
}

// Fusion
let memorize = document.getElementById("memorize");
let fusion_strength_range = document.getElementById("fusion_strength");
memorize.onclick = () => {
    fusion = [...target];
}
fusion_strength_range.oninput = () => {
    fusion_strength = parseFloat(fusion_strength_range.value)/100;
    redraw();
}

// Animate
let animate = document.getElementById("animate");
animate.onclick = () => {
    let progress= 0;
    setTimeout(function fn(){
        progress+=0.01
        fusion_strength_range.value = Math.round(progress*100)
        fusion_strength_range.oninput()
        if(progress<1) setTimeout(fn, 20)
    },20)
}

// Effects
const effect_selector = document.getElementById("effect");
for (const key in effects) {
    effect_selector.appendChild(html.a`<option value=${key}>${key}</option>`).onclick = () => {
    effect = effects[key];
    redraw();
  };
}

// Effect strength
const effect_strength_range = document.getElementById("effect_strength");
effect_strength_range.oninput = () => {
    effect_strength = parseFloat(effect_strength_range.value)/100;
    redraw();
}


// Sliders
const slider = /**@type {HTMLCanvasElement}*/ (
  document.getElementById("slider")
);

slider.onmousemove = (event) => {
    const rect = slider.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    if (event.buttons) {
        target[Math.floor(y * target.length)] = x;
        redraw();
    }
    slider.title = `${Math.floor(y * target.length)}: ${x.toFixed(2)}`;

}

function drawSlider() {
  const graphics = slider.getContext("2d");
  graphics.clearRect(0, 0, slider.width, slider.height);
  for (let i = 0; i < target.length; i++) {
    if (0 <= i && i < 4) graphics.fillStyle = `red`;
    else if (4 <= i && i < 8) graphics.fillStyle = `blue`;
    else if (8 <= i && i < 12) graphics.fillStyle = `cyan`;
    else if (12 <= i && i < 16) graphics.fillStyle = `green`;
    else if (16 <= i && i < 20) graphics.fillStyle = `purple`;
    else if (20 <= i && i < 22) graphics.fillStyle = `yellow`;
    else if (22 <= i && i < 37) graphics.fillStyle = `orange`;
    else graphics.fillStyle = `black`;
    graphics.fillRect(
      0,
      (i * slider.height) / target.length,
      slider.width * target[i],
      slider.height / target.length
    );
  }
}

// Resolutions
const resolutions = document.getElementById("resolution");
resolutions.oninput = () => {
  resolution = parseInt(resolutions.value);
  redraw();
};

// Output
const output = document.getElementById("output");
output.oninput = () => {
  const values = output.value
    .replace(" ", "")
    .split(",")
    .map((v) => parseFloat(v));
  if (values.length === target.length) {
    for (let i = 0; i < values.length; i++) {
      target[i] = values[i];
    }
    redraw();
  } else output.style.color = "red";
};

function redraw() {
  graphics.clearRect(-10, -10, 20, 20);
  const fusioned= Array.from({length: target.length}, (_, i) => transition(target[i], fusion[i], fusion_strength, i, target.length));
  const filtered= effect(fusioned)
  const final = Array.from({length: target.length}, (_, i) => fusioned[i]*(1-effect_strength) + filtered[i]*effect_strength);
  drawIcon(graphics, final, resolution);
  drawSlider();
  output.value = target.map((v) => v.toFixed(2)).join(",");
}

redraw();

// Randomize
document.getElementById("randomize").onclick = () => {
  for (let i = 0; i < target.length; i++) {
    target[i] = Math.max(
      0,
      Math.min(1, target[i] + (Math.random() - 0.5) / 10)
    );
  }
  redraw();
};

// Full random
document.getElementById("random").onclick = () => {
  for (let i = 0; i < target.length; i++) {
    target[i] = Math.random();
  }
  redraw();
};

// Symmetry
document.getElementById("symetrize").onclick = () => {
  for (let i = 0; i <= 8; i++) {
    target[30 - i] = target[28 + i];
  }
  for (let i = 0; i <= 6; i++) {
    target[45 + i] = target[43 - i];
  }
  redraw();
};
