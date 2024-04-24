<template>
    <header>
        <RouterLink to="/" class="headerLink">
        <!-- <img alt="logo" src="@/assets/logo.svg" @click="reload"> -->
        <img alt="logo" src="@/assets/logo.svg">
        </RouterLink>
    </header>
</template>

<style scoped>
    @import url('./header.css');
</style>

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