<template>
    <button class="AddButton" @click="$emit('click', $event)">
        <Icon icon="radix-icons:plus-circled" />
    </button>
</template>
<style lang="scss">
.AddButton {
    display: inline-flex;
    align-items: center;
    place-content: center;
    border-radius: var(--padding-1);
    height: 28px;
    width: 28px;
    padding: 0;
    margin: 4px;
}
</style>
<script>
export default {}
</script>
