import axios from "axios"


(<any>window)._translate = translate

let cache: any = {}

export async function translate(
    testList: string[],
    options: { server: string } = { server: "http://localhost:19212/prompt-studio/translate" }
) {
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

    let rawText = reqList.map((req) => req[0]).join("\n")
    let re = await axios.post(`${options.server}`, { text: rawText, to: "zh-cn" })

    if (re && re.data) {
        let list = re.data.split("\n")
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
}
translate.cache = cache


