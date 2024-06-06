<template>
    <div class="Kbnotes">
        <section class="rewindAll" v-show="showRewind">
            <div class="rewind" v-for="(rewindGroup, index) in groupedRewindAll" :key="index"
                v-bind:id="'joueur' + index">
                <div class="rewindGroup">
                    <div v-for="(items, innerIndex) in rewindGroup" :key="innerIndex">
                        <h1>{{ $t('MANCHE') }} {{ items[0].rewindOrder + 1 }}</h1>
                        <h2>{{ items[0].ideas.senderName }} {{ $t('A_SOUMIS_IDEE') }} {{ items[0].ideas.idea }}</h2>
                        <h2 v-if="items[0].sendedMusic.length > 0">{{ $t('MUSIQUE_COMPOSEE_PAR') }} {{
            items[0].sendedMusic[0].composerName }}</h2>
                        <button @click="playSounds(items[0].sendedMusic)">{{ $t('ECOUTE_LA_MUSIQUE') }}</button>
                    </div>
                </div>

                <div class="buttons-container">
                    <button @click="rewindBtns(0, index)">{{ $t('AFFICHER_LE_PRECEDENT') }}</button>
                    <button @click="rewindBtns(1, index)">{{ $t('AFFICHER_LE_SUIVANT') }}</button>
                    <button v-if="player.host" class="end-game-button" @click="endGame()">{{ $t('TERMINER_LA_MANCHE')
                        }}</button>
                </div>
            </div>
        </section>
        <div class="end-game" v-show="showEndGame">
            <h2 id="play">{{ $t('PARTIE_TERMINEE') }}</h2>
        </div>

        <div class="first-step" v-show="firstStepGame">
            <label for="userIdea">{{ $t('ENTREZ_NOM_MUSIQUE') }}</label>
            <input type="text" v-model="userIdeaInput" :placeholder="$t('JUSTE_ICI')" class="justHere" @keyup.enter="submitIdea">
            <button @click="submitIdea()" :disabled="ideaSubmitted">{{ $t('VALIDER') }}</button>
            <p v-if="ideaSubmitted">{{ $t('EN_ATTENTE_DE_JOUEURS') }}</p>
        </div>

        <div class="main-game" v-show="showMainGame">
            <div class="timer" v-show="timerInGame || timerInterGame">
                {{ $t('TEMPS_RESTANT') }} {{ timerInGame ? remainingTime : secondsLeft }} {{ $t('SECONDES') }}
            </div>

            <div class="topBlock">
                <div v-for="(item, index) in assignedIdea" :key="index" v-show="showIdea && item.receiverId === socket.id">
                    <h3>{{ $t('IDEE_ATTRIBUEE') }} {{ item.idea }}</h3>
                </div>

                <div class="piano">
                    <div v-for="octave in 3" :key="octave" class="octave">
                        <div v-for="note in ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']" :key="note">
                            <div :class="{ 'key': true, 'bemole': isBemole(note) }" :data-note="`${note}${octave + 2}`" @click="playSound(`${note}${octave + 2}`)" draggable="true">{{ `${note}${octave + 2}` }}</div>
                        </div>
                    </div>
                </div>

            </div>
            
            <div class="bottomBlock">
                <div class="note-parameters">
                    <div id="note-option-container">
                        <h3>{{ $t('TA_MUSIQUE') }}</h3>

                        <div id="option-note-container" class="piano">
                            <p v-show="music.length === 0">{{ $t('GLISSE_LES_NOTES') }} {{ $t('POUR_COMPOSER_TA_MUSIQUE') }}</p>
                            <div v-for="(note, index) in music" :key="note.infos.id" 
                                :class="{ 'key': true, 'selected-note': note.infos.id === noteSelectedId }" 
                                @click="selectNoteAndPlaySound(note.infos.id)"
                                :style="{ width: `${note.infos.duration * 50}px`, 'margin-right': `${index < music.length - 1 ? note.infos.interval * 20 : 0}px` }">
                                {{ note.infos.note }}
                            </div>
                        </div>

                        <div id="note-option" v-if="music.length > 0 && noteSelectedId && selectedNote">
                            <div>
                                <span>{{ $t('NOTE_DURATION') }}</span>
                                <input type="range" min="0.5" max="2" step="0.25" v-model="selectedNote.infos.duration">
                                <p>{{ selectedNote.infos.duration }}s</p>
                            </div>
                            <div>
                                <span>{{ $t('NOTE_INTERVAL') }}</span>
                                <input type="range" min="0.0" max="2" step="0.25" v-model="selectedNote.infos.interval">
                                <p>{{ selectedNote.infos.interval }}s</p>
                            </div>
                        </div>
                    </div>
                    <button @click="deleteNote()" v-if="noteSelectedId">{{ $t('SUPPRIMER_LA_NOTE') }}</button>
                </div>
            </div>

            <button id="play" @click="handlePlayClick()" :disabled="isPlaying">
                <img src="@/assets/svg/play.svg" class="play" alt="play">
                {{$t('ECOUTE_TA_MUSIQUE') }}
            </button>
        </div>
        <div class="after-game" v-show="showAfterGame">
            <!-- <span>{{ interRoundDuration }}</span> -->
            <label for="guess">{{ $t('QUELLE_MUSIQUE_ENTENDUE_?') }}</label>
            <input type="text" v-model="userIdeaInput" :placeholder="$t('NOM_DE_LA_MUSIQUE')">
            <button @click="handlePlayGuessingClick()">{{ $t('ECOUTE_LA_MUSIQUE') }}</button>
        </div>
    </div>
    <img src="@/assets/gif/rotate.gif" alt="rotate phone" class="rotateGif">
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import io from 'socket.io-client';
import { Howl } from 'howler';
import { all } from 'axios';

