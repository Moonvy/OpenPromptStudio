import { midjourneyParse, midjourneyStringify } from "./parsers/Midjourney"
import {stableDiffusionWebUIParse, stableDiffusionWebUIStringify} from "./parsers/StableDiffusionWebUI"
import { useDatabaseServer } from "../DatabaseServer/DatabaseServer"
import { IPromptGroup } from "../../Sub/PromptWork"

export interface IPromptWord {
    id: string
    text: string
    rawText: string
    type: PromptWordType
    group?: string
    langText?: string
    subType?: string
    desc?: string
    link?: string
    args?: string[]
    dir?: string
    lv?: number
    alv?: number
    isEg?: boolean
}
export enum PromptWordType {
    Word = "word",
}
export interface IPromptParseResult {
    words: IPromptWord[]
}

export async function parsePrompts(
    text: string,
    options: { parser: string; minify?: boolean; zh2en?: boolean } = {
        parser: "midjourney",
    }
): Promise<IPromptParseResult> {
    let words: IPromptWord[]
    if (options.parser === "midjourney") {
        words = await midjourneyParse(text, options)
    } else if (options.parser === "stable-diffusion-webui") {
        words = await stableDiffusionWebUIParse(text, options)
    } else {
        throw new Error(`err ParsePrompts not support this parser:${options.parser}`)
    }
    if (options.minify) {
        words = wordsDeduplicat(words)
    }

    let dataserver = useDatabaseServer()
    let promptsDefine = await dataserver.queryPromptsDefine(words.map((w) => w.text))
    let localLang = "zh-cn" // todo: 根据环境和设置选择语言
    let langKey = `lang_${localLang}`

    let result = <IPromptParseResult>{ words: [], egWords: [] }

    let indexMap: { [id: string]: number } = {}
    words.forEach((word, i) => {
        if (indexMap[word.rawText] !== undefined) {
            indexMap[word.rawText] = indexMap[word.rawText] + 1
        } else {
            indexMap[word.rawText] = 0
        }
        word.id = word.rawText + "__" + indexMap[word.rawText]

        let define = promptsDefine[i]
        if (define) {
            if (define.lang_zh) word.langText = define.lang_zh
            if (define.subType) word.subType = define.subType
            if (define.desc) word.desc = define.desc
            if (define.dir) word.dir = define.dir
        }
        result.words.push(word)
    })
    // console.log("parsePrompts words", JSON.stringify(result, null, 2))
    return result
}

export function stringifyPrompts(groups: IPromptGroup[] = [], options: { parser: string }) {
    let prompts: string
    if (options.parser === "midjourney") {
        prompts = midjourneyStringify(groups)
    } else if (options.parser === "stable-diffusion-webui") {
        prompts = stableDiffusionWebUIStringify(groups)
    } else {
        throw new Error(`err ParsePrompts not support this parser:${options.parser}`)
    }
    return prompts
}

function wordsDeduplicat(words: IPromptWord[]): IPromptWord[] {
    let map: any = {}
    words.forEach((word) => (map[word.rawText] = word))
    return Object.values(map)
}
