<template>
    <div @click="toggleLang" class="langCont">
        <img :src="lang === 'fr' ? require('@/assets/france.png') : require('@/assets/united-kingdom.png')" 
             :alt="lang === 'fr' ? 'france' : 'united-kingdom'" 
             class="lang">
    </div>
</template>


<script lang="ts">
    import { defineComponent } from 'vue';


    export default defineComponent({
        name: 'langApp',
        data() {
            return {
                lang: 'fr',
            };
        },
        methods: {
            toggleLang() {
                this.lang = this.lang === 'fr' ? 'en' : 'fr';
                localStorage.setItem('lang', this.lang);
                location.reload();
            }
        },
        mounted() {
            const getLang = localStorage.getItem('lang');
                if(getLang){
                    this.lang = getLang;
                }else{
                    this.lang = 'fr';
                    localStorage.setItem('lang',this.lang);
                }
        }
    });
</script>

<style lang="css" scoped>
    @import url("./lang.css");
</style>