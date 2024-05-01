<template>
    <div>
        <h1>{{ rewind }}</h1>
        <div class="end-game" v-show="showEndGame">
            <h2 id="play">{{ $t('PARTIE_TERMINEE') }}</h2>
        </div>
        <!-- Affichage du temps restant -->
        <div id="timer" v-show="timerInGame">
            {{ $t('TEMPS_RESTANT') }} {{ remainingTime }} {{ $t('SECONDES') }}
        </div>
        <!-- Affichage du temps restant dans le décompte des 30 secondes -->
        <div id="countdown" v-show="timerInterGame">
            {{ $t('TEMPS_RESTANT') }} {{ secondsLeft }} {{ $t('SECONDES') }}
        </div>
        <!-- <div class="Waiting-game" v-show="showWaitingGame">
            <button @click="socket.emit('play');" v-show="!showMainGame && !showAfterGame && !showEndGame"
                :disabled="gameStarted">{{ $t('KEYBOARD_NOTES') }}</button>
        </div> -->
        <div class="first-step" v-show="firstStepGame">
            <label for="userIdea">{{ $t('ENTREZ_NOM_MUSIQUE') }}</label>
            <input type="text" v-model="userIdeaInput" :placeholder="$t('JUSTE_ICI')">
            <button @click="submitIdea()" :disabled="ideaSubmitted">{{ $t('VALIDER') }}</button>
            <p v-if="ideaSubmitted">{{ $t('EN_ATTENTE_DE_JOUEURS') }}</p>
        </div>
        <div v-for="(item, index) in assignedIdea" :key="index">
            <div v-if="item.receiverId === socket.id">
                <p>{{ $t('IDEE_ATTRIBUEE') }} {{ item.idea }}</p>
            </div>
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
            <button id="play" @click="handlePlayClick()">{{ $t('ECOUTE_TA_MUSIQUE') }}</button>
        </div>
        <div class="after-game" v-show="showAfterGame">
            <label for="guess">{{ $t('QUELLE_MUSIQUE_ENTENDUE_?') }}</label>
            <input type="text" v-model="userIdeaInput" placeholder="Nom de la musique">
            <button @click="handlePlayClick()">{{ $t('ECOUTE_LA_MUSIQUE') }}</button>
        </div>
    </div>
</template>

<style lang="css" scoped>
@import url('./KeyboardNotes.css');
</style>

<script lang="ts">

import { defineComponent } from 'vue';
import io from 'socket.io-client';
import { Howl } from 'howler';

interface Notes {
    userId: string,
    infos: {
        id: string,
        note: string,
        duration: number,
        interval: number,
    }
}

interface AssignedIdea {
    id: string;
    idea: string;
}

// interface Rewind {
//     userID: {
//         Manche1: {
//             from: {
//                 userID: string,
//                 idea: string,
//             },
//             musician: {
//                 userIDafter: string,
//                 Suite2Notes: [],
//             },
//             guesser: {
//                 userIDguess: string,
//                 guess: string,
//             }
//         },
//         Manche2: {
//             from: {
//                 userID: string,
//                 idea: string,
//             },
//             musician: {
//                 userIDafter: string,
//                 Suite2Notes: [],
//             },
//             guesser: {
//                 userIDguess: string,
//                 guess: string,
//             }
//         },
//         Manche3: {
//             from: {
//                 userID: string,
//                 idea: string,
//             },
//             musician: {
//                 userIDafter: string,
//                 Suite2Notes: [],
//             },
//             guesser: {
//                 userIDguess: string,
//                 guess: string,
//             }
//         },
//     }
// }

