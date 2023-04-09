import { IPromptWord, PromptWordType } from "../../parsePrompts"
import { translateZh2En } from "../../../translatePrompts"
import { round } from "lodash"
import {IPromptGroup} from "../../../../Sub/PromptWork";
/** 解析命令 */
export async function stableDiffusionWebUIParse(text: string, options?: { zh2en?: boolean }): Promise<IPromptWord[]> {
    // 因为使用较少，暂不支持 Prompt matrix https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#prompt-matrix
    // let textListByMatrix = text.split("|")
    let words: IPromptWord[] = []

    let texts = split(text).filter((t) => t != "")

    console.log("[stableDiffusionWebUIParse]", { texts })
    if (options?.zh2en) texts = await translateZh2En(texts)

    texts.forEach((text, i) => {
        let { word } = paresWord(text)
        words.push(<IPromptWord>word)
    })

    return words
}

function split(text: string) {
    return text.split(/[,，\n]/).map((word) => word.trim())
}

/** 解析单个字符 */
function paresWord(text: string) {
    const REG_Attention_number = /^\(([^:]+?):([0-9\.]+?)\)$/ // (xxx:2)
    const REG_Attention_adds = /^(\(+)(.+?)(\)+)$/ // ((((xxx)))
    const REG_Attention_subs = /^(\[+)(.+?)(\]+)$/ // [[xxx]]
    const REG_ExtraNetworks = /^<(.+?):(.+?):(.*?)>$/ // <lora:filename:multiplier>
    const Editing_from_to_when = /^\[(.*?):(.*?):(.*?)\]$/ // [from:to:when]
    const Editing_to_when = /^\[(.*?):(.*?)\]$/ // [from:to:when]

    let lv, alv, displayText
    let word

    let re: any
    // [from:to:when] https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#prompt-editing
    if (mactch(Editing_from_to_when.test(text))) {
        displayText = text
        word = {
            text: displayText,
            type: PromptWordType.Word,
            rawText: text,
            ...Commands.Editing_from_to_when,
        }
    }
    // [from:when]
    else if (mactch(Editing_to_when.test(text))) {
        displayText = text
        word = {
            text: displayText,
            type: PromptWordType.Word,
            rawText: text,
            ...Commands.Editing_to_when,
        }
    }
    // (xxx:2)
    else if (mactch(REG_Attention_number.exec(text))) {
        displayText = re[1]
        lv = re[2]
        word = { text: displayText, lv, type: PromptWordType.Word, rawText: text }
    }
    // ((((xxx)))
    else if (mactch(REG_Attention_adds.exec(text))) {
        displayText = re[2]
        alv = re[1].length
        lv = round(Math.pow(1.1, alv), 2)
        word = { text: displayText, lv, alv, type: PromptWordType.Word, rawText: text }
    }
    // [[[xxx]]]
    else if (mactch(REG_Attention_subs.exec(text))) {
        displayText = re[2]
        alv = -re[1].length
        lv = round(1 / Math.pow(1.1, Math.abs(alv)), 2)
        word = { text: displayText, lv, alv, type: PromptWordType.Word, rawText: text }
    }
    // <lora:filename:multiplier>
    else if (mactch(REG_ExtraNetworks.exec(text))) {
        word = {
            text: text,
            type: PromptWordType.Word,
            rawText: text,
            langText: `${re[1]}`,
            subType: "command",
            link: `https://www.google.com/search?q=${encodeURIComponent(re[2])}%20 civitai.com `,
        }
    } else {
        displayText = text
        word = { text: displayText, type: PromptWordType.Word, rawText: text }
    }

    // console.log("[paresWordInfo]", word)
    return { displayText, lv, word }

    function mactch(v: any) {
        re = v
        return v
    }
}

const Commands = {
    Editing_from_to_when: {
        subType: "command",
        langText: "剪辑 (Editing) ",
        desc: `[起始词:结束词:切换时机] \n在生成采样的过程中，从一个关键词切换到另一个关键词。\n切换时机：大于 1 的整数代表指定步数，如果小于 1 的小数代表百分比时间。\n结束词: 如果为空表示切换时删除起始词`,
        link: `https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#prompt-editing`,
    },
    Editing_to_when: {
        subType: "command",
        langText: "剪辑 (Editing) ",
        desc: `[起始词:切换时机] \n在生成采样的过程中，从一个关键词切换到另一个关键词。\n切换时机：大于 1 的整数代表指定步数，如果小于 1 的小数代表百分比时间。`,
        link: `https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#prompt-editing`,
    },
}


export function stableDiffusionWebUIStringify(groups: IPromptGroup[] = []) {
    let finText = ""
    let commands: string[] = []
    let i = 0,
        len = groups.length
    for (let group of groups) {
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
        finText += chars.filter((x) => x != "").join(", ")
        finText += ` `
        i++
    }
    if (commands.length > 0) finText += ` ${commands.join(" ")}`

    // console.log("exportPrompts")
    return finText.trim()
}
