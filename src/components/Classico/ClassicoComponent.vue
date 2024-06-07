<template>
    <div class="content2">
        <section v-show="showEnd">
            <h2>{{ $t('DEMARRER_JEU_SUIVANT') }}</h2>
        </section>
        <section class="rewindAll" v-show="showRewind">
            <div class="block">
                <h3>{{ $t('RESULTAT') }}</h3>
                <div v-for="(rewind, index) in rewindAll" :key="index" 
                    :class="['player-score', { 'first-player': rewind.foundCount === maxScore }]">
                    <span>{{ rewind.username }}</span>
                    <p>{{ $t('MUSIQUES_TROUVEE') }}{{ rewind.foundCount }} / {{ maxTurns + 1 }}</p>
                </div>
            </div>

            
            <button v-if="player.host" @click="endgame()">{{ $t('TERMINER_LA_MANCHE') }}</button>
        </section>
        <div id="timer-container" v-show="showTimer">
            <div>
                <label for="volume-slider">{{ $t('VOLUME') }}</label>
                <input type="range" id="volume-slider" min="0" max="1" step="0.05" v-model="volume"
                    @input="setVolume" />
            </div>
            <div class="timer flow">
                <p v-show="showRoundTimer">{{ $t('TEMPS_RESTANT') }} {{ timer }} {{ $t('SECONDES') }}</p>
                <p v-show="showResponseTimer">{{ $t('RESPONSE TIMER') }} {{ responseTimer }} {{ $t('SECONDES') }}</p>
            </div>
        </div>
        <main class="game-main listen" v-show="showGame">
            <h3>{{ $t('ROUND') }} {{ currentTurn + 1 }} / {{ maxTurns + 1 }}</h3>
            
            <div id="listen" v-show="showListen">
                <p>{{ $t('ECOUTE') }}</p>
            </div>
            <div id="anecdoteDiv" v-show="showResponse">
                <h3>{{ $t('REPONSE') }}</h3>
                <p id="response"></p>
                <h3>{{ $t('ANECDOTE') }}</h3>
                <p id="anecdote"></p>
            </div>
        </main>
        <div class="songCont" v-show="showCards">
            <div class="after-selection"></div>

            <div class="song-cards">

                <div class="song-card" v-if="classico[0]" @click="selectCard(0)">
                    <!-- <img src="../../assets/svg/image.svg" alt="image"> -->
                    <h3>{{ classico[0].title }}</h3>
                    <p>{{ classico[0].artiste }}</p>
                    <p>{{ classico[0].date }}</p>
                </div>

                <div class="song-card" v-if="classico[1]" @click="selectCard(1)">
                    <!-- <img src="../../assets/svg/image.svg" alt="image"> -->
                    <h3>{{ classico[1].title }}</h3>
                    <p>{{ classico[1].artiste }}</p>
                    <p>{{ classico[1].date }}</p>
                </div>
                <div class="song-card" v-if="classico[2]" @click="selectCard(2)">
                    <!-- <img src="../../assets/svg/image.svg" alt="image"> -->
                    <h3>{{ classico[2].title }}</h3>
                    <p>{{ classico[2].artiste }}</p>
                    <p>{{ classico[2].date }}</p>
                </div>

            </div>
        </div>
        <button @click="validateCard" disabled id="submit" class="submitBtn" v-show="showCards">{{ $t('VALIDER') }}</button>
        <p v-show="isSubmitDisabled && showCards">{{ $t('EN_ATTENTE_DE_JOUEURS') }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import io from 'socket.io-client';
import { Howl, Howler } from 'howler';
import data from './data.json';
import dataEn from './data-en.json';

interface Classico {
    id: number;
    title: string;
    artiste: string;
    anecdote: string;
    date: string;
}

interface Rewind {
    username: string;
    foundCount: number;
    noFoundCount: number;
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
            showCards: true,
            showRewind: false,
            showResponse: false,
            showListen: true,
            showTimer: true,
            showRoundTimer: true,
            showResponseTimer: false,
            showEnd: false,
            rewindObj: {} as Rewind,
            rewindAll: [] as any,
            rewindCounter: 0 as number,
            selectedCard: -1 as number,
            randomSong: 0 as number,
            currentTurn: 0 as number,
            maxTurns: 1,
            nextRoundCounter: 0 as number,
            turnDuration: 10,
            responseDuration: 10,
            timer: 30,
            responseTimer: 15,
            timerInterval: 0 as any,
            responseInterval: 0 as any,
            foundCount: 0 as number,
            noFoundCount: 0 as number,
            validated: false,
            lang: '',
        } //Ne pas oublier de changer le maxTurn aussi dans resetGame
    },

    computed: {
        sortedRewindAll() {
            return this.rewindAll.slice().sort((a: any, b: any) => b.foundCount - a.foundCount);
        },
        maxScore() {
            return Math.max(...this.rewindAll.map((player: any) => player.foundCount));
        }
    },

    mounted() {
        const getLang = localStorage.getItem('lang');
        if(getLang){
            this.lang = getLang;
        } else{
            this.lang = 'fr';
            localStorage.setItem('lang',this.lang);
        }

        this.maxTurns--;

        this.socket.on("CLASSICO/start game", () => {
            if (this.player.host) {
                console.log("START GAME");
                
                this.randomizeClassico();
            }
        });

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

        this.socket.on("CLASSICO/nextRound", (room: any) => {
            this.room = room;
            this.nextRoundCounter++;
            this.selectedCard = -1;
            this.validated = false;

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
                this.nextRoundCounter = 0;
            }

            if (this.room.players.length === this.nextRoundCounter && this.currentTurn === this.maxTurns) {
                this.showGame = false;
                this.showTimer = false;
                this.showCards = false;
                this.clearIntervals();
                this.stopSound();
                this.showRewind = true;
                this.socket.emit("CLASSICO/rewind", this.rewindObj, this.player);
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

        this.socket.on('CLASSICO/endgame', () => {
            if (!this.player.host) {
                this.endgame();
            }
        });

    },

    methods: {
        turnTimer() {
            this.showRoundTimer = true;
            this.showResponseTimer = false;
            this.showListen = true;
            this.showCards = true;
            this.clearIntervals();
            this.timer = this.turnDuration;
            this.showResponse = false;

            this.timerInterval = setInterval(() => {
                if (this.timer === 0) {
                    this.timer = this.turnDuration;
                    if (!this.validated) {
                        this.validateCard();
                    }
                    this.displayResponse();
                } else {
                    this.timer--;
                }
            }, 1000);
        },

        displayResponse() {
            this.clearIntervals();
            const classico = this.classico[this.randomSong];

            this.showRoundTimer = false;
            this.showCards = false;
            this.showListen = false;
            this.showResponseTimer = true;
            const title = document.getElementById("response")!;
            title.innerText = `${classico.title}, ${classico.artiste}, ${classico.date}`;

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
            if(this.lang == "fr"){
                const classico: Classico[] = data.classico;
                classico.sort(() => Math.random() - 0.5);
                this.classico = classico.slice(0, 3);

                this.randomSong = Math.floor(Math.random() * 3);

                this.socket.emit("CLASSICO/randomize", this.classico, this.player.roomId, this.randomSong);
            }else{
                const classico: Classico[] = dataEn.classico;
                classico.sort(() => Math.random() - 0.5);
                this.classico = classico.slice(0, 3);

                this.randomSong = Math.floor(Math.random() * 3);

                this.socket.emit("CLASSICO/randomize", this.classico, this.player.roomId, this.randomSong);
            }
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

            const currentSong = this.classico[this.randomSong].title + "\n\n" + this.classico[this.randomSong].artiste + "\n\n" + this.classico[this.randomSong].date;

            if (this.selectedCard === -1) {
                this.noFoundCount++;
            }
            else {
                if (cards[this.selectedCard].innerText === currentSong) {
                    this.foundCount++;
                }
                else {
                    this.noFoundCount++;
                }
            }

            this.rewindObj = { username: this.player.username, foundCount: this.foundCount, noFoundCount: this.noFoundCount };

            const afterSelectionDiv: any = document.querySelector(".after-selection");

            afterSelectionDiv.style.opacity = "0.3";
            afterSelectionDiv.style.pointerEvents = "all";
            this.validated = true;
        },

        endgame() {
            this.showEnd = true;
            this.showGame = false;
            this.showRewind = false;
            setTimeout(() => {
                if (this.player.host) {
                    this.socket.emit("CLASSICO/endgame", this.player.roomId);
                }
                this.resetClassicoGame();
            }, 3000)
        },

        resetClassicoGame() {
            console.log("RESET CLASSICO");
            this.clearIntervals();
            this.classico = [] as Classico[];
            this.room = [] as any;
            this.currentSound = 0 as any;
            this.volume = 0.5 as number;
            this.isSubmitDisabled = false;
            this.showGame = false;
            this.showCards = true;
            this.showRewind = false;
            this.showResponse = false;
            this.showListen = true;
            this.showTimer = true;
            this.showRoundTimer = true;
            this.showResponseTimer = false;
            this.showEnd = false;
            this.rewindObj = {} as Rewind;
            this.rewindAll = [] as any;
            this.rewindCounter = 0 as number;
            this.selectedCard = -1 as number;
            this.randomSong = 0 as number;
            this.currentTurn = 0 as number;
            this.maxTurns = 1;
            this.nextRoundCounter = 0 as number;
            this.turnDuration = 10;
            this.responseDuration = 10;
            this.timer = 30;
            this.responseTimer = 15;
            this.timerInterval = 0 as any;
            this.responseInterval = 0 as any;
            this.foundCount = 0 as number;
            this.noFoundCount = 0 as number;
            this.validated = false;

            this.maxTurns--;

            // if (this.player.host) {
            //     this.randomizeClassico();
            // }

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