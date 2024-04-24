<template>
  <footer>
    <div class="footerLinks">
      <RouterLink to="/about">A propos</RouterLink>
      <RouterLink to="/cgu">CGU</RouterLink>
      <RouterLink to="/contact">Contacts</RouterLink>
    </div>
    <div class="footerText">
      <p>&copy; 2024 The Socket Team. All rights reserved.</p>
    </div>
  </footer>

</template>

<script>
import { RouterLink, RouterView } from 'vue-router';

export default {
  name: 'footerApp'
};
</script>

<style lang="css" scoped>
  @import "./footer.css";
</style>


