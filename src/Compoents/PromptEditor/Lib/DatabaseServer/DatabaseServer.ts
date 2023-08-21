import { fetchFromNotion } from "./lib/fetchFromNotion"
import XLSX from "xlsx-js-style"

export interface IPromptDefineItem {
    text: string
    subType?: string
    desc?: string
    dir?: string
    lang_zh?: string
    sampleCmds?: string[]
    isAlias?: boolean
    tags?: string[]
}

export class DatabaseServer {
    localPromptDefineMap: { [key: string]: IPromptDefineItem } = {}
    notionPromptDefineMap: { [key: string]: IPromptDefineItem } = {}
    isReady: null | Promise<boolean> = null
    constructor() {}
    async ready() {
        if (this.isReady != null) return this.isReady
        this.isReady = this.init()
        return this.isReady
    }
    async init() {
        let buffer = await (await fetch("./prompt.xlsx")).arrayBuffer()
        let workbook = XLSX.read(new Uint8Array(buffer), { type: "array" }),
            subTypeMap:any = {
                角色: "character",
                风格: "style",
                质量: "quality",
                命令: "command",
                负面: "eg",
            },
            sheetNameList = workbook.SheetNames,
            mapDict:any = {}

        sheetNameList.forEach((sheetName) => {
            let subTypeName = sheetName.replace(/[-\.].*/, ""),
            subType = subTypeMap[subTypeName];
            if (!subType) {
                console.log(`遇到无对应 subType 的 Sheet: "${sheetName}", 跳过`)
                return; //如果sheet不是以subType名字开头的话，就跳过
            }
            console.log(`已经读入 ${sheetName}" 对应 ${subType} 类型`)
            let ws:any = workbook.Sheets[sheetName],
                lenth = XLSX.utils.decode_range(ws["!ref"]).e.r                          //How much lines of this sheet
            Array.from(Array(lenth), (_, i) => i + 2).forEach((id) => {
                if (ws[`A${id}`]) {
                    let prompt:any = { text: ws[`A${id}`].v, dir: `${subTypeName}/未知` } //text
                    ws[`B${id}`] && (prompt.lang_zh = ws[`B${id}`].v)                    //lang_zh
                    prompt.subType = subType                                             //subType
                    ws[`E${id}`] && (prompt.desc = ws[`E${id}`].v)                       //desc
                    ws[`D${id}`] && (prompt.sampleCmds = JSON.parse(ws[`D${id}`].v))     //sampleCmds
                    ws[`C${id}`] && (prompt.dir = `${subTypeName}/${ws[`C${id}`].v}`)    //dir
                    mapDict[ws[`A${id}`].v] = prompt
                }
            })
        })

        this.localPromptDefineMap = mapDict
        return true
    }
    async queryPromptsDefine(prompts: string[]): Promise<IPromptDefineItem[]> {
        await this.ready()
        let reuslt = []
        for (let prompt of prompts) {
            let re = this.localPromptDefineMap[prompt?.toLowerCase()]
            if (re) {
                reuslt.push(re)
            } else {
                reuslt.push(null)
            }
        }
        return <any>reuslt
    }

    async getPromptsDefine(options?: { onlyMyNotion?: boolean }) {
        await this.ready()
        if (options?.onlyMyNotion) {
            return this.notionPromptDefineMap
        } else {
            return this.localPromptDefineMap
        }
    }

    async fetchNotion(options: { apiKey: string; databaseId: string }) {
        console.log("fetchNotion options", options)
        let { defineMap, me } = await fetchFromNotion(options)
        this.notionPromptDefineMap = defineMap
        Object.assign(this.localPromptDefineMap, defineMap)
        return { defineMap, me }
    }
}

let databaseServer: DatabaseServer
export function useDatabaseServer() {
    if (!databaseServer) databaseServer = new DatabaseServer()
    return databaseServer
}
