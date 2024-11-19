
/**
 * 
 * @param {[number,number,number,number]} color 
 * @returns 
 */
function cssColor(color){
    return `rgba(${Math.floor(color[0]*255)}, ${Math.floor(color[1]*255)}, ${Math.floor(color[2]*255)}, ${color[3]})`
}

/**
 * Array of size 42
 * @typedef {number[]} IconCode
 */

/**
 * 
 * @param {CanvasRenderingContext2D} graphics
 * @param {IconCode} code
 * @param {number} resolution
 */
export function drawIcon(graphics, code, resolution){
    const right_color = [code[0], code[1], code[2], code[3]]
    const bottom_color = [code[4], code[5], code[6], code[7]]
    const left_color = [code[8], code[9], code[10], code[11]]
    const top_color = [code[12], code[13], code[14], code[15]]
    const aura_color = cssColor([code[16], code[17], code[18], code[19]])
    const aura_size = code[20]
    const rotation = code[21]

    graphics.save()
    graphics.rotate(rotation*Math.PI/2)

    for(let i=0; i<resolution; i++){
        const ratio = i/resolution
        const l_ratio = Math.max(0, 1-Math.abs(1-ratio*4))
        const b_ratio = Math.max(0, 1-Math.abs(2-ratio*4))
        const r_ratio = Math.max(0, 1-Math.abs(3-ratio*4))
        const t_ratio = Math.max(0,Math.max(1-ratio*4, ratio*4-3))

        
        // Get left and right
        const float = ratio*30 - 0.5
        let left = (Math.floor(float)+30)%30
        let right = (left+1)%30
        let right_ratio = float - Math.floor(float)
        let left_ratio = 1-right_ratio
        left+=22
        right+=22

        // Values
        const radius = 0.3 + (code[left]*left_ratio + code[right]*right_ratio)*0.7
        const aura_radius = radius + aura_size
        const color = Array.from({length: 4}, (_, i) => right_color[i]*r_ratio + bottom_color[i]*b_ratio + left_color[i]*l_ratio + top_color[i]*t_ratio)
        const angle = Math.PI*2 * ratio
        const next_angle = angle + Math.PI*2/resolution

        if(aura_radius>radius+0.01){
            graphics.globalCompositeOperation="destination-over"
            graphics.fillStyle = aura_color
            graphics.beginPath()
            graphics.moveTo(0, 0)
            graphics.arc(0, 0, aura_radius, angle, next_angle)
            graphics.fill("nonzero")
            graphics.globalCompositeOperation="source-over"
        }

        //@ts-ignore
        graphics.fillStyle = cssColor(color)
        graphics.beginPath()
        graphics.moveTo(0, 0)
        graphics.arc(0, 0, radius, angle, next_angle+0.01)
        graphics.fill()
    }

    graphics.restore()
}
