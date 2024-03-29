<template>
    <div>
        <!-- Affichage du temps restant -->
        <div id="timer" v-show="timerInGame">
            Temps restant : {{ remainingTime }} secondes
        </div>

        <!-- Affichage du temps restant dans le décompte des 30 secondes -->
        <div id="countdown" v-show="timerInterGame">
            Temps restant : {{ secondsLeft }} secondes
        </div>
        <div class="Waiting-game" v-show="showWaitingGame">
            <button @click="socket.emit('play');" v-show="!showMainGame && !showAfterGame && !showEndGame"
                :disabled="gameStarted">go tester</button>
        </div>
        <div class="first-step" v-show="firstStepGame">
            <label for="userIdea">Entrez ce que vous souhaitez faire jouer à vos giga brows :</label>
            <input type="text" v-model="userIdeaInput" placeholder="Depeche toi...">
            <button @click="submitIdea()" :disabled="ideaSubmitted">SUBMIT TON IDEE LE S</button>
            <p v-if="ideaSubmitted">En attente des autres joueurs...</p>
        </div>
        <div v-for="idealex in assignedIdea" :key="idealex.id">
            <div v-if="typeof idealex === 'object' && idealex.id">
                <p>L'idée qui vous a été attribuée est : {{ idealex.idea }}</p>
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
            <button id="play">Play</button>
        </div>
        <div class="after-game" v-show="showAfterGame">
            <label for="guess">Votre guess :</label>
            <input type="text" v-model="guessInput"
                placeholder="Ecrivez la musique à laquelle correspond l'enchainement de notes...">
            <button @click="PlayNotesDone()">Jouer la suite !!!!!!!!!!!!!</button>
        </div>
    </div>
    <div class="end-game" v-show="showEndGame">
        <button id="play">END GAME</button>
    </div>
</template>

<script lang="ts">

import './style.css';

import { defineComponent } from 'vue';
import io from 'socket.io-client';
import { Howl } from 'howler';

interface Notes {
    id: string,
    note: string,
    duration: number,
    interval: number,
}

interface AssignedIdea {
    id: string;
    idea: string;
}

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
            roundDuration: 30, // Durée de chaque tour en secondes
            interRoundDuration: 30,
            timerInterval: 0,
            secondsLeft: 0,
            assignedIdea: {} as AssignedIdea,
            assignedIdeaDone: '',
            player: {
                host: false,
                avatar: "Avatar 1",
                roomId: "",
                username: "",
                socketId: "",
                turn: false,
                win: false,
                idea: false,
            },
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

        this.socket.on('receivePlayer:3', (player: any) => {
            this.player = player;
        });

        this.socket.on('ideaSubmitted', () => {
            this.ideaSubmitted = true;
        });

        this.socket.on('newUserIdea', () => {
            this.player.idea = true;
        });

        this.socket.on('startGame', () => {
            this.startGame();
        });

        this.socket.on('MainGame', (userIdeas: any) => {
            this.socket.emit('random attribute');
            this.assignedIdea = userIdeas;
            console.log(this.assignedIdea);
            this.firstStepGame = false;
            this.showMainGame = true;
            this.showAfterGame = false;
            this.showEndGame = false;
            this.remainingTime = this.roundDuration;
            this.currentRound = 0;
            this.playRound();
            console.log('La partie a démarré côté client...');
            this.gameStarted = true; // Met à jour gameStarted pour désactiver le bouton "Jouer"
        });

        noteContainer.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

        this.socket.on('assigned idea', (assignedIdeas: AssignedIdea[]) => {
            // Parcourir les idées attribuées pour trouver celle qui correspond à l'utilisateur actuel
            assignedIdeas.forEach(idea => {
                if (idea.id === this.socket.id) {
                    // Mettre à jour l'idée attribuée pour l'utilisateur actuel
                    this.assignedIdea = idea;
                    this.assignedIdeaDone = this.assignedIdea.idea;

                    console.log('Assigned idea for current user:', this.assignedIdea.idea);
                }
            });
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

                    this.timerInterval = 0;
                    this.currentRound++;


                    if (this.currentRound < this.maxRounds) {
                        // Démarre le prochain tour si ce n'est pas le dernier
                        this.showMainGame = false;
                        this.showAfterGame = true;
                        this.timerInGame = false;
                        this.timerInterGame = true;

                        this.secondsLeft = 10;

                        // Décompte des 30 secondes sur le front-end
                        const countdownInterval = setInterval(() => {
                            if (this.secondsLeft <= 0) {
                                this.submitGuess();
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

        submitIdea() {
            // Émettre un événement "submitIdea" avec les données de l'utilisateur
            this.socket.emit('submitIdea', this.userIdeaInput, this.player);

            // Réinitialiser la valeur de userIdeaInput après l'avoir envoyée au serveur
            this.userIdeaInput = '';
        },

        submitGuess() {
            this.Responses.push(this.guessInput);
            // Réinitialise la valeur de guessInput après l'avoir ajoutée au tableau Responses
            this.guessInput = '';
        },

        PlayNotesDone() {
            console.log("ff");
        },

        // takeRandomValueAndAddToUserXidea(idUser: string, sourceArray: string[], userXideaArray: UserXidea[]): void {
        //     if (sourceArray.length === 0) {
        //         console.log("Le tableau source est vide.");
        //         return;
        //     }

        //     // Sélectionne un index aléatoire dans le tableau source
        //     const randomIndex = Math.floor(Math.random() * sourceArray.length);

        //     // Récupère la valeur à l'index aléatoire
        //     const idea = sourceArray[randomIndex];

        //     // Retire l'élément sélectionné du tableau source
        //     sourceArray.splice(randomIndex, 1);

        //     // Ajoute la valeur à userXidea avec l'idUser spécifié
        //     userXideaArray.push({ idUser, idea });
        //     console.log(`source array : ${sourceArray}`);
        //     userXideaArray.forEach((item, index) => {
        //         console.log(`[${index + 1}] IdUser: ${item.idUser}, Idea: ${item.idea}`);
        //     });
        //     // console.log(`Idée '${idea}' ajoutée à userXidea pour l'utilisateur '${idUser}'.`);
        // },
    },
});

</script>