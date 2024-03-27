<template>
<headerApp></headerApp>
  <div class="content">
        <section class="playersList">
            <h3>Winner</h3>
            <hr>
          <div class="rewardCont">
            <div class="rewards">
              <img src="../../assets/svg/couronne.svg" alt="crown">
              <img src="../../assets/svg/icon.svg" alt="icon">
            </div>
            <div>
              <p>New gold note for $NAME</p>
              <img src="../../assets/trophee.png">
            </div>
          </div>
          <p class="textP">Lyric of music</p>
          <div class="secRewardsCont">
            <div class="secRewards">
              <div class="players">
                <img src="../../assets/svg/icon.svg" alt="icon">
                <p>Name</p>
              </div>
              <p>Score</p>
            </div>
            <div class="secRewards">
              <div class="players">
                <img src="../../assets/svg/icon.svg" alt="icon">
                <p>Name</p>
              </div>
              <p>Score</p>
            </div>
            <div class="secRewards">
              <div class="players">
                <img src="../../assets/svg/icon.svg" alt="icon">
                <p>Name</p>
              </div>
              <p>Score</p>
            </div>
          </div>
        </section>
        <input type="submit" value="Replay" class="submitBtn" style="margin: auto;">
        <input type="submit" value="Back" class="submitBtn" style="margin: auto;">
  </div>

  <img src="../../assets/svg/symfony.svg" alt="symfony" class="symfony">
</template>
<style lang="scss or less">
    import './ending-screen.css';
</style>
<script lang="ts">
  import headerApp from '../header/header.vue'; 
export default({
  name: 'ending-screen',
  components: {
    headerApp,
  }
});
</script>