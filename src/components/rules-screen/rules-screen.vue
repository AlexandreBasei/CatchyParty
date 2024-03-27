<template>
    <headerApp></headerApp>
  <div class="rulesCont">
    <h3>Rules</h3>
    <hr>
    <p>
      Welcome to the world ..... The goal of the game, choose the best card corresponding to the situation described.
    <br><br>
      Use the title, the name of the album or the artist to be the funniest of your friends.
    <br><br>
      You must be as creative as possible in order to be selected to be the manager (the one who decides who is the funniest).
    <br><br>
      Score as many points as possible to hope to earn the gold note and add it to your collection.
    </p>
  </div>
  <input type="submit" value="Suivant" class="submitBtn" style="margin: auto;">
  <img src="../../assets/svg/symfony.svg" alt="symfony" class="symfony">
</template>
<style lang="scss or less">
    import './rules-screen.css';
</style>
<script lang="ts">
import headerApp from '../header/header.vue'; 

export default({
  name: 'rules-screen',
  components: {
    headerApp,
  }
});
</script>