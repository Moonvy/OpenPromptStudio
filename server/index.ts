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

const port = 39011
app.listen(port, () => {
    console.log(`translate server started on port ${port}`)
})
