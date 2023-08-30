<!-- Created on 2023/03/20 - 18:43 -->
<template>
    <div class="PromptWork" :class="{ isPNGExporting }" @click="onWorkClick">
        <div class="AddArea Area">
            <div class="WorkInfoArea Area">
                <div class="WorkName"><input type="text" v-model="promptWork.data.name" /></div>
            </div>
            <textarea
                class="input"
                v-model="inputText"
                placeholder="输入提示词"
                rows="8"
                @paste="onUserInputDebounce"
                @input="onUserInputDebounce"
                @keydown.enter="onUserInputDebounce"
                @change="onUserInputDebounce"
                spellcheck="false"
            >
            </textarea>
            <div class="output">
                <div class="pl" v-if="outputText == inputText">输出与输入相同</div>
                <template v-else> {{ outputText }}</template>
            </div>
            <div class="options">
                <!--                <button @click="doExportPrompt">{{ "导出" }}</button>-->
                <!--                <button @click="doImportByInput">{{ "导入" }}</button>-->
                <div class="line">
                    <button @click="copy(outputText)" title="复制">
                        <Icon icon="radix-icons:clipboard-copy" /> 复制
                    </button>

                    <div class="button-group">
                        <button @click="doDisableAll()" v-tooltip="'全部禁用'" class="icon">
                            <Icon icon="radix-icons:shadow-none" />
                        </button>
                        <button
                            @click="doSwitchIO()"
                            v-tooltip="'用输出替换输入'"
                            class="icon"
                            :class="{ disabled: outputText == inputText }"
                        >
                            <Icon icon="radix-icons:arrow-up" />
                        </button>
                        <button
                            @click="doClear()"
                            v-tooltip="'清空输入'"
                            class="icon"
                            :class="{ disabled: inputText?.length == '' }"
                        >
                            <Icon icon="radix-icons:crumpled-paper" />
                        </button>
                    </div>
                    <div class="button-group">
                        <button @click="toPng" v-tooltip="`导出 PNG 图片`">
                            <Icon icon="fluent:image-16-regular" />
                        </button>
                        <button @click="toPng({ scale: 2 })" v-tooltip="`导出 PNG 图片（2X）`">
                            <Icon icon="fluent:hd-24-regular" />
                        </button>
                    </div>
                </div>
                <div class="line more-options">
                    <select v-model="inputParser" class="parser-select" v-tooltip="`提示词语法类型`">
                        <option value="midjourney">Midjourney</option>
                        <option value="stable-diffusion-webui">stable-diffusion-webui</option>
                    </select>
                    <button @click="doDeleteWorkspace()" v-tooltip="`删除工作区`" class="icon">
                        <Icon icon="radix-icons:trash" />
                    </button>
                </div>
            </div>
        </div>
        <div class="main" ref="main">
            <div
                class="PromptListArea Area"
                :class="[promptWork.groups.length <= 1 ? 'noGroup' : 'hasGroup']"
                @contextmenu.prevent
            >
                <div class="PromptGroup" v-for="group in promptWork.groups">
                    <div class="PromptGroupTitle" v-if="promptWork.groups.length > 1">
                        <div class="name">
                            <input value="权重组" /> <span v-if="group.name">{{ group.name }}</span>
                            <span class="groupLv" v-if="group.groupLv && group.groupLv != 1">{{ group.groupLv }}</span>
                        </div>
                    </div>
                    <PromptList
                        v-for="promptList in group.lists"
                        :key="promptList.data.id"
                        :list="promptList"
                        @update="doExportPrompt()"
                    >
                        <div class="name-bar">
                            <div class="name" :class="[`type-${promptList.data.id}`]" :title="promptList.data.name">
                                <span class="content">{{ promptList.data.name ?? promptList.data.id }}</span>
                            </div>
                        </div>
                        <div
                            class="list PromptList-list"
                            @dblclick="
                                onPromptListDblick($event, promptList, {
                                    group: group.id,
                                    lv: group.groupLv,
                                    subType: promptList.data.id,
                                })
                            "
                        >
                            <PromptItem
                                @click="onItemClick(item)"
                                @update="onItemUpdate(item)"
                                @contextmenu="doOpenItemMenu($event, promptList)"
                                v-for="item in promptList.items"
                                :item="item"
                                :list="promptList"
                                :key="item.data.word.id"
                            />
                        </div>
                    </PromptList>
                </div>
            </div>
        </div>
        <PromptMenu ref="menu"></PromptMenu>
    </div>
