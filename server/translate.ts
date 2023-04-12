// Created on 2023/04/12 - 11:40
import { tencentTranslate } from "./tencentTranslate"

export async function translate(input: {
    text: string
    from?: string
    to?: string
    server?: string
}): Promise<string | undefined> {
    if (input.text == "") return ""
    let re
    if (input?.server === "google") {
        // todo
    } else if (input?.server === "tencent") {
        re = await tencentTranslate({ text: input.text, from: input?.from, to: input?.to })
        console.log("[translate]", input.text.length + "words.", { input, re })
    }
    return re
}
