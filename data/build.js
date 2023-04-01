import csv from "csvtojson"
import fs from "fs"
import { fromNotion } from "./src/notion/fromNotion.js"
import localCommandDesc from "./src/localCommandDesc.js"

const __dirname = new URL(".", import.meta.url).pathname

let localPromptDefineMap = {}

// Add notion database https://www.notion.so/moonvy/5ac19c115d11488f95847c9e2d789dff?v=5ce9b783b4504c23bb7b492aa70c1cfc
let notionPromptDescMap = await fromNotion()
Object.assign(localPromptDefineMap, notionPromptDescMap)

// Add src/dict/*.csv
let pathLang = `${__dirname}src/dict`
for (let file of fs.readdirSync(pathLang, { withFileTypes: true })) {
    if (file.isFile() && file.name.toLowerCase().endsWith(".csv")) {
        let re = await csv().fromFile(`${pathLang}/${file.name}`)
        re.forEach((item) => addToMap(item))
        console.log(`Add src/dict/${file.name}`)
    }
}
console.log(`Add src/dict/*.csv`)

// src/localCommandDesc.js
localCommandDesc().forEach((item) => addToMap(item))
console.log(`Add src/localCommandDesc.js`)

// ------------------------------------

Object.values(localPromptDefineMap).forEach((item) => {
    if (item?.tags?.length == 0) delete item.tags
})

let jsonText = JSON.stringify(localPromptDefineMap, null, 1)
fs.writeFileSync(__dirname + "localPromptDefineMap.json", jsonText)
fs.writeFileSync(__dirname + "../web/public/localPromptDefineMap.json", jsonText)

let finSize = fs.statSync(__dirname + "/localPromptDefineMap.json").size
let itemsLength = Object.keys(localPromptDefineMap).length

console.log(`[generated] localPromptDescMap.json ( ${itemsLength} items | ${(finSize / 1024).toFixed(1)}KB )`)

// --------------------------

function addToMap(item) {
    const subTypeMap = {
        普通: "normal",
        风格: "style",
        质量: "quality",
        命令: "command",
        负面: "eg",
    }
    // console.log("item", item)
    let key = item.text.toLowerCase()
    if (item.subType && subTypeMap[item.subType]) {
        item.subType = subTypeMap[item.subType]
    }

    if (localPromptDefineMap[key]) {
        Object.assign(localPromptDefineMap[key], item)
    } else {
        localPromptDefineMap[key] = item
    }
}
