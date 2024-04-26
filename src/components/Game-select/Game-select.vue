<template>
    <div class="content" v-if="!game1">
        <section class="playersList">
            <h3>{{ $t('JOUEURS') }}</h3>
            <div class="playersContainer" v-for="room in rooms" :key="room.id">
                <div class="playerContainer" v-if="room.id === player.roomId">
                    <div v-for="rplayer in room.players" :key="rplayer.socketId" style="position: relative;">

                        <ProfilePicture :bodyIndex="rplayer.avatar[0]" :eyesIndex="rplayer.avatar[1]" :mouthIndex="rplayer.avatar[2]" />

                        <p class="pseudoPlayer">
                            <span v-if="rplayer.host">👑 </span>
                            {{ rplayer.username }}
                            <button v-if="player.host && rplayer.socketId !== player.socketId"
                                @click="displayHostMenu(rplayer.socketId)" class="hostMenuButton">
                                <svg width="10px" height="15px" xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF"
                                    class="bi bi-three-dots-vertical">
                                    <path
                                        d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                </svg>
                            </button>
                        </p>

                        <div v-bind:id="rplayer.socketId" class="hostMenu">
                            <button @click="setHost(rplayer)">{{ $t('NOUVEAU_HOTE') }}</button>
                            <button style="color: red;" @click="kickPlayer(rplayer.socketId)">{{ $t('EJECTER_JOUEUR') }}</button>
                        </div>
                    </div>
                </div>
            </div>
            <p id="shareLink" @click="copy(`localhost:8080?room=${player.roomId}`)">{{ $t('COPIER_LIEN') }}</p>
        </section>
        <main class="personalization-main">
            <section class="settings">
                <div>
                    <h3>{{ $t('SELECTION_DES_JEUX') }}</h3>

                    <div class="game-options">
                        <div class="game-container">
                            <div class="game" @click="toggleSelection">
                                <img src="../../assets/svg/img-jeu.png" alt="Game 1">
                            </div>
                            <p>{{ $t('KEYBOARD_NOTES') }}</p>
                        </div>
                        <div class="game-container">
                            <div class="game" @click="toggleSelection">
                                <img src="../../assets/svg/img-jeu.png" alt="Game 2">
                            </div>
                            <p>Classico</p>
                        </div>
                        <div class="game-container">
                            <div class="game" @click="toggleSelection">
                                <img src="../../assets/svg/img-jeu.png" alt="Game 3">
                            </div>
                            <p>What's the situation ?</p>
                        </div>
                    </div>
                </div>

                <form @submit.prevent="start('game1')">
                    <div class="personalization-options">
                        <div>
                            <label for="nbPlayers">{{ $t('NOMBRE_DE_JOUEURS') }}</label>
                            <select id="nbPlayers"></select>
                        </div>
                        <div>
                            <label for="nbRounds">{{ $t('NOMBRE_DE_MANCHES') }}</label>
                            <select id="nbRounds"></select>
                        </div>
                    </div>

                    <!-- <input type="submit" value="Select" class="submitBtn"> -->
                    <button class="startGame" v-if="player.host">{{ $t('DEMARRER_PARTIE') }}</button>
                </form>
            </section>
        </main>
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
        avatar: [number,number,number],
        roomId: string,
        socketId: string,
        username: string,
        idea: boolean,
        tabAttributed: boolean,
    }[];
}

interface Player {
    host: boolean,
    avatar: [number,number,number],
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
    homepage:'',
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
            game1: false,
        }
    },

    mounted() {
        this.socket.on('join room', (player: any) => {
            this.player = player;
            this.currentRoom = player.roomId;
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

        this.socket.on('game start', (game: string) => {
            console.log("GAME1 START");

            if (game === "game1") {
                this.game1 = true;
                this.socket.emit('sendPlayer:3', this.player);
            }
        })

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

        this.roundsNumber();
        this.playersNumber();
        // this.updateAvatar();

    },
    methods: {
        updRooms() {
            this.socket.emit('get rooms');

            this.socket.on('list rooms', (rooms: Room[]) => {
                this.rooms = rooms;
            });
        },

        resetPlayer() {
            this.player.host = false;
            this.player.username = "";
            this.player.avatar = [0,0,0];
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

        copy(text: string) {
            navigator.clipboard.writeText(text);
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
        roundsNumber() {
            var selectElement = document.getElementById("nbRounds");

            for (var i = 1; i <= 3; i++) {
                var option = document.createElement("option");
                option.text = i.toString();
                option.value = i.toString();
                if (selectElement) {
                    selectElement.appendChild(option);
                }
            }
        },

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
            console.log("saas");

            for (const button of buttons) {
                if (button.contains(target)) {
                    return true;
                }
            }
            return false;
        },

        toggleSelection(event: MouseEvent) {
            if (event.currentTarget instanceof HTMLElement) {
                event.currentTarget.classList.toggle("selected");
            }
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

        start(game: string) {
            if (game === "game1") {
                this.socket.emit('game started', game);
            }
        }
    }
})
</script>

<style lang="css" scoped>
    @import url('./game-select.css');
</style>