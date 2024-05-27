<template>
    <header>
        <RouterLink to="/" class="headerLink">
        <!-- <img alt="logo" src="@/assets/logo.svg" @click="reload"> -->
        <img alt="logo" src="@/assets/svg/logo.svg" @click="reload">
        </RouterLink>
    </header>
</template>

<script>
export default ({
    name: 'headerApp',

    methods: {
        reload() {
            window.location.search = '?room=';
        },
    }
});
</script>

<style lang="css" scoped>
    @import url('./header.css');
</style>
