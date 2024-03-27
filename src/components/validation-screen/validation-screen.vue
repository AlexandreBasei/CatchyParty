<template>
  <headerApp></headerApp>
  <div class="content">
        <section class="playersList">
            <h3>Players</h3>
            <div class="playersContainer">
                <div class="playerContainer">
                    <img class="player-icon" id="avatarImg" alt="player 1">
                    <p id="pseudoPlayer1"></p>
                </div>
            </div>
        </section>
        <img src="../../assets/svg/Chronomètre.svg" alt="chrono" class="chrono">
        <div class="content-2">
          <h2>Manager selection</h2>
          <main class="game-main">
            <section class="description">
              <h3>Round 1</h3>
              <hr>
              <p>Blabla</p>
            </section>
          </main>
          <div class="songCont">
      <div class="song-cards">
          <div>
            <img src="../../assets/svg/couronne.svg" alt="crown">
            <div class="song-card" id="manager">
              <img src="../../assets/svg/image.svg" alt="image">
              <p>Album title</p>
              <br>
              <p>Music title</p>
              <br>
              <p>Artist's name</p>
            </div>
          </div>
          <div class="song-card">
            <img src="../../assets/svg/image.svg" alt="image">
            <p>Album title</p>
            <br>
            <p>Music title</p>
            <br>
            <p>Artist's name</p>
          </div>
          <div class="song-card">
            <img src="../../assets/svg/image.svg" alt="image">
            <p>Album title</p>
            <br>
            <p>Music title</p>
            <br>
            <p>Artist's name</p>
          </div>
        </div>
        <input type="submit" value="Select" class="submitBtn" style="margin: auto;">
      </div>
    </div>
  </div>

  <img src="../../assets/svg/symfony.svg" alt="symfony" class="symfony">
  <!-- <div class="footer">
        <footerApp></footerApp>
    </div> -->
</template>
<style lang="scss or less">
    import './validation-screen.css';
</style>
<script lang="ts">
    /* import footerApp from '../footer/footer.vue'; */
    import headerApp from '../header/header.vue'; 
export default({
  name: 'validation_screen',
  components: {
    /* footerApp, */
    headerApp,
  }
});
</script>