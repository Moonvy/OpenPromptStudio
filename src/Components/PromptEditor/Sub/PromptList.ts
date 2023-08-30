import { PromptItem } from "./PromptItem"
import { remove } from "lodash"
import { IPromptWord } from "../Lib/parsePrompts/parsePrompts"

export interface IPromptListData {
    id: string
    type?: string
    index?: number
    name?: string
    desc?: string
}

export class PromptList {
    data!: IPromptListData
    state!: {}
    items: PromptItem[] = []
    constructor(data: IPromptListData) {
        if (data) this.data = data
    }
    applyWords(words: IPromptWord[]) {
        this.items = words.map((word) => PromptItem.fromWord(word))
    }
    /** 添加提示词 */
    pushPrompt(text: string, data?: { lv?: number; group?: string; subType?: string }) {
        let item = PromptItem.createEmpty({ text, ...data })
        this.items.push(item)
        return item
    }
    /** 删除一个提示词 */
    removePrompt(item: PromptItem) {
        this.items = this.items.filter((x) => x !== item)
    }
    /** 插入一个提示词到某个原有词的位置  */
    insertPromptOf(targetItem: PromptItem, newItem: PromptItem, offset: number = 0) {
        if (newItem.state.isDict) {
            newItem = PromptItem.fromWord({ ...newItem.data.word })
        }

        let targetIndex = this.items.indexOf(targetItem)
        let newIndex = targetIndex + offset
        this.items.splice(newIndex, 0, newItem)
        this.items = this.items.slice()
        return newItem
    }
    insertPromptLast(newItem: PromptItem) {
        if (newItem.state.isDict) {
            newItem = PromptItem.fromWord({ ...newItem.data.word })
        }

        this.items = [...this.items, newItem]

        return newItem
    }
}
