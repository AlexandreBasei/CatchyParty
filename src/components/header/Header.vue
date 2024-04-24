<template>
    <header>
        <RouterLink to="/">
            <img alt="logo" src="@/assets/svg/logo.svg" @click="reload">
        </RouterLink>
    </header>
</template>

<script>
export default ({
    name: 'headerApp',

    mounted() {
        // window.addEventListener("beforeunload", function (event) {
        //     // Afficher l'alerte
        //     var confirmationMessage = "Êtes-vous sûr de vouloir quitter cette page ? Vous quitterez la partie en cours";
        //     (event || window.event).returnValue = confirmationMessage; // For IE and Firefox
        //     return confirmationMessage; // For other browsers
        // });

    },
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
