<template>

  <headerApp></headerApp>

  <home_page></home_page>
  <footerApp></footerApp>

  <RouterView />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import footerApp from './components/footer/footer.vue';
import headerApp from './components/header/header.vue';
import home_page from './components/homepage/homepage.vue';
import cguApp from './components/CGU/cgu.vue';

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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  /* margin-top: 60px; */
  width: 100%;
}
</style>
<style lang="scss or less">
  import './main.css';
  import './mobile.css';
</style>
