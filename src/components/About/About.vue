<template>
    <langApp></langApp>
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

<script lang="ts">
import { defineComponent, ref } from 'vue';
import langApp from '@/components/Lang/Lang.vue';

export default defineComponent({
    name: 'aboutApp',
    components: {
        langApp
    },
    data() {
        return {
            lang: 'fr' as string | null
        };
    },
    mounted() {
        this.lang = localStorage.getItem('lang');
    },
});
</script>

<style lang="css" scoped>
    @import './about.css';
    @import './about-mobile.css';
</style>