<template>
    <div>
        <div id="timer">
            Temps restant : {{ remainingTime }} secondes
        </div>
        <div class="main-game" v-show="showMainGame">
            <div id="piano">
                <div class="key" data-note="A0" @click="playSound('A0')" draggable="true">A0</div>
                <div class="key" data-note="A1" @click="playSound('A1')" draggable="true">A1</div>
                <div class="key" data-note="A2" @click="playSound('A2')" draggable="true">A2</div>
                <div class="key" data-note="B0" @click="playSound('B0')" draggable="true">B0</div>
                <div class="key" data-note="B1" @click="playSound('B1')" draggable="true">B1</div>
                <div class="key" data-note="B2" @click="playSound('B2')" draggable="true">B1</div>
                <div class="key" data-note="C1" @click="playSound('C1')" draggable="true">C1</div>
                <div class="key" data-note="C2" @click="playSound('C2')" draggable="true">C2</div>
                <div class="key" data-note="C3" @click="playSound('C3')" draggable="true">C3</div>
                <div class="key" data-note="D1" @click="playSound('D1')" draggable="true">D1</div>
                <div class="key" data-note="D2" @click="playSound('D2')" draggable="true">D2</div>
                <div class="key" data-note="D3" @click="playSound('D3')" draggable="true">D3</div>
                <div class="key" data-note="E1" @click="playSound('E1')" draggable="true">E1</div>
                <div class="key" data-note="E2" @click="playSound('E2')" draggable="true">E2</div>
            </div>
            <div id="note-container"></div>
            <button id="play">Play</button>
        </div>
        <div class="after-game" v-show="showAfterGame">
            <button id="play">AFTER ROUND</button>
        </div>
        <div class="end-game" v-show="showEndGame">
            <button id="play">END GAME</button>
        </div>
        <div class="Waiting-game" v-show="showWaitingGame">
            <button @click="startGame" v-show="!showMainGame && !showAfterGame && !showEndGame">Lancer la
                partie</button>
        </div>
    </div>

</template>

<script lang="ts">

import './style.css';

import { defineComponent, ref, onMounted } from 'vue';
import jsonData from '../../assets/artists.json';
import io from 'socket.io-client';
import { Howl } from 'howler';

interface Notes {
    id: string,
    note: string,
    duration: number,
    interval: number,
}

