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
        <div class="content-2">
          <main class="game-main">
            <img src="../../assets/svg/partinies/vilo.svg" class="vilo">
            <img src="../../assets/svg/partinies/mus.svg" class="mus">
            <section class="description">
              <h3>{{ $t('ROUND_1') }}</h3>
              <hr>
              <p>Blabla</p>
            </section>
          </main>
          <div class="songCont">
      <div class="song-cards">
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
    name: 'game1_screen',
    components: {

    }
  });
</script>

<style lang="css" scoped>
  @import './game1-screen.css';
</style>
