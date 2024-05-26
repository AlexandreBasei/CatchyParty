<template>
    <div class="content2">
        <!-- Affichage du temps restant -->
        <div id="timer" v-show="showTimer">
            {{ $t('TEMPS_RESTANT') }} {{ timer }} {{ $t('SECONDES') }}
        </div>
        <main class="game-main" v-show="showGame">
            <section class="listen">
                <h3>Round {{ currentTurn + 1 }}</h3>
                <hr>
                <div id="listen">
                    <p>Écoutez...</p>
                    <div v-if="classico">{{ classico[Math.floor(Math.random() * 3)].title }}</div>
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
        <button @click="nextRound" disabled id="submit" class="submitBtn" style="margin: auto;"
            v-show="showGame">Valider la
            sélection</button>
        <p v-show="isSubmitDisabled && showGame">En attente des autres joueurs...</p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import io from 'socket.io-client';
import data from './data.json';

interface Classico {
    id: number;
    title: string;
    artiste: string;
    anecdote: string;
    date: string;
    url: string;
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
            isSubmitDisabled: false,
            showGame: false,
            showRewind: false,
            showTimer: true,
            showEnd: false,
            rewindTab: [] as any,
            rewindAll: [] as any,
            rewindCounter: 0 as number,
            selectedCard: 0 as number,
            currentTurn: 0 as number,
            maxTurns: 5,
            nextRoundCounter: 0 as number,
            turnDuration: 30000,
            timer: 30000,
        }
    },

    mounted() {
        if (this.player.host) {
            this.randomizeClassico();
        }

        this.socket.on("randomize", (classico: Classico[]) => {
            if (!this.player.host) {
                this.classico = classico;
            }
            console.log(this.classico);
            
            this.showGame = true;
        });

        this.socket.on("nextRound", (room: any) => {
            this.room = room;
            this.nextRoundCounter++;
            this.timer = this.turnDuration;

            if (this.room.players.length === this.nextRoundCounter && this.currentTurn < this.maxTurns) {
                this.randomizeClassico();

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
            setInterval(() => {
                setInterval(() => {
                    this.timer--;
                }, 1000);
            }, this.turnDuration);
        },
        randomizeClassico() {
            const classico: Classico[] = data.classico;
            classico.sort(() => Math.random() - 0.5);
            this.classico = classico.slice(0, 3);

            this.socket.emit("CLASSICO/randomize", this.classico, this.player.roomId);
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

        nextRound() {
            const submit: any = document.getElementById("submit");
            submit.disabled = true;
            this.isSubmitDisabled = true;

            const cards: any = document.querySelectorAll(".song-card");

            document.querySelector("iframe")?.remove;

            this.rewindTab.push({ username: this.player.username, music: cards[this.selectedCard].innerText });

            const afterSelectionDiv: any = document.querySelector(".after-selection");

            afterSelectionDiv.style.opacity = "0.3";
            afterSelectionDiv.style.pointerEvents = "all";

            this.socket.emit("CLASSICO/nextRound", this.player.roomId);
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