interface Notes {
    composerName: string,
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

interface Item {
    ideas: {
        senderName: string;
        receiverName: string;
        receiverId: string;
        idea: string;
        rewindId: string;
    };
    sendedMusic: {
        composerName: string;
        infos: {
            id: string;
            note: string;
            duration: number;
            interval: number;
        };
    }[];
    receivedMusic: any;
    rewindId: string;
}

interface Player {
    host: boolean,
    avatar: [number, number, number],
    roomId: string,
    socketId: string,
    username: string,
    idea: boolean,
    turn: boolean,
    win: boolean,
    tabAttributed: boolean,
}

export default defineComponent({
    name: 'KbNotes',
    //Ici les variables utilisées dans le DOM
    props: {
        socket: {
            type: Object,
            required: true
        },
        roomId: {
            type: String,
            required: true
        }
    },

    data() {
        return {
            sounds: {} as Record<string, Howl>,
            noteContainer: [],
            notesDuration: [] as Notes[],
            notesDuration2: [] as Notes[],
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
            showIdea: false,
            showRewind: false,
            showWaitingGame: true,
            // showNoteContainer: true,
            // showNoteOption: false,
            timerInterGame: false,
            timerInGame: false,
            maxRounds: 3,
            currentRound: 0,
            noteSelectedId: "",
            showTimer: false,
            remainingTime: 0,
            roundDuration: 40, // Durée de chaque tour en secondes
            interRoundDuration: 10,
            timerInterval: 0 as any,
            secondsLeft: 0,
            player: {} as Player,
            assignedIdea: {} as AssignedIdea,
            tabnotes: [] as Notes[],
            assignedIdeaDone: '',
            rewind: [] as any[][],
            rewindAll: [],
            rewindCounter: 0,
            rewindId: '',
            rewindOrder: 0,
            currentIndex: 0,
            music: [] as Notes[],
            music2: [] as Notes[],
            isPlaying: false,
        }
    },

    computed: {
        groupedRewindAll() {
            const grouped: { [key: string]: Array<any> } = {};
            this.rewindAll.forEach((manche: any) => {
                manche.forEach((item: any) => {
                    const rewindId = item[0].rewindId;
                    if (!grouped[rewindId]) {
                        grouped[rewindId] = [];
                    }
                    grouped[rewindId].push(item);
                });
            });

            // Triez les groupes par l'ordre rewindOrder
            Object.values(grouped).forEach(group => {
                group.sort((a, b) => a[0].rewindOrder - b[0].rewindOrder);
            });

            return Object.values(grouped);
        },
        selectedNote() {
            return this.music.find(note => note.infos.id === this.noteSelectedId);
        }
    },
    // Ici tout le code procédural
    mounted() {
        this.resetGame();
        const getInfos = document.getElementById("infosComponent");
        const keys = document.querySelectorAll(".key");
        // const noteContainer = document.getElementById("note-container")!;
        // const noteOption = document.getElementById("note-option")!;
        const optionNoteContainer = document.getElementById("note-option-container")!;

        if(getInfos){
            getInfos.style.display = 'none';
        }

        keys.forEach((key) => {
            key.addEventListener("dragstart", (event) => {
                if (event instanceof DragEvent) {
                    event.dataTransfer?.setData("text/plain", (event.target as HTMLElement).dataset.note || "");
                }
            });
        });

        this.socket.on('receivePlayer', (player: any) => {
            this.player = player;
        });

        this.socket.on('ideaSubmitted', () => {
            this.ideaSubmitted = true;
        });

        this.socket.on('newUserIdea', () => {
            this.player.idea = true;
        });

        this.socket.on('newTabToGuess', (NotesToGuess: any) => {
            this.tabnotes = NotesToGuess;
            this.rewind[this.currentRound][0].receivedMusic = [NotesToGuess, this.player.username];
            console.log(this.tabnotes);
            console.log('NOTES RECUES');
            this.player.tabAttributed = true;
        });

        this.socket.on('startGame', () => {
            this.startGame();
        });

        this.socket.on('final rewind', (room: any) => {
            this.rewindAll = room.rewind;
            console.log("LALALA REWIND", room.rewind);

            this.rewindCounter++;
            if (this.rewindCounter === room.rewind.length) {
                this.socket.emit("clear rewind", this.player.roomId);
            }

        });

        this.socket.on('endgame', () => {
            if (!this.player.host) {
                this.endGame();
            }
        })

        this.socket.on('MainGame', (userIdeas: any) => {

            this.assignedIdea = userIdeas;
            userIdeas.forEach((idea: any) => {
                if (idea.receiverId === this.player.socketId) {
                    this.rewind[this.currentRound][0].ideas = idea;
                    this.rewindId = idea.rewindId;
                    this.rewind[this.currentRound][0].rewindOrder = this.rewindOrder;
                    this.rewindOrder++;
                    if (this.rewind[this.currentRound][0].rewindId === '') {
                        this.rewind[this.currentRound][0].rewindId = idea.rewindId;
                    }
                    console.log("REWIND ID LOG", this.rewind);
                }
            });

            this.firstStepGame = false;
            this.showMainGame = true;
            this.showAfterGame = false;
            this.showEndGame = false;
            this.showIdea = true;
            this.remainingTime = this.roundDuration;
            if (this.currentRound === 0) {
                this.playRound();
            }
            console.log('La partie a démarré côté client...');
            this.gameStarted = true; // Met à jour gameStarted pour désactiver le bouton "Jouer"
        });

        optionNoteContainer.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

        optionNoteContainer.addEventListener("drop", (event) => {
            this.handleDrop(event);
        });
    },
    methods: {
        isBemole(note: string) {
            return note.length === 2 && note[1] === 'b';
        },
        rewindBtns(order: number, id: number) {
            const rewindDivs = document.querySelectorAll('.rewind');

            rewindDivs.forEach(div => {
                if ("joueur" + id === div.id) {
                    if (order) {
                        const nextDiv = document.getElementById('joueur' + (id + 1));

                        if (nextDiv instanceof HTMLElement && div instanceof HTMLElement) {
                            div.style.display = "none";
                            nextDiv.style.display = "flex";
                        }
                    }
                    else {
                        const previousDiv = document.getElementById('joueur' + (id - 1));
                        if (previousDiv instanceof HTMLElement && div instanceof HTMLElement) {
                            div.style.display = "none";
                            previousDiv.style.display = "flex";
                        }
                    }
                }
            });
        },

        updateDuration(id: string, duration: number) {
            const note = this.music.find(note => note.infos.id === id);
            if (note) {
                note.infos.duration = duration;
            }
        },

        updateInterval(id: string, interval: number) {
            const note = this.music.find(note => note.infos.id === id);
            if (note) {
                note.infos.interval = interval;
            }
        },

        deleteNote() {
            this.music = this.music.filter(note => note.infos.id !== this.noteSelectedId);
            if (this.music.length){
                this.noteSelectedId = this.music[0].infos.id;
            } else {
                this.noteSelectedId = "";
            }
        },

        playSounds(soundList: any[] = []) {
            if (!this.isPlaying){
                this.isPlaying = true;
                const notesToPlay = soundList.length > 0 ? soundList : this.music;
                let currentTime = 0;

                notesToPlay.forEach((item: any, index: any) => {
                    const sound = new Howl({
                        src: [`./sounds/${item.infos.note}.mp3`]
                    });

                    if (sound) {
                        const duration = parseFloat(item.infos.duration);
                        const interval = parseFloat(item.infos.interval);

                        setTimeout(() => {
                            console.log(`Playing sound: ${item.infos.note} for ${duration} seconds`);
                            sound.play();

                            setTimeout(() => {
                                console.log(`Stopping sound: ${item.infos.note}`);
                                sound.stop();
                            }, duration * 1000);
                            console.log("currentTime: "+ currentTime);



                        }, currentTime * 1000);

                        currentTime += (duration + interval);
                    }
                });
                setTimeout(() => {
                    this.isPlaying = false;
                }, currentTime * 1000);     
            }
        },


        selectNoteAndPlaySound(noteId: string) {
            this.selectNote(noteId);
            const note = this.music.find(note => note.infos.id === noteId);
            if (note){
                this.playSound(note.infos.note);
            }
        },

        handlePlayClick() {
            this.playSounds(this.music);
        },

        handlePlayGuessingClick() {
            this.playSounds(this.tabnotes);
        },

        selectNote(noteId: string) {
            this.noteSelectedId = noteId;
        },

        handleDrop(event: DragEvent) {
            event.preventDefault();
            if (event instanceof DragEvent) {
                const note = event.dataTransfer?.getData('text/plain') || '';
                const noteId = this.generateID();

                const newNote: Notes = {
                    composerName: this.player.username,
                    infos: {
                        id: noteId,
                        note: note,
                        duration: 1, // Durée par défaut
                        interval: 0 // Intervalle par défaut
                    }
                };

                this.music.push(newNote); 
                this.selectNote(newNote.infos.id)

                this.sounds[note] = new Howl({
                    src: [`./sounds/${note}.mp3`] // Chemin vers les fichiers audio locaux
                });
            }
        },

        generateID() {
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

        endGame() {
            if (this.player.host) {
                this.socket.emit("endgame", this.player.roomId);
            }
            this.resetGame();
        },

        Firststep() {
            this.firstStepGame = true;
        },

        playRound() {
            this.timerInterval = setInterval(() => {
                this.timerInGame = true;
                this.timerInterGame = false;
                if (this.remainingTime <= 0) {
                    clearInterval(this.timerInterval);
                    this.rewind[this.currentRound][0].sendedMusic = this.music;
                    this.socket.emit('sendTabNotes', this.music, this.player);

                    this.timerInterval = 0;
                    this.currentRound++;
                    this.resetRound();

                    if (this.currentRound < this.maxRounds) {
                        // Démarre le prochain tour si ce n'est pas le dernier
                        this.showMainGame = false;
                        this.showAfterGame = true;
                        this.timerInGame = false;
                        this.showIdea = false;
                        this.timerInterGame = true;

                        this.secondsLeft = this.roundDuration;

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
                        this.socket.emit('rewind', this.rewind, this.player);
                        clearInterval(this.timerInterval);
                        this.showMainGame = false;
                        this.showAfterGame = false;
                        this.showIdea = false;
                        this.showRewind = true; // Afficher la section rewind
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
            this.music2 = this.music;
            console.log(`je suis la musique apres avant été vidée ${this.music}`);
            this.music = [];
            console.log(`je suis la musique apres avoir été vidée ${this.music}`);
        },

        resetGame() {
            this.sounds = {} as Record<string, Howl>;
            this.noteContainer = [];
            this.notesDuration = [] as Notes[];
            this.notesDuration2 = [] as Notes[];
            this.userIdeaInput = ''; // Variable pour stocker la valeur de l'input
            this.userIdeas = [] as string[]; // Tableau pour stocker les réponses
            this.guessInput = ''; // Variable pour stocker la valeur de l'input
            this.Responses = [] as string[]; // Tableau pour stocker les réponses
            this.firstStepGame = true;
            this.ideaSubmitted = false;
            this.gameStarted = false;
            this.showMainGame = false;
            this.showAfterGame = false;
            this.player = {} as Player;
            this.showEndGame = false;
            this.showIdea = false;
            this.showRewind = false;
            this.showWaitingGame = true;
            // this.showNoteContainer = true;
            // this.showNoteOption = false;
            this.timerInterGame = false;
            this.timerInGame = false;
            this.maxRounds = 3;
            this.currentRound = 0;
            this.noteSelectedId = "";
            this.showTimer = false;
            this.remainingTime = 0;
            this.roundDuration = 40; // Durée de chaque tour en secondes
            this.interRoundDuration = 10;
            this.timerInterval = 0;
            this.secondsLeft = 0;
            this.assignedIdea = {} as AssignedIdea;
            this.tabnotes = [] as Notes[];
            this.assignedIdeaDone = '';
            this.rewind = [] as any[][];
            this.rewindAll = [];
            this.rewindCounter = 0;
            this.rewindId = '';
            this.rewindOrder = 0;
            this.currentIndex = 0;
            this.music = [] as Notes[],
            this.music2 = [] as Notes[],
            this.isPlaying= false,

            this.rewindId = this.generateID();
            if (this.player.host) {
                this.socket.emit('play', this.roomId);
            }
            for (let index = 0; index < this.maxRounds; index++) {
                this.rewind.push([{
                    ideas: '',
                    sendedMusic: '',
                    receivedMusic: '',
                    rewindId: '',
                    rewindOrder: 0
                }]);
            }
        },

        formatTime(seconds: number): string {
            const minutes: number = Math.floor(seconds / 60);
            const sec: number = seconds % 60;
            return `${minutes}:${sec < 10 ? '0' : ''}${sec}`;
        },

        submitIdea() {
            // Émettre un événement "submitIdea" avec les données de l'utilisateur
            this.socket.emit('submitIdea', this.userIdeaInput, this.player, this.rewindId);

            // Réinitialiser la valeur de userIdeaInput après l'avoir envoyée au serveur
            this.userIdeaInput = '';
        },

        PlayNotesDone() {
            console.log("ff");
        },

        showNext() {
            if (this.currentIndex < this.groupedRewindAll.length - 1) {
                this.currentIndex++;
            }
        },
        showPrevious() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
            }
        }
    },
});

</script>

<style lang="css" scoped>
    @import url('./kbnotes.css');
    @import url('./kbnotes-mobile.css');
</style>