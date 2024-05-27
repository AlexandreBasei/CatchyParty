<template>
    <!-- <h1>Current round : {{ currentRound }}</h1> -->
    <div class="content">
        <section class="playersList">
            <h3>{{ $t('JOUEURS') }}</h3>
            <div class="playersContainer" v-for="room in rooms" :key="room.id">
                <div class="playerContainer" v-if="room.id === player.roomId">
                    <div v-for="rplayer in room.players" :key="rplayer.socketId" :class="{ currentPlayer: rplayer.socketId === player.socketId }">

                        <div class="profile-picture-wrapper" :class="{ hosting: rplayer.host }" >
                            <ProfilePicture class="white-profile" :bodyIndex="rplayer.avatar[0]"
                            :eyesIndex="rplayer.avatar[1]" :mouthIndex="rplayer.avatar[2]" />
                        </div>

                        <span class="pseudoPlayer">
                            <span>{{ rplayer.username }}</span>

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
                @click="copyLink">
                <!-- (`localhost:8080?room=${player.roomId}`) -->
                {{ copied ? $t('COPIE') : $t('COPIER_LIEN') }}
            </button>

        </section>
        <section class="personalization-section" :class="{ hosting: player.host }" v-if="game === 0">
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

                <div v-if="!player.host" class="guest-settings">
                    <h2>{{ $t('HOTE_CONFIGURE_PARTIE') }}{{ dots }}</h2>
                </div>
            </div>


            <form @submit.prevent="start()">
                <button class="startGame"
                    :disabled="((currentRoomPlayers && currentRoomPlayers.players.length < 2 || gamesChosen.length < 1)) || !player.host">
                    {{ player.host ? $t('DEMARRER_PARTIE') : $t('HOST_START') }}
                </button>

                <div class="messages">
                    <span v-if="currentRoomPlayers" :class="{ 'green-text': currentRoomPlayers.players.length >= 2 }">
                        {{ currentRoomPlayers.players.length >= 2 ? $t('ASSEZ_DE_JOUEURS') : $t('PAS_ASSEZ_DE_JOUEURS') }} ({{
                        currentRoomPlayers.players.length }})
                    </span>
                    <span v-if="gamesChosen" :class="{ 'green-text': gamesChosen.length >= 1 }">
                        {{ gamesChosen.length >= 1 ? $t('ASSEZ_DE_JEUX') : $t('PAS_ASSEZ_DE_JEUX') }} ({{ gamesChosen.length }})
                    </span>
                </div>
            </form>
        </section>
        <!-- TODO passer en paramètre de component, l'interRoundDuration -->
        <Kbnotes v-else-if="game === 1" :socket="socket" :roomId="player.roomId"></Kbnotes>
        <ClassicoComponent v-else-if="game === 2" :socket="socket" :player="player"></ClassicoComponent>
        <WtsComponent v-else-if="game === 3" :socket="socket" :player="player"></WtsComponent>
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
    round: number;
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
            dots: '' as string,
            maxDots: 3,
            interval: undefined as number | undefined,
            interRoundDuration: 5,
            isKicked: false,
        }
    },  
    created() {
        this.startDotsAnimation();
    },
    beforeUnmount() {
        this.stopDotsAnimation();
    },
    computed: {
        currentRoomPlayers() {
            return this.rooms.find(room => room.id === this.player.roomId);
        },
    },
    mounted() {
        //Message de confirmation reload page
        // window.addEventListener("beforeunload", this.beforeUnloadHandler);
        
        // setInterval(() => {
            this.updRooms();
        // }, 20);

        this.socket.on('join room', (player: any) => {
            this.player = player;
            this.currentRoom = player.roomId;
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
                this.isKicked = true;
                this.exitRoom();
                console.log('kicked');
            }
        });

        this.socket.on('game start', (gamesChosen: []) => {

            // this.gamesChosen = gamesChosen;
            console.log("GAMES", this.gamesChosen);
            console.log("CURRENT ROUND", this.currentRound);
            
            if (this.currentRound + 1 <= gamesChosen.length) {
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
            }
            else{
                this.game = 0;
                this.currentRound = 0;
                gamesChosen = [];
            }
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
        })

        this.socket.on('get gamesChosen', (gamesChosen: []) => {
            // console.log('gamesChosen updated in local for everyone to: '+gamesChosen);
            this.gamesChosen = gamesChosen;
        });

        document.addEventListener('click', (event: MouseEvent) => {
            const modals = document.querySelectorAll('.hostMenu') as NodeListOf<HTMLElement>;
            const buttons = document.querySelectorAll('.hostMenuButton') as NodeListOf<HTMLElement>;

            modals.forEach((modal) => {
                if (!modal.contains(event.target as Node) && !this.isButtonClicked(buttons, event.target as Node)) {
                    modal.style.display = 'none';
                }
            });
        });

        // this.roundsNumber();
        // this.playersNumber();
        // this.updateAvatar();

    },
    methods: {
        beforeUnloadHandler(event:any) {
            if (!this.isKicked) {
                const confirmationMessage = "Êtes-vous sûr de vouloir quitter cette page ? Vous quitterez la partie en cours";
                (event || window.event).returnValue = confirmationMessage; // For IE and Firefox
                return confirmationMessage; // For other browsers
            }
        },
        updRooms() {
            this.socket.emit('get rooms');

            this.socket.on('list rooms', (rooms: Room[]) => {
                this.rooms = rooms;
                rooms.forEach(room => {
                    if (this.player.roomId === room.id) {
                        this.gamesChosen = room.gamesChosen;
                    }
                });
            });
        },

        startDotsAnimation() {
            let count = 0;
            this.interval = setInterval(() => {
                count = (count + 1) % (this.maxDots + 1);
                this.dots = '.'.repeat(count);
            }, 1000) as unknown as number;
        },
        stopDotsAnimation() {
            if (this.interval !== undefined) {
                clearInterval(this.interval);
            }
        },

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

        setHost(player: any) {
            this.player.host = false;
            this.socket.emit("set host", player);

            const menuToDisplay = document.getElementById(player.socketId);

            if (menuToDisplay) {
                menuToDisplay.style.display = "none";
            }
        },
        kickPlayer(socketId: string) {
            this.rooms.forEach(room => {
                if (room.id === this.currentRoom) {
                    console.log("kick");
                    this.socket.emit("kick player", socketId);
                }
            });
        },

        sendRounds() {
            this.socket.emit("send rounds", this.maxRounds, this.player.roomId);
        },
        getRounds() {
            this.socket.emit("get rounds");
        },

        copyLink() {
            const link = `${window.location.origin}?room=${this.player.roomId}`;
            navigator.clipboard.writeText(link).then(() => {
                this.copied = true;
                setTimeout(() => {
                    this.copied = false;
                }, 1500);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        },

        // playersNumber() {
        //     var selectElement = document.getElementById("nbPlayers");

        //     for (var i = 1; i <= 10; i++) {
        //         var option = document.createElement("option");
        //         option.text = i.toString();
        //         option.value = i.toString();
        //         if (selectElement) {
        //             selectElement.appendChild(option);
        //         }
        //     }
        // },
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
        isButtonClicked(buttons: any, target: Node): boolean {

            for (const button of buttons) {
                if (button.contains(target)) {
                    return true;
                }
            }
            return false;
        },

        start() {
            if (this.player.host) {
                this.socket.emit('game started', this.gamesChosen, this.player.roomId);
            }
        }
    }
})
</script>

<style lang="css" scoped>
@import url('./game-select.css');
@import url('./game-select-mobile.css');
</style>