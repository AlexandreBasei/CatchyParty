<template>
    <main class="CGU-main">
        <section>
            <h2>{{ $t('INTRODUCTION') }}</h2>
            <p>
                {{ $t('INTRODUCTION_TEXTE') }}
            </p>
        </section>
        <br>
        <section>
            <h2>{{ $t('PROPRIETE_INTELLECTUELLE') }}</h2>
            <p>
                {{ $t('PROPRIETE_INTELLECTUELLE_TEXTE_1') }}
            </p>
            <p>
                {{ $t('PROPRIETE_INTELLECTUELLE_TEXTE_2') }}
            </p>
        </section>
        <br>
        <section>
            <h2>{{ $t('UTILISATION_DU_SITE') }}</h2>
            <p>
                {{ $t('UTILISATION_DU_SITE_TEXTE_1') }}
            </p>
            <p>
                {{ $t('UTILISATION_DU_SITE_TEXTE_2') }}
            </p>
        </section>
        <br>
        <section>
            <h2>{{ $t('LIMITATION_DE_RESPONSABILITE') }}</h2>
            <p>
                {{ $t('LIMITATION_DE_RESPONSABILITE_TEXTE') }}
            </p>
        </section>
        <br>
        <section>
            <h2>{{ $t('MODIFICATIONS_DES_CONDITIONS') }}</h2>
            <p>
                {{ $t('MODIFICATIONS_DES_CONDITIONS_TEXTE') }}
            </p>
        </section>
    </main>
</template>

<script>

    export default({
    name: 'cguApp',
    components: {

    }
    });
</script>

<style lang="css" scoped>
    @import './cgu.css';
    @import './cgu-mobile.css';
</style>