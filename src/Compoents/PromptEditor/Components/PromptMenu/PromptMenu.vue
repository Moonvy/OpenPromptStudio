<!-- Created on 2023/03/24 - 22:14 -->
<template>
    <div class="PromptMenu" ref="menu" v-show="show">
        <button @click="doCopy"><Icon icon="radix-icons:clipboard-copy" /> 复制</button>
        <button @click="doEdit"><Icon icon="radix-icons:pencil-2" /> 编辑</button>
        <button @click="doEditLang"><Icon icon="cil:language" /> 编辑译文</button>
        <button @click="doDelete"><Icon icon="radix-icons:trash" /> 删除</button>
    </div>
</template>
<style lang="scss">
.PromptMenu {
    position: fixed;
    display: flex;
    flex-direction: column;
    width: 170px;
    background: #000000cf;
    backdrop-filter: blur(20px);
    border-radius: 4px;
    box-shadow: 0 2px 3px #0000004f, 0 8px 8px #00000014;
    max-width: 200px;
    z-index: 100;
    overflow: hidden;

    .button-list {
        border-top: 1px solid #5a5a5a;
        display: flex;
        flex-direction: column;
    }

    button {
        --bk-color: transparent;
        color: #bcbece;
        place-content: flex-start;
        display: flex;
        text-shadow: none;
        place-items: center;
        .iconify {
            margin-right: 10px;
            font-size: 1.2em;
        }
        &:hover {
            --bk-color: #cac2ff26;
            color: #ffffffe8;
        }
        &:active {
            --bk-color: #00000024;
            color: rgba(138, 134, 134, 0.91);
        }
    }
}

.PromptMenu-ghost {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
}
</style>
<script>
import { useClipboard } from "@vueuse/core"

let { copy } = useClipboard()
export default {
    mounted() {
        this.$nextTick(() => {})
        document.addEventListener("mousedown", (e) => {
            if (this.show) {
                if (!this.$el.contains(e.target)) this.close()
            }
        })
    },
    data() {
        return {
            show: false,
            bindEl: null,
            clickW: 0,
            promptList: null,
            item: null,
        }
    },
    methods: {
        doCopy() {
            this.close()
            copy(this.item.data.word.rawText)
        },
        doEdit() {
            this.close()
            this.item.state.isEdit = "text"
            this.bindEl.__vue__.doFoucs()
        },
        doEditLang() {
            this.close()
            this.item.state.isEdit = "lang"
            this.bindEl.__vue__.doFoucs()
        },
        doDelete() {
            this.close()
            this.promptList.removePrompt(this.item)
            this.bindEl.__vue__.$emit("update")
        },
        open({ item, el, event, promptList }) {
            this.bindEl = el
            this.clickW = event.clientX
            this.show = true
            this.item = item
            this.promptList = promptList
            this.updatePosition()
        },
        close() {
            this.show = false
        },
        updatePosition() {
            if (this.bindEl) {
                let elMenu = this.$refs.menu
                if (elMenu) {
                    let menuW = elMenu.getBoundingClientRect().width
                    let rect = this.bindEl.getBoundingClientRect()
                    elMenu.style.left = `${this.clickW - menuW / 2}px`
                    elMenu.style.top = `${rect.y + rect.height}px`
                }
            }
        },
    },
    computed: {},
    beforeDestroy() {},
}
</script>
