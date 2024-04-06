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
      You must be as creative as possible in order to be selected to be the manager (the one who decides who is the
      funniest).
      <br><br>
      Score as many points as possible to hope to earn the gold note and add it to your collection.
    </p>
  </div>
  <input type="submit" value="Suivant" class="submitBtn" style="margin: auto;">
  <img src="/img/symfony.svg" alt="symfony" class="symfony">
</template>

<script lang="ts">
import headerApp from '../header/header.vue';

export default ({
  name: 'rules-screen',
  components: {
    headerApp,
  }
});
</script>

<style scoped>
.rulesCont{
    background: var( --tertiary);
    border-radius: var(--borderradius);
    margin: 2vh;
    padding: 2vh;
}

.rulesCont p{
    text-align: left;
}

.submitBtn{
    margin-top: 5vh !important;
}

@media only screen and (min-width: 1000px) {
    .rulesCont p{
        text-align: center;
    }

    .rulesCont{
        background: var( --tertiary);
        border-radius: var(--borderradius);
        margin: auto;
        padding: 2vh;
        width: 100vh;
    }
    
}


</style>