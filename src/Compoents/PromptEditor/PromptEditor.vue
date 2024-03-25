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
            <button @click="doCopyWorkspaceUrl"><Icon icon="radix-icons:link-2" /> 复制链接</button>

            <div class="pngout-option checkbox">
                <input id="ope-expf" type="checkbox" v-model="promptEditor.data.enablePngExportFixed" />
                <label for="ope-expf"> 导出 PNG 时固定尺寸</label>
            </div>
            <div class="pngout-option checkbox">
                <input id="ope-expf2" type="checkbox" v-model="promptEditor.data.enablePngExportCopy" />
                <label for="ope-expf2"> 导出 PNG 到剪贴板</label>
            </div>

            <div
                class="server-select"
                v-tooltip="
                    `调用翻译接口会有不小的成本开销，我们做了适当限制\n当同时使用用户过多时会不稳定，请见谅\n想要更好的翻译体验可以在本项目 Github 页获得本地部署的方法\n\n${
                        promptEditor.data.server === LocalTrasnslateServer ? promptEditor.data.server : ''
                    }`
                "
            >
                <Icon icon="ic:baseline-g-translate" />
                <div class="lable">
                    {{ t("翻译服务：") }}
                </div>
                <select v-model="promptEditor.data.server">
                    <option :value="LocalTrasnslateServer" :title="LocalTrasnslateServer">本地翻译接口</option>
                    <option value="https://indexfs.moonvy.com:19213/prompt-studio">腾讯翻译</option>
                    <option value="https://indexfs.moonvy.com:19213/prompt-studio2">腾讯翻译 2</option>
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

        <!--    在使用 indexfs.moonvy.com 的翻译服务时显示广告，尝试给腾讯翻译的服务费回血    -->
        <div v-if="needShowAd" class="回血-box" v-tooltip="'广告商提供的内容，与本网站（Moonvy 月维）无关'">
            <a href="https://moonvy.com?homepage&ops" target="_blank"> <img src="./Assets/ad_moonvy.png" /> </a>
            <!-- <a href="https://www.wolai.com/9u31LAYfakr6THnD2burvW" target="_blank"> <img src="./Assets/ad221126.png" /> </a> -->
            <a href="https://nf.video/yinhe/web?sharedId=124758" target="_blank"> <img src="./Assets/ad.png" /> </a>
            <!-- <a href="https://universalbus.cn?s=hd2fCq8xEw" target="_blank"> <img src="./Assets/ad5.jpg" /> </a> -->

            <a href="https://sd-1258045456.cos.ap-guangzhou.myqcloud.com/sd011" target="_blank"> <img src="./Assets/ad6.png" /> </a>
            <!-- <a href="https://www.kaiecho.com/" target="_blank"> <img src="./Assets/ad2.jpg" /> </a> -->
            <!-- <a href="https://sd-1258045456.cos.ap-guangzhou.myqcloud.com/chachasd.html" target="_blank"> <img src="./Assets/ad3c.png" /> </a> -->
        </div>
       
    </div>
</template>
<style lang="scss">
.PromptEditor {
    position: relative;
    max-width: 1280px;
    margin: auto;
    .debug {
        margin-top: 200px;
    }

    .operate-tool {
        margin: 20px;
        display: flex;
        gap: 6px;
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
    .回血-box {
        position: absolute;
        bottom: -93px;
        left: 18px;
        img {
            height: 52px;
            margin-right: 4px;
        }
    }
}
</style>
<script>
import { LOCAL_TRANSLATE_SERVER, PromptEditorClass } from "./PromptEditorClass"
import PromptWork from "./Components/PromptWork/PromptWork.vue"
import { dndInit } from "./Lib/DnD"
import { useClipboard } from "@vueuse/core"
let { copy } = useClipboard({ legacy: true })
export default {
    props: ["initPrompts"],
    data() {
        dndInit()
        let promptEditor = new PromptEditorClass({ initPrompts: this.initPrompts })
        return {
            LocalTrasnslateServer: LOCAL_TRANSLATE_SERVER,
            promptEditor,
            adDelay: false,
        }
    },
    components: { PromptWork },
    provide() {
        setTimeout(() => (this.adDelay = true), 500)
        return { PromptEditor: this }
    },
    watch: {
        "promptEditor.data.server": {
            immediate: true,
            handler(val) {
                globalThis.__OPS_SERVER = val
            },
        },
    },
    methods: {
        doAddWorkspace() {
            this.promptEditor.addWorkspace()
            setTimeout(() => {
                this.$refs["operate-tool"].scrollIntoView({
                    behavior: "smooth",
                })
            }, 100)
        },
        doCopyWorkspaceUrl() {
            let prompts = this.promptEditor.works.map((w) => w.exportPrompts())
            let q = encodeURIComponent(JSON.stringify(prompts))
            let url = `${location.origin + location.pathname}?prompts=${q}`
            copy(url)
        },

        doDeletePromptWork(promptWork) {
            this.promptEditor.removeWorkspace(promptWork)
        },
    },
    computed: {
        needShowAd() {
            if (this.adDelay && this.promptEditor.data.server?.startsWith("https://indexfs.moonvy.com")) {
                return true
            }
        },
    },
}
</script>
