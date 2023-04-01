export interface IMoveableOptions {
    /** 开始回调，返回 True  提前终止移动*/
    callback_start?: (e: IMoveInfo) => boolean
    /** 移动回调，返回 True 提前终止移动*/
    callback_move?: (e: IMoveInfo) => boolean
    /** 开始回调，关闭*/
    callback_end?: (e: IMoveInfo) => void
    /** 传递 passive 参数给 move 事件， 默认为 ture */
    passive?: boolean
    /** 元素移动 */
    setMove?: boolean
    /** 只允许指定类名的元素移动 */
    allowClass?: string
    /** Vue 事件如果给定，会在其销毁时自动取消监听*/
    vueIns?: any
}

export interface IMoveInfo {
    startEvent: MouseEvent | TouchEvent | null
    event: MouseEvent | TouchEvent | null
    startX: number
    startY: number
    x: number
    y: number
    offsetX: number
    offsetY: number
    startOffsetX: number
    startOffsetY: number
    startStyleX: number
    startStyleY: number

    lastStartOffsetX: number
    lastStartOffsetY: number
    fixStartOffsetX: number
    fixStartOffsetY: number
}

/**
 * 创建基于元素的移动事件监听
 * @param el
 * @param options
 */
export default function setMoveable(el: HTMLElement, options: IMoveableOptions) {
    const doc = document.body
    let moveInfo: IMoveInfo = <IMoveInfo>{}

    let eventOptions = options.passive ?? true
    el.addEventListener("mousedown", start, false)
    // el.addEventListener("contextmenu", start, false)
    el.addEventListener("touchstart", start, false)

    function start(e: MouseEvent | TouchEvent) {
        if (options.allowClass) {
            if (!(<any>e)?.target?.classList.contains(options.allowClass)) return
        }

        let clientX, clientY
        if (typeof TouchEvent != "undefined" && e instanceof TouchEvent) {
            clientX = e.touches[0].clientX
            clientY = e.touches[0].clientY
        } else {
            clientX = (<MouseEvent>e).clientX
            clientY = (<MouseEvent>e).clientY
        }

        moveInfo.event = e
        moveInfo.x = clientX
        moveInfo.y = clientY
        moveInfo.offsetX = 0
        moveInfo.offsetY = 0
        moveInfo.startOffsetX = 0
        moveInfo.startOffsetY = 0
        moveInfo.lastStartOffsetX = 0
        moveInfo.lastStartOffsetY = 0
        moveInfo.fixStartOffsetX = 0
        moveInfo.fixStartOffsetY = 0
        moveInfo.startX = clientX
        moveInfo.startY = clientY
        moveInfo.startStyleX = el.style.left ? parseFloat(el.style.left) : el.getBoundingClientRect().left
        moveInfo.startStyleY = el.style.top ? parseFloat(el.style.top) : el.getBoundingClientRect().top
        moveInfo.startEvent = e

        // console.log("[setMoveable]", moveInfo, e)
        if (options.callback_start) {
            let stop = options.callback_start(moveInfo)
            if (stop) return
        }

        // 设置 class
        el.classList.toggle("moveable-moving", true)
        doc.classList.toggle("moveable-doc-moving", true)
        registEvent()
    }

    function move(e: MouseEvent | TouchEvent) {
        let clientX, clientY
        if (typeof TouchEvent != "undefined" && e instanceof TouchEvent) {
            clientX = e.touches[0].clientX
            clientY = e.touches[0].clientY
        } else {
            if ((<MouseEvent>e).buttons === 0) {
                end()
                return
            }
            clientX = (<MouseEvent>e).clientX
            clientY = (<MouseEvent>e).clientY
        }

        moveInfo.event = e
        moveInfo.offsetX = clientX - moveInfo.x
        moveInfo.offsetY = clientY - moveInfo.y
        moveInfo.startOffsetX = clientX - moveInfo.startX
        moveInfo.startOffsetY = clientY - moveInfo.startY
        moveInfo.fixStartOffsetX = moveInfo.startOffsetX - moveInfo.lastStartOffsetX
        moveInfo.fixStartOffsetY = moveInfo.startOffsetY - moveInfo.lastStartOffsetY
        moveInfo.lastStartOffsetX = moveInfo.startOffsetX
        moveInfo.lastStartOffsetY = moveInfo.startOffsetY
        moveInfo.x = clientX
        moveInfo.y = clientY


        if (options.callback_move) {
            let stop = options.callback_move(moveInfo)
            if (stop) return
        }

        if (options.setMove) {
            el.style.left = moveInfo.startStyleX + moveInfo.startOffsetX + "px"
            el.style.top = moveInfo.startStyleY + moveInfo.startOffsetY + "px"

            // el.style.transform = `translate(${moveInfo.startOffsetX}px, ${moveInfo.startOffsetY }px)`
        }

        e.preventDefault()
    }

    function end() {
        moveInfo.startEvent = null
        unRegistEvent()
        if (options.callback_end) options.callback_end(moveInfo)

        // 设置 class
        el.classList.toggle("moveable-moving", false)
        doc.classList.toggle("moveable-doc-moving", false)

        // 如果最近移动过（距离大于1），设置一个临时 class 标记
        if (moveInfo.startOffsetX + moveInfo.startOffsetY > 1) {
            el.classList.toggle("moveable-moved-recent", true)
            setTimeout(() => {
                el.classList.toggle("moveable-moved-recent", false)
            }, 300)
        }
    }

    /**
     * 注册事件
     */
    function registEvent() {
        doc.addEventListener("mousemove", move, eventOptions)
        doc.addEventListener("touchmove", move, eventOptions)
        doc.addEventListener("mouseup", end, false)
        doc.addEventListener("touchend", end, false)
    }

    /**
     * 解绑事件
     */
    function unRegistEvent() {
        doc.removeEventListener("mousemove", move, eventOptions)
        doc.removeEventListener("touchmove", move, eventOptions)
        doc.removeEventListener("mouseup", end, false)
        doc.removeEventListener("touchend", end, false)
    }

    let destroyListener = () => {
        el.removeEventListener("mousedown", start, false)
        el.removeEventListener("contextmenu", start, false)
        el.removeEventListener("touchstart", start, false)

        el.removeEventListener("touchmove", move, eventOptions)
        el.removeEventListener("mousemove", move, eventOptions)
        el.removeEventListener("mouseup", end, false)
        el.removeEventListener("touchend", end, false)
    }
    if (options.vueIns) {
        options.vueIns.$once("hook:beforeDestroy", () => {
            destroyListener()
        })
    }

    return destroyListener
}
