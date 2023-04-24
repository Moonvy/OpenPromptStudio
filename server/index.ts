// @ts-ignore
import express from "express"
// @ts-ignore
import cors from "cors"
import * as dotenv from "dotenv"
import { translate } from "./translate"
dotenv.config()
const app = express()

app.use(express.json())
app.use(cors())

app.post("/prompt-studio/translate/prompts", async (req: any, res: any) => {
    let input: { words: string[]; to: string } = req.body
    let orgText = input.words.join("\n")
    const finText = await translate({ text: orgText, to: input.to ?? "zh-cn", server: "tencent" })

    if (finText) {
        let words = finText.split("\n")
        res.json(words)
    } else {
        res.json([])
    }
})

const port = process.env.TRANSLATE_PORT || 19212
const host = process.env.EXTERNAL_HOST || "localhost"

app.listen({port: port, host: host}, () => {
    console.log(`Server started on port ${port} EXTERNAL_HOST ${process.env.EXTERNAL_HOST}`)
})
