<template>
    <headerApp></headerApp>
    <div class="content">
          <section class="playersList">
              <h3>Players</h3>
              <div class="rect-container">
                <div class="colored-rectangle"></div>
            </div>
              <div class="playersContainer">
                  <div class="playerContainer">
                      <img class="player-icon" id="avatarImg" alt="player 1">
                      <p class="pseudoPlayer">Yannis</p>
                  </div>
                  <div class="playerContainer">
                      <img class="player-icon" id="avatarImg" alt="player 2">
                      <p class="pseudoPlayer">Yannis</p>
                  </div>
                  <div class="playerContainer">
                      <img class="player-icon" id="avatarImg" alt="player 3">
                      <p class="pseudoPlayer">Yannis</p>
                  </div>
              </div>
              <input type="submit" value="Inviter joueur" class="inviteBtn" style="margin: auto;">
          </section>
          <div class="content-2">
            <main class="game-main">
              <section class="description">
                <h3>Round 1</h3>
                <hr>
                <div id="test">
                  <p>{{ content }}</p> <!-- Liaison de la propriété content à l'élément <p> -->
                </div>
              </section>
            </main>
            <div class="songCont">
        <div class="song-cards">
          <div class="song-card" v-if="musics[0]">
            <img src="../../assets/svg/image.svg" alt="image">
            <p>{{ musics[0].album }}</p> <!-- Affiche le nom de l'album de la première musique -->
            <p>{{ musics[0].title }}</p> <!-- Affiche le titre de la première musique -->
            <p>{{ musics[0].artiste }}</p> <!-- Affiche le nom de l'artiste de la première musique -->
          </div>
          <div class="song-card" v-if="musics[1]">
            <img src="../../assets/svg/image.svg" alt="image">
            <p>{{ musics[1].album }}</p> <!-- Affiche le nom de l'album de la deuxième musique -->
            <p>{{ musics[1].title }}</p> <!-- Affiche le titre de la deuxième musique -->
            <p>{{ musics[1].artiste }}</p> <!-- Affiche le nom de l'artiste de la deuxième musique -->
          </div>
          <div class="song-card" v-if="musics[2]">
            <img src="../../assets/svg/image.svg" alt="image">
            <p>{{ musics[2].album }}</p> <!-- Affiche le nom de l'album de la troisième musique -->
            <p>{{ musics[2].title }}</p> <!-- Affiche le titre de la troisième musique -->
            <p>{{ musics[2].artiste }}</p> <!-- Affiche le nom de l'artiste de la troisième musique -->
          </div>

          </div>
        </div>
        <input type="submit" value="Select" class="submitBtn" style="margin: auto;">
      </div>
    </div>
  
    <img src="../../assets/svg/symfony.svg" alt="symfony" class="symfony">
    <!-- <div class="footer">
          <footerApp></footerApp>
      </div> -->
  </template>


<!-- //²Ici le JS (regarde les autres composants pour comprendre comment ça marche ou demande nous) -->
<script lang="ts">
import { defineComponent } from 'vue';
import data from './data.json';

// Permet de définir le type de chaques éléments du json
interface Situation {
  id: number;
  description: string;
}

interface Music {
  id: number;
  title: string;
  artiste: string;
  album: string;
}

export default defineComponent({
  name: 'WtsComponent',
  data() {
    return {
      content: '' as string,
      musics: [] as Music[] // Assurez-vous que musics est initialisé comme un tableau vide
    };
  },
  mounted() {
    // Obtenir une situation aléatoire
    const situations: Situation[] = data.situations;
    const randomSituation = situations[Math.floor(Math.random() * situations.length)];

    // Récupérer la description de la situation aléatoire
    this.content = randomSituation.description;

    // Obtenir la liste des musiques
    const musics: Music[] = data.musics;

    // Mélanger la liste de musiques pour obtenir un ordre aléatoire
    musics.sort(() => Math.random() - 0.5);

    // Assigner les trois premières musiques à la propriété musics pour chaque div song-card
    this.musics = musics.slice(0, 3);
  }
});
</script>

<style lang="scss or less">
    import './style.css';
</style>
