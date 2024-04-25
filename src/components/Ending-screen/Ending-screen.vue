<template>
  <div class="content">
    <section class="playersList">
      <h3>{{ $t('GAGNANT') }}</h3>
      <hr>
      <div class="rewardCont">
        <div class="rewards">
          <img src="../../assets/svg/icons/crownny.svg" alt="crown">
          <img src="../../assets/svg/icons/icon-profile.svg" alt="icon">
        </div>
        <div>
          <p>{{ $t('NOTE_D_OR') }}$NAME</p>
          <img src="../../assets/svg/trophy.png">
        </div>
      </div>
      <p class="textP">{{ $t('PAROLES_DE_LA_MUSIQUE') }}</p>
      <div class="secRewardsCont">
        <div class="secRewards">
          <div class="players">
            <img src="../../assets/svg/icons/icon-profile.svg" alt="icon">
            <p>{{ $t('NOM') }}</p>
          </div>
          <p>{{ $t('SCORE') }}</p>
        </div>
        <div class="secRewards">
          <div class="players">
            <img src="../../assets/svg/icons/icon-profile.svg" alt="icon">
            <p>{{ $t('NOM') }}</p>
          </div>
          <p>{{ $t('SCORE') }}</p>
        </div>
        <div class="secRewards">
          <div class="players">
            <img src="../../assets/svg/icons/icon-profile.svg" alt="icon">
            <p>{{ $t('NOM') }}</p>
          </div>
          <p>{{ $t('SCORE') }}</p>
        </div>
      </div>
    </section>
    <input type="submit" value="Replay" class="submitBtn" style="margin: auto;">
    <input type="submit" value="Back" class="submitBtn" style="margin: auto;">
  </div>

  <img src="../../assets/svg/extend/side2.svg" alt="symfony" class="symfony">
</template>

<script lang="ts">
export default ({
  name: 'ending-screen',
  components: {
    
  }
});
</script>

<style lang="css" scoped>
  @import "./ending-screen.css"
</style>