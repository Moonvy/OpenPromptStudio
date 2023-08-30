<!-- Created on 2023/03/26 - 00:11 -->
<template>
    <div class="PromptList"><slot></slot></div>
</template>
<style lang="scss"></style>
<script lang="ts">
import Vue, { PropType } from "vue"
import { PromptList } from "../../Sub/PromptList"

export default Vue.extend({
    props: {
        list: {
            type: Object as PropType<PromptList>,
            required: true,
        },
    },
    data() {
        return {}
    },
})
</script>
