<template>
     <main class="about-main">
        <section id="mission">
            <h2>{{ $t('NOTRE_MISSION') }}</h2>
            <p>{{ $t('NOTRE_PROJET_TEXTE') }}</p>
        </section>
        <section id="equipe">
            <h2>{{ $t('NOTRE_EQUIPE') }}</h2>
            <p>{{ $t('NOTRE_EQUIPE_TEXTE') }}</p>
        </section>
        <section id="vision">
            <h2>{{ $t('NOTRE_VISION') }}</h2>
            <p>{{ $t('NOTRE_VISION_TEXTE') }}</p>
        </section>
    </main>

</template>

<script>

    export default({
    name: 'aboutApp',
    data() {
    return {
        lang: ''
    };
    },
    mounted() {
        this.lang = localStorage.getItem('lang');
    },
    components: {
        
    }
    });
</script>

<style lang="css" scoped>
    @import './about.css';
    @import './about-mobile.css';
</style>