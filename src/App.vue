<template>

  <!-- <headerApp></headerApp>

  <home_page></home_page>
  <footerApp></footerApp> -->

  <RouterView />
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { RouterLink, RouterView } from 'vue-router';
  import footerApp from './components/Footer/Footer.vue';
  import headerApp from './components/Header/Header.vue';
  import home_page from './components/Homepage/Homepage.vue';
  import cguApp from './components/CGU/CGU.vue';

  export default defineComponent({
    name: 'App',
    components: {
      // footerApp,
      // headerApp,
      // home_page,
      // cguApp
    }
  });
</script>

<style lang="css" scoped>
  @import './main.css';
  @import './mobile.css';
</style>
