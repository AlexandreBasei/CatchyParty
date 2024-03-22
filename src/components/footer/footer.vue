<template>
    <footer>
      <div class="footerLinks">
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/cgu">CGU</RouterLink>
        <RouterLink to="/contact">Contact</RouterLink>
      </div>
    </footer>
    <div class="footerText"><p>&copy; 2024 The Socket Team. All rights reserved.</p></div>
  </template>
  
  <script>
  import { RouterLink, RouterView } from 'vue-router';

  export default {
    name: 'footerApp'
  };
  </script>
  
  <style lang="scss or less">
    import './footer.css';
  </style>
  