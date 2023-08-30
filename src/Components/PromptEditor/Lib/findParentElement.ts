/**
 * 在元素的父级链上找元素
 * @param el
 * @param findFunc
 */
export function findParentElement(
    el: HTMLElement,
    findFunc: (el: HTMLElement, deep: number) => boolean,
    deep = 0
): HTMLElement | undefined {
    if (el.parentElement) {
        if (findFunc(<any>el.parentElement, deep)) {
            return el.parentElement
        } else {
            return findParentElement(<any>el.parentElement, findFunc, deep + 1)
        }
    } else {
        return undefined
    }
}
