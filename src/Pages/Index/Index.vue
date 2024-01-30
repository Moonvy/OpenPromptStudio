<template>
    <div class="IndexPage">
        <nav>
            <a class="logo" href="https://github.com/Moonvy/OpenPromptStudio"><b>OPS</b>/OpenPromptStudio</a>
            <a class="icon-link" href="https://github.com/Moonvy/OpenPromptStudio" target="_blank">
                <Icon icon="radix-icons:github-logo"
            /></a>

            <div class="dict-button-box" @click="toggleDictPad()">
                提示词词典
                <button class="icon dict-button"><Icon icon="mingcute:book-4-fill" /></button>
            </div>
        </nav>
        <PromptEditor ref="PromptEditor" :init-prompts="initPrompts" />
        <section class="PromptDictPad" v-if="needDictPad" v-show="showDictPad">
            <div class="title">
                <Icon icon="mingcute:book-4-fill" />
                提示词词典
                <!--                <a class="github-dict" href="https://github.com/Moonvy/OpenPromptStudio" target="_blank">-->
                <!--                    <Icon icon="radix-icons:github-logo" />一起维护词典</a-->
                <!--                >-->
                <button class="icon close-button" @click="toggleDictPad(false)">
                    <Icon icon="radix-icons:cross-1" />
                </button>
            </div>
            <PromptDict />
        </section>
        <footer>
            <a href="https://github.com/Moonvy/OpenPromptStudio" target="_blank">
                <img class="icon" src="/icon.svg" /> OpenPromptStudio / v{{ version }} /
            </a>
            <a href="https://moonvy.com/?homepage"> made by <img src="./assets/logo_full_cn.svg" /></a>
        </footer>
    </div>
</template>
<style lang="scss">
.IndexPage {
    > nav {
        display: flex;
        place-items: center;
        padding-top: 11px;
        padding-bottom: 20px;
        padding-left: 23px;
        padding-right: 14px;
        .logo {
            font-family: "JetBrains Mono";
            color: #9f9f9f;
            text-shadow: 0 1px 1px #ffffff;
            display: flex;
            place-items: center;
            font-weight: 200;
            display: flex;
            place-content: flex-start;
            text-decoration: none;
        }

        .icon-link {
            display: flex;
            place-items: center;
            font-size: 18px;
            color: #888686;
            text-shadow: 0 1px 1px #ffffff;
            margin-left: 6px;
        }

        .dict-button-box {
            margin-left: auto;
            display: flex;
            font-size: 14px;
            place-items: center;
            color: #6161b7;
            text-shadow: 0 1px 1px #ffffff;
            margin-right: 40px;
            cursor: pointer;
        }
        .dict-button {
            color: #6161b7;
            margin-left: 6px;
            position: fixed;
            right: 20px;
            top: 14px;
            z-index: 50;
        }
    }

    > footer {
        display: flex;
        place-content: flex-end;
        place-items: center;
        padding-bottom: 20px;
        padding-top: 32px;
        padding-right: 20px;
        border-top: 1px solid #d7d7d7;
        box-shadow: 0 1px 0 rgba(255, 255, 255, 0.9215686275) inset;

        a {
            display: flex;
            place-content: flex-end;
            place-items: center;
            text-decoration: none;
            color: #4b4a4a;
            font-family: "JetBrains Mono";
            font-size: 13px;
            img {
                margin-left: 6px;
                height: 21px;
            }

            .icon {
                margin-right: 0.5em;
            }

            &:not(:last-child) {
                margin-right: 0.5em;
            }
        }
    }

    > .PromptDictPad {
        position: fixed;
        display: flex;
        flex-direction: column;
        top: 0;
        right: 0;
        width: 550px;
        height: 100vh;
        z-index: 100;
        max-width: calc(100vw - 100px);
        background: rgb(247 247 247 / 71%);
        backdrop-filter: blur(32px);
        box-shadow: -2px 0 2px #26252512, -2px 0 12px #26252521, -2px 0 64px #0605491f;

        > .title {
            display: flex;
            place-items: center;
            padding: 14px 20px;
            font-size: 14px;
            color: #6161b7;
            text-shadow: 0 1px 1px #ffffff;
            font-weight: bold;
            > .iconify {
                font-size: 22px;
                margin-right: 8px;
                filter: drop-shadow(0 1px 1px #ffffff);
                color: #6161b7;
            }

            > .close-button {
                margin-left: auto;
            }

            .github-dict {
                display: flex;
                place-items: center;
                text-decoration: none;
                margin-left: 12px;
                font-weight: normal;
                color: #7a78dc;
                &:hover {
                    text-decoration: underline;
                }
                .iconify {
                    margin-right: 4px;
                }
            }
        }
    }
}

@media screen and (max-width: 1550px) {
    .IndexPage > footer {
        padding-top: 92px;
    }
}
</style>
<script lang="ts">
import Vue, { PropType } from "vue"
import vPromptEditor from "../../Compoents/PromptEditor/PromptEditor.vue"
import vPromptDict from "../../Compoents/PromptDict/PromptDict.vue"

import pkg from "../../../package.json"
export default Vue.extend({
    data() {
        return {
            showDictPad: false,
            needDictPad: false,
            version: pkg.version,
            initPrompts: null,
        }
    },
    methods: {
        toggleDictPad(show?: boolean) {
            this.showDictPad = show ?? !this.showDictPad
            if (this.showDictPad) this.needDictPad = true
        },

        getPromptsFromUrlQuery() {
            if (this.$route?.query?.prompts) {
                try {
                    let prompts = JSON.parse(<any>this.$route.query.prompts)
                    console.log("[getPromptsFromUrlQuery]:", prompts)
                    this.initPrompts = prompts

                    let newQuery = Object.assign({}, this.$route.query)
                    delete newQuery.prompts
                    this.$router.replace({ query: newQuery })
                } catch (e) {
                    console.error(e)
                }
            }
        },
    },
    components: {
        PromptEditor: <any>vPromptEditor,
        PromptDict: vPromptDict,
    },
    created() {
        this.getPromptsFromUrlQuery()
    },
})
</script>
