<template>
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

<script lang="ts">
export default ({
  name: 'ending-screen',
  components: {
    
  }
});
</script>

<style scoped>
.rewardCont {
  display: flex;
}

.rewards {
  display: grid;
  width: 50%;
  justify-content: center;
}

.secRewards {
  display: flex;
  gap: 10vh;
}

.secRewards p {
  align-items: center;
  display: flex;
  justify-content: center;
}

.secRewardsCont {
  display: grid;
  justify-content: center;
  gap: 2vh;
}

.textP {
  margin: 5vh 0 !important;
}

@media only screen and (max-width: 600px) {

  .submitBtn {
    margin-bottom: 2vh !important;
    margin-top: 2vh !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }

}
</style>