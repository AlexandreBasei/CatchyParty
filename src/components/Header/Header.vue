<template>
    <header>
        <!-- <RouterLink to="/" class="headerLink"> -->
        <img alt="logo" src="@/assets/svg/logo.svg" @click="reload()">
        <!-- </RouterLink> -->
    </header>
</template>

<script>
export default ({
    name: 'headerApp',

    methods: {
        reload() {
            window.location.href = 'http://localhost:8080/?room='
        },
    }
});
</script>

<style lang="css" scoped>
    @import url('./header.css');
</style>
