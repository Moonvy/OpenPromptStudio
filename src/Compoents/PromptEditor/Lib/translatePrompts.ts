import axios from "axios"
import { chinesePercentage } from "./chinesePercentage"
;(<any>window)._translatePrompts = translatePrompts

let cache: any = {}
export async function translatePrompts(testList: string[], options?: { server?: string; to?: string }) {
    try {
        let resultList: string[][] = []
        let reqList: [string, number][] = []

        testList.forEach((text, i) => {
            if (cache[text]) {
                let t = cache[text]
                resultList.push([text, t])
            } else {
                resultList.push([text])
                reqList.push([text, i])
            }
        })

        let host = (<any>globalThis).__OPS_SERVER
        let orgWords = reqList.map((req) => req[0])
        if (orgWords.length == 0) return  resultList.map((x) => x[1])
        let re = await axios.post(`${options?.server ?? `${host}/translate/prompts`}`, {
            words: orgWords,
            to: options?.to ?? "zh",
        })

        if (re && re.data) {
            let list = re.data
            list.forEach((text: string, i: number) => {
                if (reqList[i]) {
                    let raw = reqList[i][0]
                    let index = reqList[i][1]
                    resultList[index].push(text)
                    cache[raw] = text
                }
            })
            return resultList.map((x) => x[1])
        }
    } catch (e) {
        console.error(e)
    }
}

export async function translateZh2En(texts: string[]) {
    let finTexts = texts.slice()
    let zhWords: [string, number][] = []
    texts.forEach((text, i) => {
        if (chinesePercentage(text)) {
            zhWords.push([text, i])
        }
    })
    let prompts = zhWords.map((x) => {
        return x[0]
    })
    let re = await translatePrompts(prompts, { to: "en" })
    // console.log("[translateZh2En]", prompts, "=>", re)
    if (re) {
        re.forEach((en, i) => {
            let orgIndex = zhWords[i][1]
            finTexts[orgIndex] = en
        })
    }
    return finTexts
}
