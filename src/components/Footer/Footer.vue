<template>
  <footer>
    <div class="footerLinks">
      <RouterLink to="/about">{{ $t('A_PROPOS') }}</RouterLink>
      <RouterLink to="/cgu">{{ $t('CGU') }}</RouterLink>
      <RouterLink to="/contact">{{ $t('CONTACTS') }}</RouterLink>
    </div>
    <div class="footerText">
      <p>&copy; {{ $t('TOUT_DROIT_RESERVE') }}</p>
    </div>
  </footer>

</template>

<script>
import { RouterLink, RouterView } from 'vue-router';

export default {
  name: 'footerApp',
  data() {
    return {
      lang: ''
    };
  },
  mounted() {
    this.lang = localStorage.getItem('lang');
  }
};
</script>

<style lang="css" scoped>
  @import "./footer.css";
</style>


