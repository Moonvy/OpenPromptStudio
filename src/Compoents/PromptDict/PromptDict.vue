<!-- Created on 2023/03/31 - 12:10 -->
<template>
    <div class="PromptDict">
        <div class="notion-settings">
            <button class="notion-me" @click="doGotoNotionMe">
                <Icon icon="logos:notion-icon" />
                {{ notionName ?? (loading ? "连接中..." : "连接我的 Notion") }}
            </button>

            <div class="notion-config">
                <div class="help">
                    <Icon icon="ant-design:question-circle-outlined" />
                    <a
                        target="_blank"
                        href="https://github.com/Moonvy/OpenPromptStudio#2-%E5%88%9B%E5%BB%BA%E8%87%AA%E5%B7%B1%E7%9A%84-noiton-%E9%9B%86%E6%88%90%E6%8F%92%E4%BB%B6integrations"
                        >使用方法</a
                    >
                </div>
                <div class="line checkbox">
                    <label for="enableNotion">启用我的 Notion</label>
                    <input id="enableNotion" v-model="enableMyNotion" type="checkbox" />
                </div>
                <div class="line"><label>Integration Token</label> <input v-model="apiKey" type="text" /></div>
                <div class="line"><label>Database ID </label> <input v-model="databaseId" type="text" /></div>
                <div class="line checkbox">
                    <label for="onlyMyNotion">仅使用此数据库 </label>
                    <input id="onlyMyNotion" v-model="onlyMyNotion" type="checkbox" />
                    <div class="desc">忽略默认词典</div>
                </div>
                <div class="line buttons">
                    <button
                        class="full"
                        :class="{ disabled: !notioConfigActive || loading || !enableMyNotion }"
                        @click="reloadData()"
                    >
                        {{ loading ? "载入中..." : "载入" }}
                    </button>
                </div>
            </div>
        </div>

        <div class="dir-buttons" v-if="dict">
            <button v-for="dir in dict" :class="{ active: dir == activeDir }" @click="doChangeActiveDir(dir)">
                {{ dir.name }}
            </button>
        </div>

        <div class="active-dir" v-if="activeDir">
            <div class="sub-dir" v-for="subDir in activeSubDirs">
                <div class="name" v-if="subDir.name != activeDir.name">{{ subDir.name }}</div>
                <div class="list">
                    <div class="item" v-for="word in subDir.words">
                        <PromptItem :item="word" @click="doApplyWord(word)" class="dict-word" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
.PromptDict {
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .dir-buttons {
        display: flex;
        flex-wrap: wrap;
        margin: 0 4px;
        margin-bottom: 12px;
        padding: 0;
        border-radius: 4px;
        overflow: hidden;
        height: auto;
        flex: none;
        width: max-content;
        button {
            background: #d5d7ef;
            color: #4545b2;
            border-radius: 0;
            &.active {
                background: #4545b2;
                color: #d5d7ef;
                text-shadow: 0 1px 1px rgb(49 52 88);
            }
        }
    }
    .active-dir {
        height: auto;
        overflow-y: scroll;

        .sub-dir > .name {
            padding: 12px 0;
            font-size: 14px;
            font-weight: bold;
            color: #7e7e7e;
            text-shadow: 0 1px rgba(255, 255, 255, 0.4901960784);
        }
        .list {
            display: flex;
            flex-wrap: wrap;
        }
        &::-webkit-scrollbar {
            width: 12px;
            height: 12px;
            background-color: #aaa0;
        }
        &::-webkit-scrollbar-thumb {
            background: #838383;
            border-radius: 29px;
            border: 2px solid #e9e9e9;
        }
    }

    .notion-settings {
        .notion-me {
            position: absolute;
            right: 60px;
            top: 16px;
            font-size: 13px;
            z-index: 222;
        }

        .notion-config {
            opacity: 0;
            right: 57px;
            top: 13px;
            /* padding-top: 100px; */
            width: 420px;
            height: auto;
            background: #ffffff;
            position: absolute;
            z-index: 100;
            padding: 20px;
            padding-top: 49px;
            border-radius: 4px;
            box-shadow: -2px 0 64px rgba(6, 5, 73, 0.1215686275);
            transition: all 0.2s ease;
            pointer-events: none;
            .line:not(:last-child) {
                margin-bottom: 8px;
            }
            .help {
                color: #4b4894;
                position: absolute;
                top: 12px;
                display: flex;
                place-items: center;
                .iconify {
                    margin-right: 4px;
                }
                a {
                    font-weight: bold;
                }
            }
            a {
                font-size: 13px;
                color: #4b4894;
                text-decoration: none;
                &:hover {
                    color: #4545b2;
                    text-decoration: underline;
                }
            }
            label {
                display: inline-flex;
                font-size: 13px;
                color: #5a5a5a;
                width: 140px;
                place-content: flex-end;
                white-space: nowrap;
                margin-right: 12px;
            }

            input {
                background: #e9e9e975;
                width: auto;
                flex: auto;
            }

            .full {
                width: auto;
                flex: auto;
                place-content: center;
            }

            .line {
                display: flex;
                place-items: center;
                place-content: flex-start;
            }

            .line.checkbox {
                input {
                    flex: none;
                }
            }
            .desc {
                flex: auto;
                font-size: 13px;
                color: #c9c9c9;
                text-align: right;
            }
            .buttons {
                place-content: center;

                button.disabled {
                    pointer-events: none;
                    opacity: 0.5;
                }
            }
        }

        &:hover .notion-config {
            transition: all 0.4s ease;
            opacity: 1;
            pointer-events: auto;
        }
    }
}
</style>
<script lang="ts">
import Vue, { PropType } from "vue"
import { getDictData, IDictDir } from "./getDictData"
import vPromptItem from "../../Compoents/PromptEditor/Components/PromptItem/PromptItem.vue"
import { PromptItem } from "../PromptEditor/Sub/PromptItem"
import { useDatabaseServer } from "../PromptEditor/Lib/DatabaseServer/DatabaseServer"
import { useStorage } from "@vueuse/core"

