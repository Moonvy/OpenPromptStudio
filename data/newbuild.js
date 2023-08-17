import XLSX from "xlsx-js-style"
import fs from "fs"
import url from 'url'
import path from 'path'

//Compatible with Windows, don't use URL().pathname for a file path
const __dirname = path.dirname(url.fileURLToPath (import.meta.url))

let workbook = XLSX.readFile(`${__dirname}/prompt.xlsx`, { type: "binary" }),
    subTypeMap = {
        普通: "normal",
        风格: "style",
        质量: "quality",
        命令: "command",
        负面: "eg"
    },
    sheetNameList = workbook.SheetNames,
    mapDict = {};

sheetNameList.forEach((sheetName) => {
    let subTypeName = sheetName.replace(/[-\.].*/, ""),
        subType = subTypeMap[subTypeName];
    if (!subType) {
        console.log(`找不至 "${sheetName}" 对应的 subType，跳过。`)
        return; //如果sheet不是以subType名字开头的话，就跳过
    }
    console.log(`${sheetName}" 对应 ${subType} 类型，处理开始。`)
    let ws = workbook.Sheets[sheetName],
        lenth = XLSX.utils.decode_range(ws["!ref"]).e.r;                    //How much lines of this sheet
    Array.from(Array(lenth), (_, i) => i + 2).forEach((id) => {
        let prompt = { text: ws[`A${id}`].v };                              //text
        ws[`B${id}`] && (prompt.lang_zh = ws[`B${id}`].v);                  //lang_zh
        prompt.subType = subType;                                           //subType
        ws[`E${id}`] && (prompt.desc = ws[`E${id}`].v);                     //desc
        ws[`D${id}`] && (prompt.sampleCmds = JSON.parse(ws[`D${id}`].v));   //sampleCmds
        prompt.dir = `${subTypeName}/${ws[`C${id}`].v}`;                    //dir
        mapDict[ws[`A${id}`].v] = prompt;
    });
});

const jsonText = JSON.stringify(mapDict, null, 1)
fs.writeFileSync(__dirname + "/localPromptDefineMap.json", jsonText)
fs.writeFileSync(__dirname + "/../web/public/localPromptDefineMap.json", jsonText)