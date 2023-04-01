import { IPromptWord, PromptWordType } from "../Lib/parsePrompts/parsePrompts"
import { useDatabaseServer } from "../Lib/DatabaseServer/DatabaseServer"
import { chinesePercentage } from "../Lib/chinesePercentage"
import { translatePrompts } from "../Lib/translatePrompts"

export interface IPromptItemData {
    word: IPromptWord
    // 被禁用的
    disabled?: boolean
}

export class PromptItem {
    static fromWord(word: IPromptWord) {
        return new PromptItem({
            word: Object.assign(emptyWord(), word),
        })
    }
    static createEmpty(data: { text?: string; group?: string; subType?: string }) {
        return new PromptItem({
            word: <any>{
                ...emptyWord(),
                id: `${data.text},${Date.now()}`,
                text: data.text ?? "",
                rawText: data.text ?? "",
                type: PromptWordType.Word,
                group: data.group,
                subType: data.subType,
                desc: "",
                args: [],
                lv: 1,
                isEg: false,
            },
        })
    }

    data!: IPromptItemData
    state = {
        isEdit: <false | "text" | "lang">false,
        isDict: false,
    }
    constructor(data?: IPromptItemData) {
        this.data = Object.assign({ disabled: false }, data)
    }

    /** 更新内容（检查分类、翻译） */
    async updateContent(text: string) {
        let dataserver = useDatabaseServer()
        let rawText = text
        // 命令
        let isCommand
        if (text.startsWith("--") || text.startsWith("—")) {
            text = text.split(" ")[0]
            isCommand = true
        }

        // 重置旧数据
        this.data.word.desc = undefined
        this.data.word.langText = undefined
        this.data.word.rawText = ""

        // 「中翻英」中文翻译成英文
        let cp = chinesePercentage(text)
        let isZhToEn
        if (!isCommand && cp > 50) {
            let re = await translatePrompts([text], { to: "en" })
            if (re?.[0]) {
                isZhToEn = true
                this.data.word.langText = text
                text = re[0]
                rawText = text
            }
        }

        this.data.word.text = text
        this.data.word.rawText = rawText

        let pDesc = (await dataserver.queryPromptsDefine([text]))?.[0]

        if (pDesc) {
            if (pDesc["lang_zh"]) this.data.word.langText = pDesc["lang_zh"]
            if (pDesc.desc) this.data.word.desc = pDesc.desc
            if (pDesc.subType) this.data.word.subType = pDesc.subType
        }

        console.log("[updateContent]", this.data.word.langText, cp)
        // 如果且没有进行中翻英，且文本是英文而且没有译文，进行「英翻中」
        if (!isZhToEn && !isCommand && !this.data.word.langText && cp < 5) {
            let re = await translatePrompts([text])
            if (re && re[0]) {
                this.data.word.langText = re[0]
            }
        }
    }
}

function emptyWord() {
    return {
        id: null,
        text: null,
        rawText: null,
        langText: null,
        type: PromptWordType.Word,
        group: null,
        subType: null,
        desc: null,
        args: [],
        lv: null,
        isEg: null,
    }
}
