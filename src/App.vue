<template>

  <headerApp></headerApp>
  <langApp></langApp>
  <RouterView />
  <div class="footer">
    <footerApp></footerApp>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import footerApp from './components/footer/footer.vue';
import headerApp from './components/header/header.vue';
import langApp from './components/lang/lang.vue';

export default defineComponent({
  name: 'App',
  components: {
    footerApp,
    headerApp,
    langApp
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
