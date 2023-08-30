import { PromptItem } from "../PromptEditor/Sub/PromptItem"

import { useDatabaseServer } from "../PromptEditor/Lib/DatabaseServer/DatabaseServer"

export async function getDictData(onlyMyNotion?: boolean): Promise<IDictDir[]> {
    let database = useDatabaseServer()
    let define = await database.getPromptsDefine({ onlyMyNotion })

    let dirMap: any = {}
    for (let key in define) {
        let item = define[key]
        let dirPath = item.dir
        if (item.isAlias) continue
        if (dirPath) {
            let newWords
            if (item.subType == "command") {
                let sampleCmds = item.sampleCmds ?? [""]
                newWords = sampleCmds.map((cmd) => ({
                    text: item.text,
                    langText: `${item.lang_zh}`,
                    subType: item.subType,
                    rawText: `${item.text} ${cmd}`,
                    desc: item.desc,
                    args: [cmd],
                }))
            } else {
                newWords = [
                    {
                        text: item.text,
                        langText: item.lang_zh,
                        subType: item.subType,
                        desc: item.desc,
                    },
                ]
            }

            let dirNames = dirPath.split("/")
            let [dirName, subDirName] = dirNames
            if (!dirMap[dirName]) {
                dirMap[dirName] = {
                    name: dirName,
                    children: [],
                    words: [],
                }
            }
            if (subDirName) {
                let subDir = dirMap[dirName].children.find((subDir: any) => subDir.name === subDirName)
                if (!subDir) {
                    subDir = {
                        name: subDirName,
                        children: [],
                        words: [],
                    }
                    dirMap[dirName].children.push(subDir)
                }
                subDir.words.push(...newWords)
            } else {
                dirMap[dirName].words.push(...newWords)
            }
        }
    }

    let dictDirs = Object.values(dirMap)

    dictDirs.forEach((dir: any) => {
        dir.words = lists(dir.words)
        dir.children.forEach((subDir: any) => {
            subDir.words = lists(subDir.words)
        })
    })

    function lists(words: any[]) {
        return words.map((word) => {
            let item = PromptItem.fromWord(<any>word)
            item.state.isDict = true
            return item
        })
    }

    return <any>dictDirs
}

export interface IDictDir {
    name: string
    children: IDictDir[]
    words: string[]
}

export interface IWordDesc {
    text: string
    lang_zh: string
    subType?: string
    tags?: string[]
}
