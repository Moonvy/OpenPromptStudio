import { IPromptWord, PromptWordType } from "../../parsePrompts"
import { translateZh2En } from "../../../translatePrompts"
import { IPromptGroup } from "../../../../Sub/PromptWork"

export async function midjourneyParse(text: string, options?: { zh2en?: boolean }): Promise<IPromptWord[]> {
    let re = paresCommands(text)
    text = re.text

    // 按权重划分权重
    let textListByWeight = text.split("::")
    let words: IPromptWord[] = []

    for (let i = 0; i < textListByWeight.length; i++) {
        let groupIndex = i
        let text = textListByWeight[i]

        let lv = 1
        let nextText = textListByWeight[groupIndex + 1]
        if (nextText) {
            const REG_Weight = /^[\.\-0-9]+/
            let weightText = REG_Weight.exec(nextText)?.[0]
            if (weightText) {
                textListByWeight[groupIndex + 1] = nextText.slice(weightText.length)
                lv = Number.parseFloat(weightText)
            }
        }

        let texts = split(text).filter((text) => text != "")

        if (options?.zh2en) texts = await translateZh2En(texts)

        texts.forEach((text, i) => {
            let word = { text, type: PromptWordType.Word, rawText: text, group: `${groupIndex}::${lv}`, lv }
            words.push(<IPromptWord>word)
        })
    }

    let lastGroup = words[words.length - 1]?.group

    re.commands.forEach((command) => {
        words.push({
            id: command.command,
            text: command.command,
            rawText: command.rawText,
            type: PromptWordType.Word,
            subType: "command",
            group: lastGroup,
            args: command.args,
        })
    })
    // console.log("midjourneyParse words", JSON.stringify(words))
    return words
}

export function midjourneyStringify(groups: IPromptGroup[] = []) {
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
    if (commands.length > 0) finText += ` ${commands.join(" ")}`

    // console.log("exportPrompts")
    return finText.trim()
}

function split(text: string) {
    // 使用正则表达式匹配被大括号包含的内容以及其他以符号分隔的内容
    const REG_SPLIT = /{[^}]*}|[^{,，|\[\]\(\)\n]+/g;
    let matches = text.match(REG_SPLIT) || [];
    return matches.map(word => word.trim());
}

/** 解析命令 */
function paresCommands(text: string) {
    // 匹配带一个参数的命令
    const REG_COMMAND_ARG =
        /(--|—)(version|v|aspect|ar|quality|q|chaos|c|seed|sameseed|stop|style|stylize|s|no|niji|repeat|iw|width|w|height|h+) ([\w\.:]+)/g
    // 匹配任意无命令
    const REG_ALL = /(--|—)([a-zA-Z0-9]+)/g

    let commands: { command: string; args: string[]; rawText: string }[] = []

    text = text.replace(REG_COMMAND_ARG, (substring: string, ...args: any[]) => {
        commands.push({ command: args[0] + args[1], args: [args[2]], rawText: substring })
        return ""
    })
    text = text.replace(REG_ALL, (substring: string, ...args: any[]) => {
        commands.push({ command: args[0] + args[1], args: [], rawText: substring })
        return ""
    })
    return { text, commands }
}
