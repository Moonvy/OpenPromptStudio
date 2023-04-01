<!-- Created on 2023/03/31 - 12:10 -->
<template>
    <div class="PromptDict">
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
}
</style>
<script lang="ts">
import Vue, { PropType } from "vue"
import { getDictData, IDictDir } from "./getDictData"
import vPromptItem from "../../Compoents/PromptEditor/Components/PromptItem/PromptItem.vue"
import { PromptItem } from "../PromptEditor/Sub/PromptItem"

export default Vue.extend({
    data() {
        getDictData().then((dict) => {
            ;(<any>this).dict = dict
            ;(<any>this).activeDir = dict[0]
        })
        return {
            dict: <IDictDir[] | null>null,
            activeDir: <IDictDir | null>null,
        }
    },
    methods: {
        doApplyWord(item: PromptItem) {
            let activeInputEl: any = document.body.querySelector(".PromptWork.active")
            if (!activeInputEl) activeInputEl = document.body.querySelector(".PromptWork")
            console.log("activeInputEl", activeInputEl)
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
    },
    components: { PromptItem: vPromptItem },

    computed: {
        activeSubDirs() {
            if (this.activeDir) {
                return [this.activeDir, ...this.activeDir.children]
            }
        },
    },
})
</script>
