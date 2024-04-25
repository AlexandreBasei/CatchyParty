<template>
  <div class="content">
        <section class="playersList">
            <h3>{{ $t('JOUEURS') }}</h3>
            <div class="playersContainer">
                <div class="playerContainer">
                    <img class="player-icon" id="avatarImg" alt="player 1">
                    <p id="pseudoPlayer1"></p>
                </div>
            </div>
        </section>
        <img src="../../assets/svg/chrono.svg" alt="chrono" class="chrono">
        <div class="content-2">
          <h2>{{ $t('SELECTION_DU_MANAGER') }}</h2>
          <main class="game-main">
            <section class="description">
              <h3>{{ $t('ROUND_1') }}</h3>
              <hr>
              <p>Blabla</p>
            </section>
          </main>
          <div class="songCont">
      <div class="song-cards">
          <div>
            <img src="../../assets/svg/icons/crownny.svg" alt="crown">
            <div class="song-card" id="manager">
              <img src="../../assets/svg/icons/image.svg" alt="image">
              <p>{{ $t('TITRE_DE_L_ALBUM') }}</p>
              <br>
              <p>{{ $t('TITRE_DE_LA_MUSIQUE') }}</p>
              <br>
              <p>{{ $t('NOM_DE_L_ARTISTE') }}</p>
            </div>
          </div>
          <div class="song-card">
            <img src="../../assets/svg/icons/image.svg" alt="image">
            <p>{{ $t('TITRE_DE_L_ALBUM') }}</p>
            <br>
            <p>{{ $t('TITRE_DE_LA_MUSIQUE') }}</p>
            <br>
            <p>{{ $t('NOM_DE_L_ARTISTE') }}</p>
          </div>
          <div class="song-card">
            <img src="../../assets/svg/icons/image.svg" alt="image">
            <p>{{ $t('TITRE_DE_L_ALBUM') }}</p>
            <br>
            <p>{{ $t('TITRE_DE_LA_MUSIQUE') }}</p>
            <br>
            <p>{{ $t('NOM_DE_L_ARTISTE') }}</p>
          </div>
        </div>
        <input type="submit" value="Select" class="submitBtn" style="margin: auto;">
      </div>
    </div>
  </div>

  <img src="../../assets/svg/extend/side2.svg" alt="symfony" class="symfony">
</template>

<script lang="ts"> 
export default({
  name: 'validation_screen',
  components: {

  }
});
</script>

<style lang="css" scoped>
    @import './validation-screen.css';
</style>