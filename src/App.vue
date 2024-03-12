<template>
  <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  <footerApp></footerApp>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import footerApp from './components/footer/footer.vue'; // Import du composant Footer

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld,
    footerApp
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
