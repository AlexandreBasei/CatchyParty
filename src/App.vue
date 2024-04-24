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
import footerApp from '@/components/Footer/Footer.vue';
import headerApp from '@/components/Header/Header.vue';
import langApp from '@/components/lang/lang.vue';

export default defineComponent({
  name: 'App',
  components: {
    footerApp,
    headerApp,
    langApp
  }
});
</script>

<style lang="css" scoped>
  @import './main.css';
  @import './mobile.css';
</style>