export default defineComponent({
    //Ici les variables utilisées dans le DOM
    data() {
        return {
            sounds: {} as Record<string, Howl>,
            notesDuration: [] as Notes[],
            socket: io('http://localhost:3000'),
            showMainGame: false,
            showAfterGame: false,
            showEndGame: false,
            showWaitingGame: true,
            currentRound: 0,
            maxRounds: 3,
            showTimer: false,
            remainingTime: 0,
            roundDuration: 10, // Durée de chaque tour en secondes
            interRoundDuration: 30,
            timerInterval: 0,
            RoundPassed: false,
        }
    },
    // Ici tout le code procédural
    mounted() {
        const keys = document.querySelectorAll(".key");
        const noteContainer = document.getElementById("note-container")!;

        keys.forEach((key) => {
            key.addEventListener("dragstart", (event) => {
                if (event instanceof DragEvent) {
                    event.dataTransfer?.setData("text/plain", (event.target as HTMLElement).dataset.note || "");
                }
            });
        });

        noteContainer.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

        noteContainer.addEventListener("drop", (event) => {
            event.preventDefault();
            if (event instanceof DragEvent) {
                const note = event.dataTransfer?.getData("text/plain") || "";
                const noteElement = document.createElement("div");
                noteElement.id = this.noteID();
                noteElement.className = "note";
                noteElement.textContent = note;
                noteElement.dataset.duration = "1"; // Default duration
                const durationInput = document.createElement("input");
                durationInput.type = "range";
                durationInput.min = "0.2";
                durationInput.max = "2";
                durationInput.step = "0.1";
                durationInput.value = "1";
                durationInput.addEventListener("change", () => {
                    this.updateDuration(noteElement.id, parseFloat(durationInput.value));
                });
                noteContainer.appendChild(noteElement);
                noteContainer.appendChild(durationInput);

                const intervalInput = document.createElement("input");
                intervalInput.type = "range";
                intervalInput.min = "0.0";
                intervalInput.max = "3";
                intervalInput.step = "0.1";
                intervalInput.value = "0";
                intervalInput.addEventListener("change", () => {
                    this.updateInterval(noteElement.id, parseFloat(intervalInput.value));
                });
                noteContainer.appendChild(intervalInput);

                // Load the sound for this note
                this.sounds[note] = new Howl({
                    src: [`sounds/${note}.mp3`] // Path to local audio files
                });

                // Store the note and its duration
                this.notesDuration.push({ id: noteElement.id, note: note, duration: parseFloat(noteElement.dataset.duration), interval: parseFloat(intervalInput.value) });
            }
        });

        document.getElementById("play")?.addEventListener("click", () => {
            console.log(this.notesDuration);
            let currentTime = 0;
            this.notesDuration.forEach((item, index) => {
                const sound = this.sounds[item.note];
                if (sound) {
                    setTimeout(() => {
                        sound.play();
                        setTimeout(() => sound.stop(), item.duration * 1000); // Stop playing after the specified duration
                    }, currentTime * 1000);
                    currentTime += (item.duration + (this.notesDuration[index + 1] ? parseFloat(this.notesDuration[index + 1].interval.toString()) : 0));
                }
            });
        });
    },
    //Ici les fonctions (méthodes)
    methods: {
        updateDuration(id: string, duration: number) {
            for (let i = 0; i < this.notesDuration.length; i++) {
                if (this.notesDuration[i].id === id) {
                    this.notesDuration[i].duration = duration;
                    break;
                }
            }
        },

        updateInterval(id: string, interval: number) {
            for (let i = 0; i < this.notesDuration.length; i++) {
                if (this.notesDuration[i].id === id) {
                    this.notesDuration[i].interval = interval;
                    break;
                }
            }
        },

        noteID() {
            return Math.random().toString(36).substr(2, 9);
        },

        playSound(note: string) {
            // Charger et jouer le son correspondant à la note
            const sound = new Howl({
                src: [`./sounds/${note}.mp3`] // Path to local audio files
            });
            sound.play();
        },

        startGame() {
            this.showMainGame = true;
            this.showAfterGame = false;
            this.showEndGame = false;
            this.showTimer = true;
            this.remainingTime = this.roundDuration;
            this.currentRound = 0;
            this.playRound();
        },

        playRound() {
            this.timerInterval = window.setInterval(() => {
                if (this.remainingTime <= 0) {

                    clearInterval(this.timerInterval);

                    this.timerInterval = 0;
                    this.currentRound++;


                    if (this.currentRound < this.maxRounds) {
                        // Démarre le prochain tour si ce n'est pas le dernier
                        this.showMainGame = false;
                        this.showAfterGame = true;

                        setTimeout(() => {
                            console.log("c'est bon mon gars");
                            this.showMainGame = true;
                            this.showAfterGame = false; // Cacher la div après 30 secondes
                            this.remainingTime = this.roundDuration; // Réinitialiser le temps restant
                            this.playRound(); // Appeler la fonction playRound() pour démarrer un nouveau tour
                        }, 30000); // 30 secondes
                    } else {
                        // Termine le jeu si tous les tours sont joués
                        this.showTimer = false;
                        clearInterval(this.timerInterval);
                        this.showMainGame = false;
                        this.showAfterGame = false;
                        this.showEndGame = true; // Afficher la section end-game
                        console.log('Fin du jeu');
                    }
                } else {
                    this.remainingTime--;
                }
            }, 1000);
        },



        formatTime(seconds: number): string {
            const minutes: number = Math.floor(seconds / 60);
            const sec: number = seconds % 60;
            return `${minutes}:${sec < 10 ? '0' : ''}${sec}`;
        },
    },
});

</script>