const apiKey = useStorage<string>("ops-notion-apiKey", "")
const databaseId = useStorage<string>("ops-notion-databaseId", "")
const onlyMyNotion = useStorage("ops-notion-onlyMyNotion", false)
const enableMyNotion = useStorage("ops-notion-enableMyNotion", true)

export default Vue.extend({
    data() {
        return {
            dict: <IDictDir[] | null>null,
            activeDir: <IDictDir | null>null,
            apiKey,
            databaseId,
            onlyMyNotion,
            enableMyNotion,
            notionName: <string | null>null,
            notionUrl: <string | null>null,
            loading: false,
        }
    },
    watch: {
        databaseId(val: string) {
            if (val.startsWith("https://")) {
                let re = /\/([0-9a-f]{32})/.exec(val)
                if (re?.[1]?.length == 32) {
                    let databaseId = re?.[1]
                    ;(this as any).databaseId = databaseId
                } else {
                    ;(this as any).databaseId = ""
                }
            } else {
                if (val && val.length != 32) {
                    ;(this as any).databaseId = ""
                }
            }
        },
    },
    created() {
        this.loadData()
        let databaseServer = useDatabaseServer()
        console.log("[PromptDict]", this, databaseServer)
        if (this.notioConfigActive) {
            this.reloadData()
        }
    },
    methods: {
        loadData() {
            getDictData(onlyMyNotion.value).then((dict) => {
                ;(<any>this).dict = dict
                ;(<any>this).activeDir = dict[0]
            })
        },

        async reloadData() {
            if (enableMyNotion.value) {
                await this.fetchNotion()
            }
            this.loadData()
        },

        async fetchNotion() {
            try {
                console.log("[Notion] fetchNotion")
                this.loading = true
                this.notionName = null
                this.notionUrl = null
                let databaseServer = useDatabaseServer()
                let re = await databaseServer.fetchNotion({
                    apiKey: apiKey.value,
                    databaseId: databaseId.value,
                })
                this.notionName = re?.me?.name
                this.notionUrl = re?.me?.url
            } catch (e) {
                console.error("[Notion]", e)
                if (/Make sure the relevant pages and databases are shared with your integration/.test(e.message)) {
                    alert(`Notion 连接错误：` + e)
                } else {
                    alert(
                        `Notion 连接错误：没有 Notion 数据库的访问权限。请在此 Notion 数据库页面菜单的 'Connections' 中添加你的集成应用`
                    )
                }
            } finally {
                this.loading = false
            }
        },

        doApplyWord(item: PromptItem) {
            let activeInputEl: any = document.body.querySelector(".PromptWork.active")
            if (!activeInputEl) activeInputEl = document.body.querySelector(".PromptWork")
            // console.log("activeInputEl", activeInputEl)
            if (activeInputEl) {
                let vueIns = activeInputEl.__vue__
                let insertText = item.data.word.rawText ?? item.data.word.text
                if (vueIns.inputText == "") {
                    vueIns.inputText = insertText
                } else {
                    vueIns.inputText += ", " + insertText
                }
                vueIns.onUserInputDebounce()
                activeInputEl.querySelector("textarea.input")?.focus()
            }
        },

        doChangeActiveDir(dir: any) {
            this.activeDir = dir
        },

        doGotoNotionMe() {
            if (this.notionUrl) window.open(this.notionUrl)
        },
    },
    components: { PromptItem: vPromptItem },

    computed: {
        activeSubDirs() {
            if (this.activeDir) {
                return [this.activeDir, ...this.activeDir.children]
            }
        },

        notioConfigActive() {
            return !!(this.databaseId && this.apiKey)
        },
    },
})
</script>
