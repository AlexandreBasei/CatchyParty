<template>
    <div @click="changeLangToEn()" class="langCont"  v-if="lang === 'fr'">
        <img src="@/assets/france.png" alt="france" class="lang">
    </div>

    <div @click="changeLangToFr()" class="langCont" v-if="lang === 'en'">
        <img src="@/assets/united-kingdom.png" alt="france" class="lang">
    </div>
</template>
<script lang="ts">

interface Lang {
        lang: string,
}

export default {
  name: 'langApp',
  data() {
    return {
      lang: ''
    };
  },
  methods: {
    changeLangToEn(){
            if(this.lang == 'fr'){
                this.lang = 'en';
                localStorage.setItem('lang',this.lang);
                location.reload();
            }
        },
    changeLangToFr(){
        if(this.lang == 'en'){
            this.lang = 'fr';
            localStorage.setItem('lang',this.lang);
            location.reload();
        }
    },
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
}
</script>
<style scoped>
@import url("./lang.css");
</style>