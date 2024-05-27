<template>
    <div class="content2">
        <section class="rewindAll" v-show="showRewind">
            <h1>REWIND</h1>
        </section>
        <main class="game-main" v-show="showGame">
            <section class="listen">
                <h3>Round {{ currentTurn + 1 }}</h3>
                <hr>
                <div id="timer" v-show="showTimer">
                    <p>{{ $t('TEMPS_RESTANT') }} {{ timer }} {{ $t('SECONDES') }}</p>
                    <p>{{ $t('TEMPS_RESTANT') }} {{ responseTimer }} {{ $t('SECONDES') }}</p>
                    <label for="volume-slider">Volume</label>
                    <input type="range" id="volume-slider" min="0" max="1" step="0.05" v-model="volume"
                        @input="setVolume" />
                </div>
                <div id="listen">
                    <p>Écoutez...</p>
                </div>
                <div id="anecdoteDiv" v-show="showResponse">
                    <h3>Réponse</h3>
                    <p id="response"></p>
                    <h3>Anecdote</h3>
                    <p id="anecdote"></p>
                </div>
            </section>
        </main>
        <div class="songCont" v-show="showGame">
            <div class="after-selection"></div>

            <div class="song-cards">

                <div class="song-card" v-if="classico[0]" @click="selectCard(0)">
                    <!-- <img src="../../assets/svg/image.svg" alt="image"> -->
                    <p>{{ classico[0].title }}</p>
                    <p>{{ classico[0].artiste }}</p>
                    <p>{{ classico[0].date }}</p>
                </div>

                <div class="song-card" v-if="classico[1]" @click="selectCard(1)">
                    <!-- <img src="../../assets/svg/image.svg" alt="image"> -->
                    <p>{{ classico[1].title }}</p>
                    <p>{{ classico[1].artiste }}</p>
                    <p>{{ classico[1].date }}</p>
                </div>
                <div class="song-card" v-if="classico[2]" @click="selectCard(2)">
                    <!-- <img src="../../assets/svg/image.svg" alt="image"> -->
                    <p>{{ classico[2].title }}</p>
                    <p>{{ classico[2].artiste }}</p>
                    <p>{{ classico[2].date }}</p>
                </div>

            </div>
        </div>
        <button @click="validateCard" disabled id="submit" class="submitBtn" style="margin: auto;"
            v-show="showGame">Valider la
            sélection</button>
        <p v-show="isSubmitDisabled && showGame">En attente des autres joueurs...</p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import io from 'socket.io-client';
import { Howl, Howler } from 'howler';
import data from './data.json';

interface Classico {
    id: number;
    title: string;
    artiste: string;
    anecdote: string;
    date: string;
}

