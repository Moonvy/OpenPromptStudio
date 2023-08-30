import setMoveable from "../../Lib/setMoveable"
import { findParentElement } from "../../Lib/findParentElement"

export default function initDnd(el: HTMLElement, vueIns: any) {
    let ghost: HTMLElement | null = null
    let isStart = false
    let elStartX = 0,
        elStartY = 0

    setMoveable(el, {
        callback_start: (e) => {
            let rect = (e.startEvent!.target as any).getBoundingClientRect()
            elStartX = rect.x
            elStartY = rect.y
            return false
        },

        callback_move: (e) => {
            // console.log("[dnd:move]", e)
            if (!isStart && Math.abs(e.startOffsetX) + Math.abs(e.startOffsetY) > 10) {
                dndStart()
            }
            if (ghost) {
                ghost.style.left = ` ${elStartX + e.startOffsetX}px`
                ghost.style.top = `${elStartY + e.startOffsetY}px`
                // console.log("[dnd:move]", { startEvent: e.startEvent, elStartX, elStartY })
            }
            return false
        },
        callback_end: (e) => {
            console.log("[dnd:end]", e)

            // 词典拖拽到工作区
            if (vueIns.$el.classList.contains("dict-word")) {
            }
            //工作区拖拽到工作区
            else {
            }

            let dropEl = <HTMLElement>e.event?.target
            if (dropEl.classList.contains("dnd-slot-pre") || dropEl.classList.contains("dnd-slot-next")) {
                let itemEl = findParentElement(dropEl, (el) => el.classList.contains("PromptItem"))
                if (itemEl) {
                    let itemVueIns = (<any>itemEl).__vue__
                    let item = itemVueIns.item
                    let list = itemVueIns.list

                    let orgItem = vueIns.item
                    let orgList = vueIns.list

                    orgList?.removePrompt(orgItem)
                    let offset = dropEl.classList.contains("dnd-slot-next") ? 1 : 0

                    // console.log("[dnd:slot]", { item, list, orgItem, orgList }, offset, { itemVueIns, itemEl })
                    orgItem = list.insertPromptOf(item, orgItem, offset)

                    orgItem.data.word.subType = item.data.word.subType
                    orgItem.data.word.lv = item.data.word.lv
                    itemVueIns.$emit("update")
                }
            } else if (dropEl.classList.contains("PromptList-list")) {
                let itemEl = findParentElement(dropEl, (el) => el.classList.contains("PromptList"))
                console.log("[dnd:itemEl]", { dropEl, itemEl })
                if (itemEl) {
                    let itemVueIns = (<any>itemEl).__vue__
                    let list = itemVueIns.list
                    let orgItem = vueIns.item
                    let orgList = vueIns.list
                    console.log("[dnd:slot]", { list, orgItem, orgList }, { itemVueIns, itemEl })
                    orgList?.removePrompt(orgItem)
                    orgItem = list.insertPromptLast(orgItem)

                    orgItem.data.word.subType = list.data.type
                    itemVueIns.$emit("update")
                }
            }

            dndEnd()
        },
    })

    function dndStart() {
        document.body.classList.toggle("dnd-ing", true)
        isStart = true
        ghost = <HTMLElement>el.cloneNode(true)
        ghost.classList.toggle("dnd-ghost")
        document.body.appendChild(ghost)
        el.classList.toggle("dnd-org", true)
    }
    function dndEnd() {
        ghost?.remove()
        ghost = null
        isStart = false
        el.classList.toggle("dnd-org", false)
        document.body.classList.toggle("dnd-ing", false)
    }
}
