<template>
  <footer>
    <div class="footerLinks">
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/cgu">CGU</RouterLink>
      <RouterLink to="/contact">Contact</RouterLink>
    </div>
  </footer>
  <div class="footerText">
    <p>&copy; 2024 The Socket Team. All rights reserved.</p>
  </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router';

export default {
  name: 'footerApp'
};
</script>

<style scoped>
    footer{
    /* position: fixed;
    left: 0;
    bottom: 20px; */
    width: 100%;
}

footer p{
    color: var(--white);
}

.footerLinks{
    display: flex;
    text-align: center;
    padding: 0 10%;
}

.footerLinks a{
    flex: 0 0 33%;
    text-decoration: none;
}

.footerText{
    /* position: fixed;
    left: 0;
    bottom: 0; */
    width: 100%; 
    text-align: center;
}

.footerText p{
    font-size: 0.7em;
}
  </style>