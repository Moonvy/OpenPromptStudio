import { IPromptWord, PromptWordType } from "../../ParsePrompts"
import { translateZh2En } from "../../../translatePrompts"

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
            const REG_Weight = /^[0-9]+/
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

function split(text: string) {
    return text.split(/[,，|{}\[\]\(\)\n]/).map((word) => word.trim())
}

/** 解析命令 */
function paresCommands(text: string) {
    // 匹配带一个参数的命令
    const REG_COMMAND_ARG =
        /(--|—)(version|v|aspect|ar|quality|q|chaos|seed|sameseed|stop|style|stylize|s|no|iw|width|w|height|h+) ([\w\.:]+)/g
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
