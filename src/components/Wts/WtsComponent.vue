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
          <div id="story">
            <p>{{ content }}</p>
          </div>
        </section>
      </main>
      <div class="songCont">
        <div class="song-cards">
          <div class="song-card" v-if="musics[0]" >
            <!-- <img src="../../assets/svg/image.svg" alt="image"> -->
            <p>{{ musics[0].title }}</p> 
            <p>{{ musics[0].artiste }}</p> 
            <p>{{ musics[0].album }}</p>
          </div>
          <div class="song-card" v-if="musics[1]">
            <!-- <img src="../../assets/svg/image.svg" alt="image"> -->
            <p>{{ musics[1].title }}</p>
            <p>{{ musics[1].artiste }}</p>
            <p>{{ musics[1].album }}</p>
          </div>
          <div class="song-card" v-if="musics[2]">
            <!-- <img src="../../assets/svg/image.svg" alt="image"> -->
            <p>{{ musics[2].title }}</p>
            <p>{{ musics[2].artiste }}</p>
            <p>{{ musics[2].album }}</p>
          </div>
          <div class="song-card" v-if="musics[3]">
            <!-- <img src="../../assets/svg/image.svg" alt="image"> -->
            <p>{{ musics[3].title }}</p>
            <p>{{ musics[3].artiste }}</p>
            <p>{{ musics[3].album }}</p>
          </div>
          <div class="song-card" v-if="musics[4]">
            <!-- <img src="../../assets/svg/image.svg" alt="image"> -->
            <p>{{ musics[4].title }}</p>
            <p>{{ musics[4].artiste }}</p>
            <p>{{ musics[4].album }}</p>
          </div>

        </div>
      </div>
      <input type="submit" value="Select" class="submitBtn" style="margin: auto;">
    </div>
  
    <!-- <img src="../../assets/svg/symfony.svg" alt="symfony" class="symfony"> -->
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
  props: {
    socket: {
      type: Object,
      required: true
    },
  },

  data() {
    return {
      content: '' as string,
      musics: [] as Music[]
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
    musics.sort(() => Math.random() - 0.5);
    this.musics = musics.slice(0, 5);
  }
});
</script>

<style lang="css" scoped>
@import './style.css';
</style>