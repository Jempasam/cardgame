

/**
 * Get a the rgb components of a css color
 * @param {string} css_color
 */
export function css_to_rgb(css_color){
    let element = document.createElement("div")
    document.body.append(element)
    element.style.backgroundColor = css_color
    console.log("element",element)
    const rgb_text = window.getComputedStyle(element).backgroundColor .slice(4,-1) .split(",") .map(it=>parseFloat(it))
    element.remove()
    return /** @type {[number,number,number]} */ (rgb_text)
}