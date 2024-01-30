import { Client } from "@notionhq/client"
import { cloneDeep } from "lodash"

export async function fetchFromNotion(options: { apiKey: string; databaseId: string }) {
    let { databaseId: database_id, apiKey } = options

    let defineMap: any = {}
    const subTypeMap: any = {
        普通: "normal",
        风格: "style",
        质量: "quality",
        命令: "command",
        负面: "eg",
    }

    const notion = new Client({
        auth: apiKey,
        baseUrl: `https://worker-cors.yarna-moonvy.workers.dev/https://api.notion.com`,
    })

    let i = 0
    await once()
    async function once(start_cursor?: string) {
        let re = await notion.databases.query({ database_id, start_cursor })
        console.log(`[notion] get page${i} :${start_cursor ?? "init"}`, { re })
        re.results.forEach((page: any, index) => {
            // console.log(`[notion] page${index}`, { page })
            let text = page.properties?.text?.title?.[0]?.text?.content
            let desc = page.properties?.desc?.rich_text?.[0]?.text?.content
            let lang_zh = page.properties?.["lang_zh"].rich_text?.[0]?.text?.content
            let tags = page.properties?.tags?.multi_select?.map((x: any) => x.name)
            let subType = page.properties?.subType?.select?.name
            let dir = page.properties?.dir?.select?.name
            let alias = page.properties?.alias?.rich_text?.[0]?.text?.content
            subType = subTypeMap[subType] ?? "normal"
            let item = { text, desc, lang_zh, subType, dir, tags, alias }
            if (!text) return
            defineMap[item?.text?.toLowerCase()] = item
            if (typeof alias === "string") {
                alias.split(/[,，]/).forEach((text) => {
                    text = text.trim()
                    if (text != "") {
                        let cloneItem = cloneDeep(item)
                        cloneItem.text = text
                        ;(cloneItem as any).isAlias = true
                        defineMap[text.toLowerCase()] = cloneItem
                    }
                })
            }
        })
        if (re.has_more) {
            await once(re.next_cursor!)
        }
    }
    console.log(`[notion] import ${Object.keys(defineMap).length} items.`)

    let databaseInfo: any = await notion.databases.retrieve({ database_id })
    let me = {
        name: databaseInfo?.title?.[0]?.text?.content,
        url: databaseInfo?.url,
    }
    return { defineMap, me }
}
