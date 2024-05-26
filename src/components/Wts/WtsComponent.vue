<template>
  <div class="content-2">
    <section v-show="showEnd">
      <h2>Round terminé !</h2>
    </section>
    <section class="rewindAll" v-show="showRewind">
      <div class="rewind" v-for="(rewinds, index) in rewindAll" :key="index" v-bind:id="'joueur' + index">
        <h2>Choix de {{ rewinds[index].username }}</h2>
        <div class="rewind2" v-for="(rewind, index2) in rewinds" :key="index2">
          <h3>Situation :</h3>
          <p>{{ rewind.situation }}</p>
          <h3>Musique choisie :</h3>
          <p>{{ rewind.music }}</p>
        </div>
        <button @click="rewindBtns(0, index)">{{ $t('AFFICHER_LE_PRECEDENT') }}</button>
        <button @click="rewindBtns(1, index)">{{ $t('AFFICHER_LE_SUIVANT') }}</button>
        <button v-if="player.host" @click="endgame()">{{ $t('TERMINER_LA_MANCHE') }}</button>
      </div>
    </section>
    <main class="game-main" v-show="showGame">
      <section class="description">
        <h3>Round {{ currentTurn + 1 }}</h3>
        <hr>
        <div id="story">
          <p>{{ content }}</p>
        </div>
      </section>
    </main>
    <div class="songCont" v-show="showGame">
      <div class="after-selection"></div>

      <div class="song-cards">
        <div class="song-card" v-if="musics[0]" @click="selectCard(0)">
          <!-- <img src="../../assets/svg/image.svg" alt="image"> -->
          <p>{{ musics[0].title }}</p>
          <p>{{ musics[0].artiste }}</p>
          <p>{{ musics[0].album }}</p>
        </div>
        <div class="song-card" v-if="musics[1]" @click="selectCard(1)">
          <!-- <img src="../../assets/svg/image.svg" alt="image"> -->
          <p>{{ musics[1].title }}</p>
          <p>{{ musics[1].artiste }}</p>
          <p>{{ musics[1].album }}</p>
        </div>
        <div class="song-card" v-if="musics[2]" @click="selectCard(2)">
          <!-- <img src="../../assets/svg/image.svg" alt="image"> -->
          <p>{{ musics[2].title }}</p>
          <p>{{ musics[2].artiste }}</p>
          <p>{{ musics[2].album }}</p>
        </div>
        <div class="song-card" v-if="musics[3]" @click="selectCard(3)">
          <!-- <img src="../../assets/svg/image.svg" alt="image"> -->
          <p>{{ musics[3].title }}</p>
          <p>{{ musics[3].artiste }}</p>
          <p>{{ musics[3].album }}</p>
        </div>
        <div class="song-card" v-if="musics[4]" @click="selectCard(4)">
          <!-- <img src="../../assets/svg/image.svg" alt="image"> -->
          <p>{{ musics[4].title }}</p>
          <p>{{ musics[4].artiste }}</p>
          <p>{{ musics[4].album }}</p>
        </div>

      </div>
    </div>
    <button @click="nextRound" disabled id="submit" class="submitBtn" style="margin: auto;" v-show="showGame">Valider la
      sélection</button>
    <p v-show="isSubmitDisabled && showGame">En attente des autres joueurs...</p>
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
    player: {
      type: Object,
      required: true
    },
  },

  data() {
    return {
      content: '' as string,
      musics: [] as Music[],
      currentTurn: 0 as number,
      maxTurns: 5,
      situations: data.situations as Situation[],
      nextRoundCounter: 0 as number,
      room: [] as any,
      isSubmitDisabled: false,
      showGame: true,
      showRewind: false,
      showEnd: false,
      rewindTab: [] as any,
      rewindAll: [] as any,
      rewindCounter: 0 as number,
      selectedCard: 0 as number,
    };
  },
  mounted() {
    this.resetGame();
    this.randomizeSituation();
    this.randomizeMusics();
    this.maxTurns--;

    this.socket.on("nextRound", (room: any) => {
      this.room = room;
      this.nextRoundCounter++;

      if (this.room.players.length === this.nextRoundCounter && this.currentTurn < this.maxTurns) {
        this.randomizeSituation();
        this.randomizeMusics();

        const cards: any = document.querySelectorAll(".song-card");

        cards.forEach((card: any) => {
          card.style.backgroundColor = "#19647e";
          card.style.color = "#f9fafa";

        });

        const submit: any = document.getElementById("submit");
        submit.disabled = false;
        this.isSubmitDisabled = false;
        const afterSelectionDiv: any = document.querySelector(".after-selection");

        afterSelectionDiv.style.opacity = "0";
        afterSelectionDiv.style.pointerEvents = "none";

        this.currentTurn++;
        console.log("Next round");
        this.nextRoundCounter = 0;
      }

      if (this.room.players.length === this.nextRoundCounter && this.currentTurn === this.maxTurns) {
        this.showGame = false;
        // this.showRewind = true;
        this.socket.emit("WTS/rewind", this.rewindTab, this.player);
      }
    });

    this.socket.on('WTS/final rewind', (room: any) => {
      this.rewindAll = room.rewind;

      this.rewindCounter++;
      
      if (this.rewindCounter === room.rewind.length) {
        this.showRewind = true;
        this.socket.emit("clear rewind", this.player.roomId);
      }

    });

    this.socket.on('endgame', () => {
      if (!this.player.host) {
        this.endgame();
      }
    });

  },
  methods: {
    rewindBtns(order: number, id: number) {
      const rewindDivs = document.querySelectorAll('.rewind');

      rewindDivs.forEach(div => {
        if ("joueur" + id === div.id) {
          if (order) {
            const nextDiv = document.getElementById('joueur' + (id + 1));

            if (nextDiv instanceof HTMLElement && div instanceof HTMLElement) {
              div.style.display = "none";
              nextDiv.style.display = "block";
            }
          }
          else {
            const previousDiv = document.getElementById('joueur' + (id - 1));
            if (previousDiv instanceof HTMLElement && div instanceof HTMLElement) {
              div.style.display = "none";
              previousDiv.style.display = "block";
            }
          }
        }
      });
    },
    resetGame() {
      this.content = '' as string;
      this.musics = [] as Music[];
      this.currentTurn = 0 as number;
      this.maxTurns = 5;
      this.situations = data.situations as Situation[];
      this.nextRoundCounter = 0 as number;
      this.room = [] as any;
      this.isSubmitDisabled = false;
      this.showGame = true;
      this.showEnd = false;
      this.rewindTab = [] as any;
      this.selectedCard = 0 as number;

      this.maxTurns--;
      this.randomizeSituation();
      this.randomizeMusics();

      const cards: any = document.querySelectorAll(".song-card");

      cards.forEach((card: any) => {
        card.style.backgroundColor = "#19647e";
        card.style.color = "#f9fafa";

      });

      const submit: any = document.getElementById("submit");
      submit.disabled = false;
      this.isSubmitDisabled = false;
      const afterSelectionDiv: any = document.querySelector(".after-selection");

      afterSelectionDiv.style.opacity = "0";
      afterSelectionDiv.style.pointerEvents = "none";
    },

    selectCard(number: number) {
      const cards: any = document.querySelectorAll(".song-card");

      cards.forEach((card: any) => {
        card.style.backgroundColor = "#19647e";
        card.style.color = "#f9fafa";

      });
      cards[number].style.backgroundColor = "#f4d35e";
      cards[number].style.color = "#161617";

      const submit: any = document.getElementById("submit");
      submit.disabled = false;
      this.selectedCard = number;
    },
    // Obtenir une situation aléatoire
    randomizeSituation() {
      const randomSituation = this.situations[Math.floor(Math.random() * this.situations.length)];

      // Récupérer la description de la situation aléatoire
      this.content = randomSituation.description;
    },

    randomizeMusics() {
      const musics: Music[] = data.musics;
      musics.sort(() => Math.random() - 0.5);
      this.musics = musics.slice(0, 5);
    },

    nextRound() {
      const submit: any = document.getElementById("submit");
      submit.disabled = true;
      this.isSubmitDisabled = true;

      const cards: any = document.querySelectorAll(".song-card");

      this.rewindTab.push({ username: this.player.username, situation: this.content, music: cards[this.selectedCard].innerText });

      const afterSelectionDiv: any = document.querySelector(".after-selection");

      afterSelectionDiv.style.opacity = "0.3";
      afterSelectionDiv.style.pointerEvents = "all";

      this.socket.emit("WTS/nextRound", this.player.roomId);
    },

    endgame() {
      this.showEnd = true;
      this.showGame = false;
      this.showRewind = false;
      setTimeout(() => {
        if (this.player.host) {
          this.socket.emit("endgame", this.player.roomId);
        }
        this.resetGame();
      }, 3000)
    }
  }
});
</script>

<style lang="css" scoped>
@import './style.css';
</style>