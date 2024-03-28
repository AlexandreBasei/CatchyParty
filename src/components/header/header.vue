<template>
    <header>
        <RouterLink to="/">
            <img alt="logo" src="../../assets/logo.svg">
        </RouterLink>

    </header>
</template>
<style scoped>
    header{
    justify-content: center;
    display: flex;
}

header a{
    margin-top: 15px;
}
</style>
<script>
export default ({
    name: 'headerApp',
});
</script>