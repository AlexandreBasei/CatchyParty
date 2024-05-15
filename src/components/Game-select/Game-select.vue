<template>
    <div class="content">
        <section class="playersList">
            <h3>{{ $t('JOUEURS') }}</h3>
            <div class="playersContainer" v-for="room in rooms" :key="room.id">
                <div class="playerContainer" v-if="room.id === player.roomId">
                    <div v-for="rplayer in room.players" :key="rplayer.socketId" style="position: relative;">

                        <ProfilePicture class="white-profile" :bodyIndex="rplayer.avatar[0]"
                            :eyesIndex="rplayer.avatar[1]" :mouthIndex="rplayer.avatar[2]" />

                        <span class="pseudoPlayer">
                            <div>
                                <span v-if="rplayer.host">👑</span>
                                <span>{{ rplayer.username }}</span>
                            </div>

                            <button v-if="player.host && rplayer.socketId !== player.socketId"
                                @click="displayHostMenu(rplayer.socketId)"
                                class="hostMenuButton no-background no-hover">
                                <svg width="10px" height="15px" xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF"
                                    class="bi bi-three-dots-vertical">
                                    <path
                                        d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                </svg>
                            </button>
                        </span>

                        <div v-bind:id="rplayer.socketId" class="hostMenu no-background no-hover">
                            <button class="no-background no-hover" @click="setHost(rplayer)">{{ $t('NOUVEAU_HOTE')
                                }}</button>
                            <button class="no-background no-hover" style="color: red;"
                                @click="kickPlayer(rplayer.socketId)">{{ $t('EJECTER_JOUEUR') }}</button>
                        </div>
                    </div>
                </div>
            </div>
            <button id="shareLink" :class="{ 'shareLink': copied }"
                @click="copy(`localhost:8080?room=${player.roomId}`)">
                {{ copied ? $t('COPIE') : $t('COPIER_LIEN') }}
            </button>

        </section>
        <section class="personalization-section" v-if="game === 0">
            <!-- v-if="rooms.some(room => room.id === player.roomId)" -->
            <div class="games-block">
                <h3>{{ $t('SELECTION_DES_JEUX') }}</h3>

                <div class="games-options">
                    <div class="all-games">
                        <div class="game-container" v-for="game in games" :key="game.id">
                            <div class="game" @click="handleGameClick(game.id)">
                                <img :src="game.image" :alt="game.name" draggable="true"
                                    @dragstart="handleDragStart(game)">
                            </div>
                            <p>{{ game.name }}</p>
                        </div>
                    </div>
                </div>

                <h3>{{ $t('DEROULEMENT_PARTIE') }} ({{ gamesChosen.length }}/{{ maxRounds }})</h3>

                <div class="games-selected" @drop="handleDrop" @dragover.prevent>
                    <div class="all-games">
                        <div class="game-container" v-for="(gameId, index) in gamesChosen" :key="index">
                            <div class="game" @click="handleRemoveGame(index)">
                                <img :src="getGameImage(gameId)" :alt="getGameName(gameId)">
                            </div>
                            <p>{{ $t('ROUND') }} {{ index + 1 }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="!player.host" class="settings guest">
                <h2>{{ $t('HOTE_CONFIGURE_PARTIE') }}</h2>
            </div>

            <form @submit.prevent="start()">
                <button class="startGame"
                    :disabled="((currentRoomPlayers && currentRoomPlayers.players.length < 2 || gamesChosen.length < 1)) || !player.host">{{
                    $t('DEMARRER_PARTIE') }}
                </button>

                <div class="messages">
                    <span v-if="currentRoomPlayers" :class="{ 'green-text': currentRoomPlayers.players.length >= 2 }">
                        {{ currentRoomPlayers.players.length >= 2 ? 'Assez de joueurs' : 'Pas assez de joueurs' }} ({{
                        currentRoomPlayers.players.length }})
                    </span>
                    <span v-if="gamesChosen" :class="{ 'green-text': gamesChosen.length >= 1 }">
                        {{ gamesChosen.length >= 1 ? 'Assez de jeux' : 'Pas assez de jeux' }} ({{ gamesChosen.length }})
                    </span>
                </div>
            </form>
        </section>

        <Kbnotes v-else-if="game === 1" :socket="socket"></Kbnotes>

        <ClassicoComponent v-else-if="game === 2" :socket="socket"></ClassicoComponent>

        <WtsComponent v-else-if="game === 3" :socket="socket"></WtsComponent>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import io from 'socket.io-client';
import Kbnotes from "@/components/Keyboard-notes/KeyboardNotes.vue";
import ProfilePicture from "@/components/ProfilePicture/ProfilePicture.vue";
import WtsComponent from '../Wts/WtsComponent.vue';
import ClassicoComponent from '../Classico/ClassicoComponent.vue';

interface Room {
    id: string;
    rewind: [];
    gamesChosen: number[];
    players: {
        host: boolean,
        avatar: [number, number, number],
        roomId: string,
        socketId: string,
        username: string,
        idea: boolean,
        tabAttributed: boolean,
    }[];
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
    name: 'game_select',
    homepage: '',
    components: {
        Kbnotes,
        ProfilePicture,
        WtsComponent,
        ClassicoComponent,
    },

    props: {
        socket: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            rooms: [] as Room[],
            currentRoom: '',
            player: {} as Player,
            copied: false,
            game: 0 as number,
            maxRounds: 5,
            currentRound: 0,
            games: [
                { id: 1, name: "Keyboard-notes", image: require("@/assets/svg/partinies/solar.svg") },
                { id: 2, name: "Classico", image: require("@/assets/svg/partinies/vilo.svg") },
                { id: 3, name: "What's the situation ?", image: require("@/assets/svg/partinies/blingbling.svg") }
            ],
            gamesChosen: [] as number[],
            draggedGameId: null as null | number,
            draggedIndex: null as number | null,
        }
    },

    mounted() {

        this.socket.on('join room', (player: any) => {
            this.player = player;
            this.currentRoom = player.roomId;
            // if (this.currentRoomPlayers){
            //     this.socket.emit('update gamesChosen', this.currentRoomPlayers.id, this.gamesChosen);
            // }
        });

        this.socket.on('get rounds', (maxRounds: number) => {
            this.maxRounds = maxRounds;
        });

        this.socket.on('new host', (newHostId: string) => {
            console.log('This.player.socketId', this.player.socketId);

            if (this.player.socketId === newHostId) {
                this.player.host = true;
            }
        });

        this.socket.on('kicked', (kickedId: string) => {
            if (this.player.socketId === kickedId) {
                this.exitRoom();
                console.log('kicked');
            }
        });

        this.socket.on('game start', (gamesChosen: []) => {

            // this.gamesChosen = gamesChosen;

            switch (this.gamesChosen[this.currentRound]) {
                case 1:
                    this.game = 1;
                    break;
                case 2:
                    this.game = 2;
                    break;
                case 3:
                    this.game = 3;
                    break;
                default:
                    break;
            }
            this.socket.emit('sendPlayer', this.player);
        });

        this.socket.on('endgame', () => {
            if (this.currentRound === this.gamesChosen.length) {
                console.log("Partie terminée");
                this.currentRound = 0;
                this.gamesChosen = [];
                this.game = 0;
            }
            else {
                this.currentRound++;
                this.start();
            }
            this.socket.emit('sendPlayer', this.player);
        });

        this.socket.on('endgame', () => {
            if (this.currentRound === this.gamesChosen.length) {
                console.log("Partie terminée");
            }
            else {
                this.currentRound++;
                this.start();
            }
        })

        this.socket.on('get gamesChosen', (gamesChosen: []) => {
            this.gamesChosen = gamesChosen;
        });

        this.socket.on('get gamesChosen', (gamesChosen: []) => {
            console.log('gamesChosen updated in local for everyone');
            this.gamesChosen = gamesChosen;
        });

        // setInterval(() => {
        this.updRooms();
        // }, 20);

        document.addEventListener('click', (event: MouseEvent) => {
            /*eslint no-undef: 0*/
            const modals = document.querySelectorAll('.hostMenu') as NodeListOf<HTMLElement>;
            /*eslint no-undef: 0*/
            const buttons = document.querySelectorAll('.hostMenuButton') as NodeListOf<HTMLElement>;

            modals.forEach((modal) => {
                if (!modal.contains(event.target as Node) && !this.isButtonClicked(buttons, event.target as Node)) {
                    modal.style.display = 'none';
                }
            });
        });

        // this.roundsNumber();
        this.playersNumber();
        // this.updateAvatar();

    },
    // watch: {
    //     gamesChosen: {
    //         handler(newValue: any, oldValue: any) {
    //             if (this.player.host && this.currentRoomPlayers){
    //                 this.socket.emit('update gamesChosen', this.currentRoomPlayers.id, newValue);
    //                 console.log('Changing gamesChosen for room n°'+this.currentRoomPlayers.id+" with "+this.gamesChosen)
    //             }
    //         },
    //         deep: true,
    //     },
    // },
    computed: {
        currentRoomPlayers() {
            return this.rooms.find(room => room.id === this.player.roomId);
        },
    },
    methods: {
        handleDragStart(game: { id: number }) {
            if (this.player.host) {
                this.draggedGameId = game.id;
            }
        },
        handleDrop(event: DragEvent) {
            event.preventDefault();
            const gameId = this.draggedGameId;
            if (gameId) {
                this.handleGameClick(gameId);
                this.draggedGameId = null;
            }
        },
        handleGameClick(id: number) {
            if (this.player.host && this.currentRoomPlayers && this.gamesChosen && this.gamesChosen.length < this.maxRounds) {
                this.gamesChosen.push(id);
                this.socket.emit('update gamesChosen', this.currentRoomPlayers.id, this.gamesChosen);
            }
        },
        handleRemoveGame(index: number) {
            if (this.player.host && this.currentRoomPlayers){
                this.gamesChosen.splice(index, 1);
                this.socket.emit('update gamesChosen', this.currentRoomPlayers.id, this.gamesChosen);
            }
        },
        getGameName(id: number) {
            const game = this.games.find(game => game.id === id);
            return game ? game.name : '';
        },
        getGameImage(id: number) {
            const game = this.games.find(game => game.id === id);
            return game ? game.image : '';
        },
        updRooms() {
            this.socket.emit('get rooms');

            this.socket.on('room updated', (updatedRoom: Room) => {
                const index = this.rooms.findIndex(room => room.id === updatedRoom.id);
                if (index !== -1) {
                    this.rooms.splice(index, 1, updatedRoom);
                }
            });

            this.socket.on('list rooms', (rooms: Room[]) => {
                this.rooms = rooms;
                
                // rooms.forEach(room => {
                //     if (this.player.roomId === room.id) {
                //         // this.gamesChosen = room.gamesChosen;
                //         room.gamesChosen = this.gamesChosen;
                //         console.log(room.gamesChosen)
                //     }
                // });
            });
        },

        resetPlayer() {
            this.player.host = false;
            this.player.username = "";
            this.player.avatar = [0, 0, 0];
            this.player.roomId = "";
            this.player.idea = false;
            this.player.tabAttributed = false;
        },

        exitRoom() {
            this.rooms.forEach(room => {
                if (room.id === this.currentRoom) {
                    this.resetPlayer();
                    this.socket.emit("exit room");

                    window.location.search = '';
                }
            });
        },

        kickPlayer(socketId: string) {

            this.rooms.forEach(room => {
                console.log("roomId : ", room.id);
                console.log("this roomId :", this.currentRoom);


                if (room.id === this.currentRoom) {
                    console.log("kick");
                    this.socket.emit("kick player", socketId);
                }
            });
        },

        sendRounds() {
            this.socket.emit("send rounds", this.maxRounds);
        },

        getRounds() {
            this.socket.emit("get rounds");
        },

        copy(text: string) {
            navigator.clipboard.writeText(text);
            this.copied = true;
            setTimeout(() => {
                this.copied = false;
            }, 1500);
        },

        playersNumber() {
            var selectElement = document.getElementById("nbPlayers");

            for (var i = 1; i <= 10; i++) {
                var option = document.createElement("option");
                option.text = i.toString();
                option.value = i.toString();
                if (selectElement) {
                    selectElement.appendChild(option);
                }
            }
        },
        // roundsNumber() {
        //     var selectElement = document.getElementById("nbRounds");

        //     for (var i = 1; i <= 3; i++) {
        //         var option = document.createElement("option");
        //         option.text = i.toString();
        //         option.value = i.toString();
        //         if (selectElement) {
        //             selectElement.appendChild(option);
        //         }
        //     }
        // },

        displayHostMenu(socketId: string) {
            const menuToDisplay = document.getElementById(socketId);

            if (menuToDisplay) {
                /*eslint no-undef: 0*/
                const modals = document.querySelectorAll('.hostMenu') as NodeListOf<HTMLElement>;

                modals.forEach((modal) => {
                    if (modal) {
                        modal.style.display = 'none';
                    }
                });

                menuToDisplay.style.display = "flex";
            }
        },

        setHost(player: any) {
            this.player.host = false;
            this.socket.emit("set host", player);

            const menuToDisplay = document.getElementById(player.socketId);

            if (menuToDisplay) {
                menuToDisplay.style.display = "none";
            }
        },

        isButtonClicked(buttons: any, target: Node): boolean {

            for (const button of buttons) {
                if (button.contains(target)) {
                    return true;
                }
            }
            return false;
        },
        // getPseudo() {
        //     var pseudo = localStorage.getItem('pseudoP1');
        //     if (!pseudo) {
        //         return 'Randomname';
        //     } else {
        //         return pseudo;
        //     }
        // },

        start() {
            this.socket.emit('game started', this.gamesChosen);
        }
    }
})
</script>

<style lang="css" scoped>
@import url('./game-select.css');
@import url('./game-select-mobile.css');
</style>