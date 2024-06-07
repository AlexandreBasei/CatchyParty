<template>
  <div class="rulesCont">
    <h3>{{ $t('REGLES') }}</h3>
    <hr>
    <p>
      {{ $t('REGLES_TEXTE_1') }}
      <br><br>
      {{ $t('REGLES_TEXTE_2') }}
      <br><br>
      {{ $t('REGLES_TEXTE_3') }}
      <br><br>
      {{ $t('REGLES_TEXTE_4') }}
    </p>
  </div>
  <input type="submit" value="Suivant" class="submitBtn" style="margin: auto;">
  <img src="/img/extend/side2.svg" alt="symfony" class="symfony">
</template>

<script lang="ts">
export default ({
  name: 'rules-screen',
  components: {

  }
});
</script>

<style lang="css" scoped>
  @import "./rules-screen.css"
</style>