export default defineComponent({
    //Ici les variables utilisées dans le DOM
    props: {
        socket: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            sounds: {} as Record<string, Howl>,
            notesDuration: [] as Notes[],
            userIdeaInput: '', // Variable pour stocker la valeur de l'input
            userIdeas: [] as string[], // Tableau pour stocker les réponses
            guessInput: '', // Variable pour stocker la valeur de l'input
            Responses: [] as string[], // Tableau pour stocker les réponses
            firstStepGame: false,
            ideaSubmitted: false,
            gameStarted: false,
            showMainGame: false,
            showAfterGame: false,
            showEndGame: false,
            showWaitingGame: true,
            timerInterGame: false,
            timerInGame: false,
            currentRound: 0,
            maxRounds: 3,
            showTimer: false,
            remainingTime: 0,
            roundDuration: 10, // Durée de chaque tour en secondes
            interRoundDuration: 30,
            timerInterval: 0,
            secondsLeft: 0,
            assignedIdea: {} as AssignedIdea,
            tabnotes: [] as Notes[],
            assignedIdeaDone: '',
            player: {
                host: false,
                avatar: [0, 0, 0],
                roomId: "",
                username: "",
                socketId: "",
                turn: false,
                win: false,
                idea: false,
                tabAttributed: false,
            },
            rewind: [] as any[][],
            rewindAll: [],
        }
    },
    // Ici tout le code procédural
    mounted() {
        this.socket.emit('play');
        for (let index = 0; index < this.maxRounds; index++) {
            this.rewind.push([{
                ideas: '',
                sendedMusic:'',
                receivedMusic: '',
            }]);
        }
        const keys = document.querySelectorAll(".key");
        const noteContainer = document.getElementById("note-container")!;

        keys.forEach((key) => {
            key.addEventListener("dragstart", (event) => {
                if (event instanceof DragEvent) {
                    event.dataTransfer?.setData("text/plain", (event.target as HTMLElement).dataset.note || "");
                }
            });
        });

        this.socket.on('receivePlayer:3', (player: any) => {
            this.player = player;
        });

        this.socket.on('ideaSubmitted', () => {
            this.ideaSubmitted = true;
        });

        this.socket.on('newUserIdea', () => {
            this.player.idea = true;
        });

        this.socket.on('newTabToGuess', (NotesToGuess: any, composerId: string) => {
            this.tabnotes = NotesToGuess;
            this.rewind[this.currentRound][0].receivedMusic = [NotesToGuess, composerId];
            console.log(this.tabnotes);
            this.player.tabAttributed = true;
        });

        this.socket.on('startGame', () => {
            this.startGame();
        });

        this.socket.on('final rewind', (rewindAll: []) => {
            this.rewindAll = rewindAll;
            console.log("FINAL REWIND",rewindAll);
            
        })

        this.socket.on('MainGame', (userIdeas: any) => {
            console.log("REWIND", this.rewind);

            this.socket.emit('random attribute');

            this.assignedIdea = userIdeas;
            userIdeas.forEach((idea: any) => {
                if (idea.receiverId === this.player.socketId) {
                    this.rewind[this.currentRound][0].ideas = idea;
                }
            });

            [
                [
                    { "id": "qjRL9o0Ip9kzOoEAAAAn", "idea": "grave" }
                ],
                [
                    [
                        {
                            "userId": "8iiVA9ZFSeeV7z67AAAl", "infos":
                                { "id": "30ez44pnh", "note": "E2", "duration": 1, "interval": 0 }
                        }
                    ],
                    { "id": "qjRL9o0Ip9kzOoEAAAAn", "idea": "gauche" }
                ], [
                    { "id": "qjRL9o0Ip9kzOoEAAAAn", "idea": "aigu" }
                ]
            ]

            // console.log(`${this.assignedIdea}`);
            this.firstStepGame = false;
            this.showMainGame = true;
            this.showAfterGame = false;
            this.showEndGame = false;
            this.remainingTime = this.roundDuration;
            if (this.currentRound === 0) {
                this.playRound();
            }
            console.log('La partie a démarré côté client...');
            this.gameStarted = true; // Met à jour gameStarted pour désactiver le bouton "Jouer"
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
                    src: [`./sounds/${note}.mp3`] // Path to local audio files
                });

                // Store the note and its duration
                this.notesDuration.push({ userId: this.socket.id, infos: { id: noteElement.id, note: note, duration: parseFloat(noteElement.dataset.duration), interval: parseFloat(intervalInput.value) } });
            }
        });

        // document.getElementById("play")?.addEventListener("click", () => {
        //     console.log(this.notesDuration);
        //     let currentTime = 0;
        //     this.notesDuration.forEach((item, index) => {
        //         const sound = this.sounds[item.infos.note];
        //         if (sound) {
        //             setTimeout(() => {
        //                 sound.play();
        //                 setTimeout(() => sound.stop(), item.infos.duration * 1000); // Stop playing after the specified duration
        //             }, currentTime * 1000);
        //             currentTime += (item.infos.duration + (this.notesDuration[index + 1] ? parseFloat(this.notesDuration[index + 1].infos.interval.toString()) : 0));
        //         }
        //     });
        // });
    },
    //Ici les fonctions (méthodes)
    methods: {
        updateDuration(id: string, duration: number) {
            for (let i = 0; i < this.notesDuration.length; i++) {
                if (this.notesDuration[i].infos.id === id) {
                    this.notesDuration[i].infos.duration = duration;
                    break;
                }
            }
        },

        updateInterval(id: string, interval: number) {
            for (let i = 0; i < this.notesDuration.length; i++) {
                if (this.notesDuration[i].infos.id === id) {
                    this.notesDuration[i].infos.interval = interval;
                    break;
                }
            }
        },

        playSounds(soundList: any) {
            let currentTime = 0;
            soundList.forEach((item: any, index: any) => {
                console.log(item.infos.note);
                const sound = new Howl({
                    src: [`./sounds/${item.infos.note}.mp3`] // Path to local audio files
                });
                if (sound) {
                    setTimeout(() => {
                        sound.play();
                        setTimeout(() => sound.stop(), item.infos.duration * 1000);
                    }, currentTime * 1000);
                    currentTime += (item.infos.duration + (soundList[index + 1] ? parseFloat(soundList[index + 1].infos.interval.toString()) : 0));
                }
            });
        },

        handlePlayClick() {
            console.log(this.notesDuration);
            this.playSounds(this.notesDuration);
        },

        handlePlayGuessingClick() {
            console.log(this.tabnotes);
            this.playSounds(this.tabnotes);
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
            this.gameStarted = true;
            this.Firststep();
        },

        Firststep() {
            this.firstStepGame = true;
        },
        playRound() {
            this.timerInterval = window.setInterval(() => {
                this.timerInGame = true;
                this.timerInterGame = false;
                if (this.remainingTime <= 0) {
                    clearInterval(this.timerInterval);
                    this.rewind[this.currentRound][0].sendedMusic = this.notesDuration;
                    this.socket.emit('sendTabNotes', this.notesDuration, this.player);

                    this.timerInterval = 0;
                    this.currentRound++;
                    this.resetRound();

                    if (this.currentRound < this.maxRounds) {
                        // Démarre le prochain tour si ce n'est pas le dernier
                        this.showMainGame = false;
                        this.showAfterGame = true;
                        this.timerInGame = false;
                        this.timerInterGame = true;

                        this.secondsLeft = 20;

                        // Décompte des 30 secondes sur le front-end
                        const countdownInterval = setInterval(() => {
                            if (this.secondsLeft <= 0) {
                                this.submitIdea();
                                console.log(this.Responses);
                                clearInterval(countdownInterval); // Arrêter le deuxième timer une fois les 30 secondes écoulées
                                console.log("c'est bon mon gars");

                                this.showMainGame = true;
                                this.showAfterGame = false; // Cacher la div après 30 secondes
                                this.remainingTime = this.roundDuration; // Réinitialiser le temps restant
                                this.playRound(); // Appeler la fonction playRound() pour démarrer un nouveau tour
                            } else {
                                this.secondsLeft--; // Mettre à jour le compteur de secondes
                                console.log(this.secondsLeft);
                            }
                        }, 1000); // Interval mis à 100
                    } else {
                        // Termine le jeu si tous les tours sont joués
                        this.timerInGame = false;
                        this.timerInterGame = false;
                        this.socket.emit('rewind', this.rewind);
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

        resetRound() {
            this.player.idea = false;
            this.player.tabAttributed = false;
            // this.tabnotes = [] as Notes[];
            this.notesDuration = [] as Notes[];

            const noteContainer = document.getElementById("note-container");

            if (noteContainer) {
                while (noteContainer.firstChild) {
                    noteContainer.removeChild(noteContainer.firstChild);
                }
            }

        },

        formatTime(seconds: number): string {
            const minutes: number = Math.floor(seconds / 60);
            const sec: number = seconds % 60;
            return `${minutes}:${sec < 10 ? '0' : ''}${sec}`;
        },

        submitIdea() {
            // Émettre un événement "submitIdea" avec les données de l'utilisateur
            this.socket.emit('submitIdea', this.userIdeaInput, this.player);

            // Réinitialiser la valeur de userIdeaInput après l'avoir envoyée au serveur
            this.userIdeaInput = '';
        },

        PlayNotesDone() {
            console.log("ff");
        },
    },
});

</script>