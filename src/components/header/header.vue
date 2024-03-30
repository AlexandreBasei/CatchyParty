<template>
    <header>
        <RouterLink to="/">
            <img alt="logo" src="../../assets/logo.svg" @click="reload">
        </RouterLink>

    </header>
</template>

<style scoped>
header {
    justify-content: center;
    display: flex;
}

header a {
    margin-top: 15px;
}
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