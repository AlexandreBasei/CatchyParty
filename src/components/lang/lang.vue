<template>
    <div @click="changeLangToEn()" class="langCont"  v-if="lang === 'fr'">
        <img src="@/assets/france.png" alt="france" class="lang">
    </div>

    <div @click="changeLangToFr()" class="langCont" v-if="lang === 'en'">
        <img src="@/assets/united-kingdom.png" alt="france" class="lang">
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    interface LangComponent {
        lang: string;
        changeLangToEn(): void;
        changeLangToFr(): void;
    }

    export default defineComponent({
        name: 'langApp',
        data(): LangComponent {
            return {
                lang: 'fr',
            } as LangComponent;
        },
        methods: {
            changeLangToEn(this: LangComponent){
                if(this.lang == 'fr'){
                    this.lang = 'en';
                    localStorage.setItem('lang',this.lang);
                    location.reload();
                }
            },
            changeLangToFr(this: LangComponent){
                if(this.lang == 'en'){
                    this.lang = 'fr';
                    localStorage.setItem('lang',this.lang);
                    location.reload();
                }
            },
        },
        mounted(this: LangComponent) {
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