export default defineComponent({
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
            classico: [] as Classico[],
            room: [] as any,
            currentSound: 0 as any,
            volume: 0.5 as number,
            isSubmitDisabled: false,
            showGame: false,
            showRewind: false,
            showResponse: false,
            showTimer: true,
            showEnd: false,
            rewindTab: [] as any,
            rewindAll: [] as any,
            rewindCounter: 0 as number,
            selectedCard: 0 as number,
            randomSong: 0 as number,
            currentTurn: 0 as number,
            maxTurns: 5,
            nextRoundCounter: 0 as number,
            turnDuration: 10,
            responseDuration: 10,
            timer: 30,
            responseTimer: 15,
            timerInterval: 0 as any,
            responseInterval: 0 as any,
        }
    },

    mounted() {
        if (this.player.host) {
            this.randomizeClassico();
        }

        this.socket.on("randomize", (classico: Classico[], randomSong: number) => {
            if (!this.player.host) {
                this.classico = classico;
                this.randomSong = randomSong;
            }

            const soundToPlay = this.classico[this.randomSong].id;
            this.playSound(soundToPlay);

            this.turnTimer();
            this.showGame = true;
        });

        this.socket.on("nextRound", (room: any) => {
            this.room = room;
            this.nextRoundCounter++;

            this.timer = this.turnDuration;

            if (this.room.players.length === this.nextRoundCounter && this.currentTurn < this.maxTurns) {
                if (this.player.host) {
                    this.randomizeClassico();
                }

                this.stopSound();

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
                this.stopSound();
                this.showRewind = true;
                this.socket.emit("CLASSICO/rewind", this.rewindTab, this.player);
            }
        });

        this.socket.on('CLASSICO/final rewind', (room: any) => {
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

        turnTimer() {
            this.clearIntervals();
            this.timer = this.turnDuration;
            this.showResponse = false;

            this.timerInterval = setInterval(() => {
                if (this.timer === 0) {
                    this.timer = this.turnDuration;
                    this.displayResponse();
                } else {
                    this.timer--;
                }
            }, 1000);
        },

        displayResponse() {
            this.clearIntervals();
            const classico = this.classico[this.randomSong];

            const title = document.getElementById("response")!;
            title.innerText = `${classico.title}, ${classico.artiste}, ${classico.title}, ${classico.date}`;

            const anecdote = document.getElementById("anecdote")!;
            anecdote.innerText = classico.anecdote;

            this.responseTimer = this.responseDuration;
            this.showResponse = true;

            this.responseInterval = setInterval(() => {
                if (this.responseTimer === 0) {
                    this.stopSound();
                    this.socket.emit("CLASSICO/nextRound", this.player.roomId);
                    this.turnTimer();
                } else {
                    this.responseTimer--;
                }
            }, 1000);
        },

        clearIntervals() {
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
            if (this.responseInterval) {
                clearInterval(this.responseInterval);
                this.responseInterval = null;
            }
        },

        playSound(note: number) {
            this.stopSound();
            // Charger et jouer le son correspondant à la note
            this.currentSound = new Howl({
                src: [`./musics/${note}.mp3`], // Chemin vers les fichiers audio locaux
                volume: 0.5
            });
            console.log(this.currentSound);

            this.currentSound.play();
        },

        stopSound() {
            // Arrêter le son en cours
            if (this.currentSound) {
                Howler.stop();
            }
        },

        setVolume() {
            if (this.currentSound) {
                this.currentSound.volume(this.volume);
            }
        },

        randomizeClassico() {
            const classico: Classico[] = data.classico;
            classico.sort(() => Math.random() - 0.5);
            this.classico = classico.slice(0, 3);
            console.log(this.classico);


            this.randomSong = Math.floor(Math.random() * 3);

            this.socket.emit("CLASSICO/randomize", this.classico, this.player.roomId, this.randomSong);
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

        validateCard() {
            const submit: any = document.getElementById("submit");
            submit.disabled = true;
            this.isSubmitDisabled = true;

            const cards: any = document.querySelectorAll(".song-card");

            let isFound;

            const currentSong = this.classico[this.randomSong].title + "\n\n" + this.classico[this.randomSong].artiste + "\n\n" + this.classico[this.randomSong].date;


            if (cards[this.selectedCard].innerText === currentSong) {
                console.log("OUIIIII");

            }
            else {
                console.log("NOOOON");

            }
            console.log(cards[this.selectedCard].innerText);
            console.log(currentSong);



            this.rewindTab.push({ username: this.player.username, music: cards[this.selectedCard].innerText });

            const afterSelectionDiv: any = document.querySelector(".after-selection");

            afterSelectionDiv.style.opacity = "0.3";
            afterSelectionDiv.style.pointerEvents = "all";
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
        },

        resetGame() {
            this.classico = [] as Classico[];
            this.currentTurn = 0 as number;
            this.maxTurns = 5;
            this.nextRoundCounter = 0 as number;
            this.room = [] as any;
            this.isSubmitDisabled = false;
            this.showGame = true;
            this.showEnd = false;
            this.rewindTab = [] as any;
            this.selectedCard = 0 as number;

            this.maxTurns--;

            if (this.player.host) {
                this.randomizeClassico();
            }

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
    }
})
</script>

<style lang="css" scoped>
@import url('./classico.css');
@import url('./classico-mobile.css');
</style>