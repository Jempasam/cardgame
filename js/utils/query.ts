
/**
 * Get the first element that matches the selector
 */
export function get(target: string, root: Document|HTMLElement=undefined): HTMLElement{
    root ??= document
    return root.querySelector(target)
}