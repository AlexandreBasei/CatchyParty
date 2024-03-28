<template>
  <div class="bg">
    <h1>Listen ...</h1>
  </div>
</template>

<script lang="ts">

export default ({
  name: 'listen-screen',
  components: {

  }
});
</script>

<style scoped>
:root {
  --primary: #28AFB0;
  --secondary: #FF570A;
  --tertiary: #19647E;
  --quaternary: #F4D35E;
  --quinary: #14121A;

  --black: #14080E;
  --white: #FFFFFF;
}

h1 {
  color: var(--secondary);
  align-items: center;
  display: flex;
  justify-content: center;
  height: 100vh;
}

.bg {
  /* background: url('/img/Ecran-Ecoute.png'); */
}
</style>