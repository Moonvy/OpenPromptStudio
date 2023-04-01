import { Client } from "@notionhq/client"
import secret from "../../../secret.json" assert { type: "json" }
import fs from "fs"

const notion = new Client({
    auth: secret.notion,
})

// database https://www.notion.so/moonvy/5ac19c115d11488f95847c9e2d789dff?v=5ce9b783b4504c23bb7b492aa70c1cfc
let database_id = `5ac19c115d11488f95847c9e2d789dff`
const __dirname = new URL(".", import.meta.url).pathname

// let items = await fromNotion()

export async function fromNotion() {
    let lines = {}
    const subTypeMap = {
        普通: "normal",
        风格: "style",
        质量: "quality",
        命令: "command",
        负面: "eg",
    }

    console.log("[notion] get notion database :https://www.notion.so/moonvy/5ac19c115d11488f95847c9e2d789dff")
    let i = 0
    await once()
    async function once(start_cursor) {
        let re = await notion.databases.query({ database_id, start_cursor })
        console.log(`[notion] get page${i} :${start_cursor ?? "init"}`)
        re.results.forEach((page) => {
            let text = page.properties.text.title?.[0]?.text?.content
            let desc = page.properties.desc.rich_text?.[0]?.text?.content
            let lang_zh = page.properties["lang_zh"].rich_text?.[0]?.text?.content
            let tags = page.properties.tags?.multi_select?.map((x) => x.name)
            let subType = page.properties.subType?.select?.name
            let dir = page.properties.dir?.select?.name
            subType = subTypeMap[subType] ?? "normal"
            let item = { text, desc, lang_zh, subType, dir, tags }
            if (!text) return
            // console.log("item",item)
            lines[item.text.toLowerCase()] = item
        })

        if (re.has_more) {
            await once(re.next_cursor)
        }
    }

    console.log(`[notion] import ${Object.keys(lines).length} items.`)
    fs.writeFileSync(`${__dirname}notionPromptDescMap.json`, JSON.stringify(lines, null, 2))
    return lines
}
