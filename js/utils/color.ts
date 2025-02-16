

export function css_to_rgb(css_color: string){
    let element = document.createElement("div")
    document.body.append(element)
    element.style.backgroundColor = css_color
    const rgb_text = window.getComputedStyle(element).backgroundColor .slice(4,-1) .split(",") .map(it=>parseFloat(it))
    element.remove()
    return rgb_text as [number,number,number]
}