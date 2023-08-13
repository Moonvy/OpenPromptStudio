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
    sheetNameList = Object.keys(subTypeMap),
    mapDict = {};

sheetNameList.forEach((sheetName) => {
    let ws = workbook.Sheets[sheetName],
        lenth = XLSX.utils.decode_range(ws["!ref"]).e.r;                  //How much lines of this sheet
    Array.from(Array(lenth), (_, i) => i + 2).forEach((id) => {
        let prompt = { text: ws[`A${id}`].v };                            //text
        ws[`B${id}`] && (prompt.lang_zh = ws[`B${id}`].v);                //lang_zh
        prompt.subType = subTypeMap[sheetName];                           //subType
        ws[`E${id}`] && (prompt.desc = ws[`E${id}`].v);                   //desc
        ws[`D${id}`] && (prompt.sampleCmds = JSON.parse(ws[`D${id}`].v)); //sampleCmds
        prompt.dir = `${sheetName}/${ws[`C${id}`].v}`;                    //dir
        mapDict[ws[`A${id}`].v] = prompt;
    });
});

const jsonText = JSON.stringify(mapDict, null, 1)
fs.writeFileSync(__dirname + "/localPromptDefineMap.json", jsonText)
fs.writeFileSync(__dirname + "/../web/public/localPromptDefineMap.json", jsonText)