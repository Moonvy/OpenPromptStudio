<template>
    <div class="PromptEditor">
        <div class="workspace">
            <PromptWork
                v-for="work in promptEditor.works"
                :prompt-work="work"
                :key="work.id"
                @delete="doDeletePromptWork"
            />
        </div>

        <div class="operate-tool" ref="operate-tool">
            <button @click="doAddWorkspace"><Icon icon="radix-icons:card-stack-plus" /> 添加工作区</button>

            <div class="pngout-option checkbox">
                <input id="ope-expf" type="checkbox" v-model="promptEditor.data.enablePngExportFixed" />
                <label for="ope-expf"> 导出 PNG 时固定尺寸</label>
            </div>
            <div class="pngout-option checkbox">
                <input id="ope-expf2" type="checkbox" v-model="promptEditor.data.enablePngExportCopy" />
                <label for="ope-expf2"> 导出 PNG 到剪贴板</label>
            </div>

            <div class="server-select">
                <Icon icon="ic:baseline-g-translate" />
                <div class="lable">
                    {{ t("翻译服务：") }}
                </div>
                <select v-model="promptEditor.data.server">
                    <option value="http://localhost:19212/prompt-studio">本地测试</option>
                    <option value="https://indexfs.moonvy.com:19213/prompt-studio">腾讯翻译</option>
                    <option value="https://indexfs.moonvy.com:19213/prompt-studio/ai" disabled>
                        OpenAI GPT-3.5 (WIP)
                    </option>
                </select>
            </div>
        </div>

        <div v-if="false" class="debug PromptWork">
            <div class="PromptList">
                普通：
                <div class="list">
                    <div class="PromptItem">
                        <div class="displayName name">
                            <div class="lv">2</div>
                            Apple
                        </div>
                    </div>
                    <div class="PromptItem">
                        <div class="displayName name">
                            <div class="lv">1.2</div>
                            List Name
                        </div>
                        <div class="descName name">模型版本 4</div>
                    </div>
                    <div class="PromptItem">
                        <div class="displayName name">--style 4a</div>
                        <div class="descName name">样式 4a</div>
                    </div>
                </div>
            </div>
            <div class="PromptList">
                风格：
                <div class="list">
                    <div class="PromptItem subType-style">
                        <div class="displayName name">3D</div>
                    </div>
                    <div class="PromptItem subType-style">
                        <div class="displayName name">Oil</div>
                        <div class="descName name">油画风格</div>
                    </div>
                    <div class="PromptItem subType-style">
                        <div class="displayName name">
                            <div class="lv">2.5</div>
                            Oil
                        </div>
                        <div class="descName name">油画风格</div>
                    </div>
                    <div class="PromptItem subType-style">
                        <div class="displayName name">Bubble Mart</div>
                        <div class="descName name">泡泡玛特模型</div>
                    </div>
                </div>
            </div>
            <div class="PromptList">
                质量：
                <div class="list">
                    <div class="PromptItem subType-quality">
                        <div class="displayName name">4K</div>
                    </div>
                    <div class="PromptItem subType-quality">
                        <div class="displayName name">
                            <div class="lv">2</div>
                            high quality
                        </div>
                        <div class="descName name">高质量</div>
                    </div>
                </div>
            </div>
            <div class="PromptList">
                命令：
                <div class="list">
                    <div class="PromptItem subType-command">
                        <div class="displayName name">--only</div>
                    </div>
                    <div class="PromptItem subType-command">
                        <div class="displayName name">--v 4</div>
                        <div class="descName name">模型版本 4</div>
                    </div>
                    <div class="PromptItem subType-command">
                        <div class="displayName name">--style 4a</div>
                        <div class="descName name">样式 4a</div>
                    </div>
                </div>
            </div>
            <div class="PromptList">
                负面：
                <div class="list">
                    <div class="PromptItem subType-eg">
                        <div class="displayName name">bad</div>
                    </div>
                    <div class="PromptItem subType-eg">
                        <div class="displayName name">bad finger</div>
                        <div class="descName name">坏手指</div>
                    </div>
                    <div class="PromptItem subType-eg">
                        <div class="displayName name">low</div>
                        <div class="descName name">低质量</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
.PromptEditor {
    max-width: 1280px;
    margin: auto;
    .debug {
        margin-top: 200px;
    }

    .operate-tool {
        margin: 20px;
        display: flex;
        .checkbox {
            margin-left: 32px;
        }

        .server-select {
            display: flex;
            margin-left: auto;
            place-items: center;
            font-size: var(--font-size-1);
            color: #5a5a5a;
            .iconify {
                font-size: 1.2em;
                margin-right: 0.25em;
            }
            select {
                width: 130px;
            }
        }
    }
}
</style>
<script lang="ts">
import Vue, { PropType } from "vue"
import { PromptEditorClass } from "./PromptEditorClass"
import PromptWork from "./Components/PromptWork/PromptWork.vue"
import { dndInit } from "./Lib/DnD"

export default Vue.extend({
    data() {
        dndInit()
        let promptEditor = new PromptEditorClass()
        return { promptEditor }
    },
    components: { PromptWork },
    provide() {
        return { PromptEditor: this }
    },
    watch: {
        "promptEditor.data.server": {
            immediate: true,
            handler(val) {
                ;(<any>globalThis).__OPS_SERVER = val
            },
        },
    },
    methods: {
        doAddWorkspace() {
            this.promptEditor.addWorkspace()
            setTimeout(() => {
                ;(this.$refs["operate-tool"] as any).scrollIntoView({
                    behavior: "smooth",
                })
            }, 100)
        },

        doDeletePromptWork(promptWork: any) {
            this.promptEditor.removeWorkspace(promptWork)
        },
    },
})
</script>