</template>
<style lang="scss">
.PromptEditor .PromptWork {
    padding: var(--padding-4) 0;
    --margin-left: 80px;
    border-bottom: 1px solid #d7d7d7;
    box-shadow: 0 1px 0 #ffffffeb;
    display: flex;

    .PromptGroup {
        .PromptGroupTitle {
            margin-left: calc(10px + var(--margin-left));
            font-size: var(--font-size-05);
            color: #505050;
            margin-bottom: 8px;
            margin-top: 8px;
            font-family: "JetBrains Mono";
            .name {
                display: inline-flex;
                border-radius: 3px;
                padding: var(--padding-1) var(--padding-2);
                background: #e6e6e6;
                color: #757985a3;
                text-shadow: 0 1px #ffffff7d;
                align-items: center;
                .groupLv {
                    display: inline-flex;
                    align-items: center;
                    background: #fff;
                    padding: 0.1em 0.5em;
                    margin-left: 0.5em;
                    background: #c4c4c48f;
                    border-radius: 2px;
                    color: #736c81;
                }

                input {
                    color: #757985a3;
                    text-shadow: 0 1px #ffffff7d;
                    background: transparent;
                    border: none;
                    min-width: 10px;
                    width: 36px;
                    appearance: none;
                    font-size: var(--font-size-05);
                    padding: 1px 2px;
                }
            }
        }
    }

    .PromptList {
        display: flex;
        > .list {
            display: flex;
            flex-wrap: wrap;
            align-items: flex-end;
            padding-right: 28px;
            position: relative;
            width: 100%;
            min-height: 36px;
        }
        > .name-bar {
            width: var(--margin-left);
            text-align: right;
            padding-right: var(--padding-2);
            flex: none;
            padding-top: 0;
            font-size: var(--font-size-1);
            display: flex;
            place-content: flex-end;
            color: #9a9a9a;
            .name {
                padding-top: var(--padding-2);
                background: transparent;

                overflow: hidden;
                white-space: nowrap;
            }
        }

        .AddButton {
            display: none;
            position: absolute;
            right: 0;
            top: 0;
        }

        &:hover {
            .AddButton {
                display: inline-flex;
            }
        }
    }
    .noGroup .PromptList {
        padding: var(--padding-1) 0;
    }
    .hasGroup .PromptList {
        .name-bar {
            .name {
                width: 5px;
                .content {
                    display: none;
                }
                &.type-normal {
                    background: #cecece;
                }
                &.type-style {
                    background: #9ec9c6;
                }
                &.type-quality {
                    background: #939bbd;
                }
                &.type-command {
                    background: #d6d3ec;
                }
            }
        }

        &:nth-of-type(2) .name-bar .name {
            border-radius: 4px 4px 0 0;
            margin-top: 4px;
        }
        &:last-of-type .name-bar .name {
            border-radius: 0 0 4px 4px;
            margin-bottom: 4px;
        }
        &:last-of-type:nth-of-type(2) .name-bar .name {
            border-radius: 4px;
            margin-bottom: 4px;
            margin-top: 4px;
        }
    }

    .AddArea {
        display: flex;
        flex-direction: column;
        flex: none;
        width: 320px;
        margin-left: 20px;

        > * {
            transition: all 0.2s ease;
        }
        .output {
            position: relative;
            z-index: 2;
            box-shadow: 0 2px 2px 0px rgba(36, 36, 36, 0.8901960784), 0 4px 4px rgba(36, 36, 36, 0.0901960784);
            background: #2b2828;
            color: #4dc177;
            font-family: "JetBrains Mono";
            border-radius: var(--padding-1);
            padding: var(--padding-2);
            font-size: var(--font-size-1);
            white-space: normal;
            word-wrap: break-word;
            margin-top: 8px;
            min-height: 1em;
            .pl {
                color: #7a8b7e;
            }
        }

        .options {
            display: flex;
            margin-top: 12px;
            gap: 6px;
            align-items: flex-start;
            flex-direction: column;
            flex: auto;
            .line {
                display: flex;
                gap: 6px;
            }
            button {
                display: inline-flex;
                background: #e9e9e9;
                padding: 6px 12px;
                flex: none;
                align-items: center;

                &:hover {
                    background: #d6d6d6;
                }
                &:active {
                    background: #bebcbc;
                }
                &.icon {
                    padding: 6px 9px;
                }
            }
            .button-group {
                display: flex;
                align-items: center;
                gap: 4px;
                background: #e9e9e9;
                border-radius: 4px;
                height: 2.3em;
                padding: 0 4px;
                font-size: var(--font-size-1);
                button {
                    padding: 4px;
                    height: 1.8em;
                    width: 1.8em;
                    .iconify {
                        margin-right: 0;
                        font-size: var(--font-size-2);
                    }
                    &.disabled {
                        opacity: 0.4;
                        pointer-events: none;
                    }
                }
            }

            .parser-select {
                margin-left: auto;
                width: 150px;
            }

            .more-options {
                margin-top: auto;
                .parser-select {
                    margin-left: auto;
                    width: auto;
                    padding-right: 35px;
                }
            }
        }
    }
    .WorkInfoArea {
        display: flex;
        flex-direction: column;
        margin-bottom: 8px;
        .WorkName {
            margin-left: -4px;
            margin-bottom: 4px;
            display: flex;
            input {
                border: none;
                background: transparent;
                font-size: var(--font-size-1);
                padding: var(--padding-1) var(--padding-2);
                font-family: "JetBrains Mono", -apple-system;
                border-radius: 3px;
                color: #5f5c5c;
                font-weight: 600;
                width: calc(100% + -6px);
                flex: none;
                &:focus-visible {
                    outline: none;
                    box-shadow: 0 0 0 2px rgb(182 179 179);
                }
            }
        }
    }
    textarea {
        border: none;
        background: #e9e9e9;
        border-radius: var(--padding-1);
        padding: var(--padding-2);
        font-size: var(--font-size-1);
        color: #252525cf;
        font-family: "JetBrains Mono";
        resize: none;
        word-break: break-all;
        box-shadow: 0 0 0 2px #bdb8b880;
        &:focus,
        &:focus-visible {
            outline: none;
            box-shadow: 0 0 0 2px rgb(183 183 183);
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

    &.isPNGExporting {
        .PromptItem.disabled {
            display: none;
        }
    }
}
</style>
<script lang="ts">
import Vue, { PropType } from "vue"
import { PromptWork } from "../../Sub/PromptWork"
import vPromptItem from "../PromptItem/PromptItem.vue"
import vAddButton from "./Components/AddButton.vue"
import vPromptList from "../PromptList/PromptList.vue"
import debounce from "lodash/debounce"
import { PromptItem } from "../../Sub/PromptItem"
import { useClipboard } from "@vueuse/core"
let { copy } = useClipboard({ legacy: true })
import { copyBlobToClipboard } from "copy-image-clipboard"
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image"
import { getImageSize } from "html-to-image/src/util"
// @ts-ignore
import download from "downloadjs"
import { PromptList } from "../../Sub/PromptList"
import vPromptMenu from "../PromptMenu/PromptMenu.vue"

export default Vue.extend({
    props: {
        promptWork: { type: Object as PropType<PromptWork>, required: true },
    },
    inject: ["PromptEditor"],
    data() {
        return {
            inputText: "",
            outputText: "",
            inputParser: this.promptWork?.data?.parser ?? "midjourney",
            isPNGExporting: false,
        }
    },
    created() {
        ;(<any>this).doImportByInputThrottle = debounce(
            () => {
                this.doImportByInput()
            },
            30,
            { maxWait: 50 }
        )
        ;(<any>this).doAddInputDebounce = debounce(() => {
            this.doImportByInputThrottle()
        }, 300)
        this.inputText = this.promptWork.data.initText ?? ""
        this.doImportByInputThrottle()
    },
    watch: {
        inputParser(val) {
            this.promptWork.data.parser = val
            this.doImportByInputThrottle()
        },
    },
    methods: {
        doImportByInputThrottle() {},
        async doImportByInput() {
            console.log("[doImportByInput]")
            await this.promptWork.importPrompts(this.inputText, { parser: <any>this.inputParser })
            this.doExportPrompt()
        },
        doExportPrompt() {
            let text = this.promptWork.exportPrompts()
            this.outputText = text
        },
        async onUserInput() {
            setTimeout(() => {
                ;(<any>this).doImportByInputThrottle()
            }, 0)
        },
        async onUserInputDebounce() {
            // console.log("[onUserInputDebounce]")
            ;(<any>this).doAddInputDebounce()
        },
        async doClear() {
            this.inputText = ""
            await this.doImportByInputThrottle()
            this.doExportPrompt()
        },
        doSwitchIO() {
            this.inputText = this.promptWork.exportPrompts()
        },
        doDisableAll() {
            this.promptWork.disableAll()
            this.doExportPrompt()
        },
        doDeleteWorkspace() {
            this.$emit("delete", this.promptWork)
        },
        // 提示词条目被点击
        onItemClick(item: PromptItem) {
            // console.log("onItemClick", item)
            item.data.disabled = !item.data.disabled
            this.doExportPrompt()
        },
        // 提示词条目内容更新
        async onItemUpdate(item: PromptItem) {
            this.doExportPrompt()
        },
        // 提示词列表空白处双击新建
        onPromptListDblick(e: any, promptList: PromptList, data: any) {
            if (e?.target?.classList?.contains("list")) {
                this.doAddNewByList(promptList, data)
            }
        },
        copy(text: string) {
            copy(text)
        },
        async toPng(options?: { scale: number }) {
            this.isPNGExporting = true
            let enablePngExportFixed = (<any>this).PromptEditor?.promptEditor?.data?.enablePngExportFixed
            let enablePngExportCopy = (<any>this).PromptEditor?.promptEditor?.data?.enablePngExportCopy
            try {
                let el = <any>this.$refs.main
                let { width, height } = getImageSize(el)

                let scale = options?.scale ?? 1
                if (enablePngExportFixed) width = 1240
                width = width * scale
                height = height * scale

                let re = await toBlob(el, {
                    width,
                    height,
                    style: { transform: `scale(${scale})`, transformOrigin: "top left" },
                })
                this.isPNGExporting = false

                if (enablePngExportCopy) {
                    copyBlobToClipboard(re!)
                } else {
                    download(re, `${this.promptWork.data.name}-OPS-Prompts_${width}x${height}.png`)
                }
            } catch (e) {
                console.error(e)
                this.isPNGExporting = false
            }
        },

        doAddNewByList(promptList: PromptList, data: any) {
            let item = promptList.pushPrompt("", data)
            item.state.isEdit = "text"
        },

        doOpenItemMenu(options: { item: PromptItem; el: any; event: any }, promptList: PromptList) {
            ;(this.$refs as any).menu.open({ ...options, promptList })
        },

        onWorkClick() {
            let els = document.body.querySelectorAll(".PromptWork")
            els.forEach((el) => el.classList.toggle("active", false))
            this.$el.classList.toggle("active", true)
        },
    },
    components: { PromptMenu: vPromptMenu, PromptItem: vPromptItem, AddButton: vAddButton, PromptList: vPromptList },
})
</script>
