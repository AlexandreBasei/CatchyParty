<template>

  <headerApp></headerApp>
  <RouterView />
  <div class="footer" id="footer">
    <footerApp></footerApp>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import footerApp from '@/components/Footer/Footer.vue';
import headerApp from '@/components/Header/Header.vue';

export default defineComponent({
  name: 'App',
  components: {
    footerApp,
    headerApp,
  }
});
</script>

<style lang="css" scoped>
  @import './main.css';
  @import './mobile.css';
</style>
