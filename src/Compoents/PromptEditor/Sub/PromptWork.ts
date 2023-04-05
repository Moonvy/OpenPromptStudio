import { PromptList } from "./PromptList"
import { uuid } from "fzz"
import { IPromptWord, parsePrompts } from "../Lib/parsePrompts/parsePrompts"
import { SubTypeDisplayMap } from "../../../Lang/tempLang"
import { chinesePercentage } from "../Lib/chinesePercentage"
import { PromptItem } from "./PromptItem"
import { translatePrompts } from "../Lib/translatePrompts"

export interface IPromptWorkData {
    name: string
    id: string
    initText?: string
}

interface IPromptGroup {
    id: string
    name?: string
    groupLv?: number
    lists: PromptList[]
}

export class PromptWork {
    data!: IPromptWorkData
    state!: {}
    groups: IPromptGroup[] = []

    get id() {
        return this.data.id
    }
    constructor(data?: Partial<IPromptWorkData>) {
        this.data = Object.assign(
            {
                id: uuid.v4(),
                name: "untitled",
            },
            data
        )
    }

    /** 导入提示词 */
    async importPrompts(text: string, options: { parser: "midjourney" | "stable-diffusion" }) {
        let { words } = await parsePrompts(text, { zh2en: true, ...options })
        // 分组
        let groupList: { [group: string]: IPromptWord[] } = {}
        let noGroup: IPromptWord[] = []
        words.forEach((word) => {
            if (word.group) {
                if (!groupList[word.group]) groupList[word.group] = []
                groupList[word.group].push(word)
            } else {
                noGroup.push(word)
            }
        })
        // 分组
        let finGroups = []
        for (let key in groupList) {
            let wordList = groupList[key]
            let listMap = createListMap(wordList)
            let lv = wordList[0]?.lv
            finGroups.push({
                id: `group-${key}`,
                groupLv: Number.parseFloat(<any>lv),
                lists: sortPromptMap(listMap),
            })
        }
        // 未分组
        if (noGroup.length > 0) {
            finGroups.push({
                id: `group-noGoutp`,
                lists: sortPromptMap(createListMap(noGroup)),
            })
        }

        this.groups = finGroups

        // 翻译
        this.translate()

        function createListMap(words: IPromptWord[]) {
            let subTypeMap: { [subType: string]: IPromptWord[] } = {}
            words.forEach((word) => {
                let subType = word.subType ?? "normal"
                if (word.isEg) subType = "eg"
                if (subType in subTypeMap) {
                    subTypeMap[subType].push(word)
                } else {
                    subTypeMap[subType] = [word]
                }
            })
            let listMap = <any>{}
            for (let subType in subTypeMap) {
                listMap[subType] = new PromptList({
                    id: subType,
                    type: subType,
                    name: SubTypeDisplayMap[subType] ?? subType,
                    index: ListSortMap[subType] ?? 0,
                })
                listMap[subType].applyWords(subTypeMap[subType])
            }
            return listMap
        }
    }
    /** 导出提示词 */
    exportPrompts() {
        let finText = ""
        let commands: string[] = []
        let i = 0,
            len = this.groups.length
        for (let group of this.groups) {
            let chars: string[] = []
            for (let list of group.lists) {
                for (let item of list.items) {
                    if (item.data.disabled) continue
                    if (item.data.word.subType === "command") {
                        commands.push(item.data.word.rawText!)
                    } else {
                        chars.push(item.data.word.rawText!)
                    }
                }
            }
            finText += chars.join(", ")
            if (len > 0) {
                if (i < len - 1) {
                    finText += ` ::${group.groupLv == 1 ? "" : group.groupLv} `
                } else {
                    if (group.groupLv && group.groupLv != 1) {
                        finText += ` ::${group.groupLv} `
                    }
                }
            }
            i++
        }
        if (commands.length > 0) finText += ` ${commands.join(", ")}`

        // console.log("exportPrompts")
        return finText.trim()
    }
    /** 翻译全部提示词 */
    async translate() {
        let needTranslateItems: PromptItem[] = []
        for (let group of this.groups) {
            for (let list of group.lists) {
                if (list.data.type !== "normal") continue
                for (let item of list.items) {
                    if (item.data.word.langText) continue
                    let cp = chinesePercentage(item.data.word.text)
                    // 中文含量低，需要翻译
                    if (cp < 5) needTranslateItems.push(item)
                }
            }
        }
        let rawTexts = needTranslateItems.map((item) => item.data.word.text)
        let re = await translatePrompts(rawTexts)
        if (re) {
            re.forEach((langText, i) => {
                needTranslateItems[i].data.word.langText = langText
            })
        }
    }

    /** 禁用全部提示词 */
    disableAll() {
        let isAllDisabled = true
        this.groups.forEach((group) => {
            group.lists.forEach((list) =>
                list.items.forEach((item) => {
                    if (!item.data.disabled) {
                        isAllDisabled = false
                    }
                })
            )
        })

        this.groups.forEach((group) => {
            group.lists.forEach((list) =>
                list.items.forEach((item) => (item.data.disabled = isAllDisabled ? false : true))
            )
        })
    }
}
const ListSortMap: any = {
    normal: 6,
    style: 7,
    quality: 8,
    command: 9,
    eg: 10,
}

function sortPromptMap(listMap: { [key: string]: PromptList }) {
    return Object.values(listMap).sort((a, b) => {
        return (a.data.index ?? 0) - (b.data.index ?? 0)
    })
}
