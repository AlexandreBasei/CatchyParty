<template>
    <div class="content" v-if="!game1">
        <section class="playersList">
            <h3>{{ $t('JOUEURS') }}</h3>
            <div class="playersContainer" v-for="room in rooms" :key="room.id">
                <div class="playerContainer" v-if="room.id === player.roomId">
                    <div v-for="rplayer in room.players" :key="rplayer.socketId" style="position: relative;">

                        <ProfilePicture class="white-profile" :bodyIndex="rplayer.avatar[0]"
                            :eyesIndex="rplayer.avatar[1]" :mouthIndex="rplayer.avatar[2]" />

                        <span class="pseudoPlayer">
                            <span v-if="rplayer.host">👑 </span>
                            {{ rplayer.username }}
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
        <section class="personalization-section">
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

                <h3>Déroulement de la Partie ({{ gamesChosen.length }}/{{ maxRounds }})</h3>

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
                <h2>L'hôte configure la partie...</h2>
            </div>

            <form @submit.prevent="start()">
                <button class="startGame"
                    :disabled="((roomWithPlayers && roomWithPlayers.players.length < 2 || gamesChosen.length < 1)) || !player.host">{{
        $t('DEMARRER_PARTIE') }}</button>

                <div class="messages" v-if="rooms">
                    <span v-if="roomWithPlayers" :class="{ 'green-text': roomWithPlayers.players.length >= 2 }">
                        {{ roomWithPlayers.players.length >= 2 ? 'Assez de joueurs' : 'Pas assez de joueurs' }} ({{
        roomWithPlayers.players.length }})
                    </span>
                    <span v-if="gamesChosen" :class="{ 'green-text': gamesChosen.length >= 1 }">
                        {{ gamesChosen.length >= 1 ? 'Assez de jeux' : 'Pas assez de jeux' }} ({{ gamesChosen.length }})
                    </span>
                </div>
            </form>
        </section>
    </div>

    <Kbnotes v-if="game1" :socket="socket"></Kbnotes>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import io from 'socket.io-client';
import Kbnotes from "@/components/Keyboard-notes/KeyboardNotes.vue";
import ProfilePicture from "@/components/ProfilePicture/ProfilePicture.vue";

interface Room {
    id: string;
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
        ProfilePicture
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
            game1: false,
            game2: false,
            game3: false,
            maxRounds: 5,
            currentRound: 0,
            games: [
                { id: 1, name: this.$t('KEYBOARD_NOTES'), image: require("@/assets/svg/partinies/solar.svg") },
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
        });

        this.socket.on('get rounds', (maxRounds: number) => {
            this.maxRounds = maxRounds;
        })

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

            this.gamesChosen = gamesChosen;

            switch (this.gamesChosen[this.currentRound]) {
                case 1:
                    this.game1 = true;
                    this.game2 = false;
                    this.game3 = false;
                    break;
                case 2:
                    this.game1 = false;
                    this.game2 = true;
                    this.game3 = false;
                    break;
                case 3:
                    this.game1 = false;
                    this.game2 = false;
                    this.game3 = true;
                default:
                    break;
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

        setInterval(() => {
            this.updRooms();
        }, 20);

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
    computed: {
        roomWithPlayers() {
            return this.rooms.find(room => room.id === this.player.roomId);
        }
    },
    methods: {
        handleDragStart(game: { id: number }) {
            this.draggedGameId = game.id;
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
            if (this.gamesChosen.length < this.maxRounds) {
                this.gamesChosen.push(id);
                this.socket.emit('update gamesChosen', this.gamesChosen);
            }
        },
        handleRemoveGame(index: number) {
            this.gamesChosen.splice(index, 1);
            this.socket.emit('update gamesChosen', this.gamesChosen);
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

            this.socket.on('list rooms', (rooms: Room[]) => {
                this.rooms = rooms;
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
        // updateAvatar() {
        //     var img = document.getElementById('avatarImg');
        //     var avatarPath = this.getAvatar();
        //     // img.src = avatarPath;
        //     // var img1 = document.getElementById('pseudoPlayer1');
        //     // var pseudoText = this.getPseudo();
        //     // img1.textContent = pseudoText;
        // },
        // getAvatar() {
        //     var avatar = localStorage.getItem('selectedAvatar');
        //     if (avatar == 'Avatar 1') {
        //         return '../../assets/Comparaison.png';
        //     }
        //     if (avatar == 'Avatar 2') {
        //         return '../../assets/Realping.png';
        //     }
        //     if (avatar == 'Avatar 3') {
        //         return '../../assets/security.png';
        //     }
        // },
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