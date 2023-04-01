import express from "express"
import cors from "cors"
import { translate } from "@vitalets/google-translate-api"

import createHttpProxyAgent from "http-proxy-agent"

const app = express()
app.use(express.json())
app.use(cors())
// 访问 Google 翻译
const agent = createHttpProxyAgent("http://127.0.0.1:1886")

app.get("/ping", (req, res) => {
    const data = {
        message: "Hello, world!",
        date: new Date(),
    }
    res.send(data)
})
app.post("/t", async (req, res) => {
    let input = req.body
    console.log("t", { input })
    try {
        const { text } = await translate(input.text, { to: input.to ?? "zh-cn", fetchOptions: { agent } })

        res.send(text)
    } catch (e) {
        console.error(e)
    }
    res.send()
})

const port = process.env.PORT || 19213
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
