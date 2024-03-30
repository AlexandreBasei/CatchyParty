<template>
    <div class="content" v-if="!game1">
        <section class="playersList">
            <h3>Players</h3>
            <div class="playersContainer" v-for="room in rooms" :key="room.id">
                <div class="playerContainer" v-if="room.id === player.roomId">
                    <div v-for="rplayer in room.players" :key="rplayer.socketId" style="position: relative;">

                        <img v-if="rplayer.avatar === 'Avatar1'" class="player-icon" src="../../assets/Avatar1.png"
                            id="avatarImg" alt="Avatar">
                        <img v-else-if="rplayer.avatar === 'Avatar2'" class="player-icon" src="../../assets/Avatar2.png"
                            id="avatarImg" alt="Avatar">
                        <img v-else-if="rplayer.avatar === 'Avatar3'" class="player-icon" src="../../assets/Avatar3.png"
                            id="avatarImg" alt="Avatar">

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
                            <button @click="setHost(rplayer)">Define new room's host</button>
                            <button style="color: red;" @click="kickPlayer(rplayer.socketId)">Kick this player</button>
                        </div>
                    </div>
                </div>
            </div>
            <p id="shareLink" @click="copy(`localhost:8080?room=${player.roomId}`)">Copier le lien d'invitation</p>
        </section>
        <main class="personalization-main">
            <section class="settings">
                <form>
                    <label for="nbPlayers">Number of players</label>
                    <select id="nbPlayers">

                    </select>
                    <br>
                    <label for="nbRounds">Number of rounds</label>
                    <select id="nbRounds">

                    </select>
                    <br>
                    <input type="submit" value="Select" class="submitBtn">
                    <button class="startGame" @click="start('game1')" v-if="player.host">Start Game</button>
                    </form>
                <div>
                    <h3>Game selection</h3>

                    <div class="game-options">
                        <div class="game-container">
                            <div class="game" @click="toggleSelection"><img src="../../assets/svg/img-jeu.png"
                                    alt="Game 1"></div>
                            <p>Game1</p>
                        </div>
                        <div class="game-container">
                            <div class="game" @click="toggleSelection"><img src="../../assets/svg/img-jeu.png"
                                    alt="Game 2"></div>
                            <p>Game2</p>
                        </div>
                        <div class="game-container">
                            <div class="game" @click="toggleSelection"><img src="../../assets/svg/img-jeu.png"
                                    alt="Game 3"></div>
                            <p>Game3</p>
                        </div>
                        <div class="game-container">
                            <div class="game" @click="toggleSelection"><img src="../../assets/svg/img-jeu.png"
                                    alt="Game 4"></div>
                            <p>Game4</p>
                        </div>
                        <div class="game-container">
                            <div class="game" @click="toggleSelection"><img src="../../assets/svg/img-jeu.png"
                                    alt="Game 5"></div>
                            <p>Game5</p>
                        </div>
                        <div class="game-container">
                            <div class="game" @click="toggleSelection"><img src="../../assets/svg/img-jeu.png"
                                    alt="Game 6"></div>
                            <p>Game6</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <Kbnotes v-if="game1" :socket="socket"></Kbnotes>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import io from 'socket.io-client';
import Kbnotes from "../Keyboard-notes/KeyboardNotes.vue";

interface Room {
    id: string;
    players: {
        host: boolean,
        avatar: string,
        roomId: string,
        socketId: string,
        username: string,
        idea: boolean,
        tabAttributed: boolean,
    }[];
}

interface Player {
    host: boolean,
    avatar: string,
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
    components: {
        Kbnotes,
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
        });

        this.socket.on('new host', (newHostId: string) => {
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

        exitRoom() {
            this.rooms.forEach(room => {
                if (room.id === this.currentRoom) {
                    this.player.host = false;
                    this.player.username = "";
                    this.player.roomId = "";
                    this.player.turn = false;
                    this.player.win = false;
                    this.socket.emit("exit room");
                    window.location.reload();
                }
            });
        },

        kickPlayer(socketId: string) {
            this.rooms.forEach(room => {
                if (room.id === this.currentRoom) {
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

        // isButtonClicked(buttons: NodeListOf<HTMLElement>, target: Node): boolean {
        //     for (const button of buttons) {
        //         if (button.contains(target)) {
        //             return true;
        //         }
        //     }
        //     return false;
        // },

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

<style scoped>
.playerContainer img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

.personalization-main {
    background-color: var(--tertiary);
    border-radius: 20px;
}

ul {
    list-style-type: none;
}

ul li {
    width: fit-content;
}

#shareLink, .startGame{
    background-color: var(--quaternary);
    color: var(--black);
    font-weight: 600;
    padding: 5%;
    border-radius: 20px;
    border-color: transparent;
    cursor: pointer;
    transition: all 0.2s ease;
}

#shareLink:hover, .startGame:hover {
    transform: scale(1.03);
}

.hostMenuButton {
    background-color: transparent;
    border: none;
    cursor: pointer;
    width: 0px;
    height: 15px;
    margin: 0;
    padding-right: 10px;
}

.hostMenu {
    display: none;
    position: absolute;
    left: 100%;
    top: 100%;
    width: 50%;
    flex-flow: wrap row;
    align-items: start;
    justify-content: center;
    background-color: var(--quaternary);
    border-radius: 15px;
    padding: 10px;
    z-index: 10;
}

.hostMenu button {
    background-color: var(--quaternary);
    border: none;
    cursor: pointer;
}

.hostMenu button:hover {
    opacity: .5;
}

.hostMenu button:first-child {
    border-bottom: 1px solid black;
}

@media only screen and (max-width: 600px) {

    .personalization-main {
        height: auto;
        margin: 5% 5% 15% 5%;
    }

    header {
        height: 10vh;
    }

    footer {
        height: 5vh;
    }

    .player-icon {
        width: 20px;
        height: 20px;
    }

    .playersList {
        background-color: var(--tertiary);
        border-radius: 20px;
        margin: 2% 5% 0 5%;
        padding: 20px;
        display: flex;
        flex-flow: wrap column;
        ;
        justify-content: center;
        align-items: center;
    }

    .playersList h3 {
        margin: 0 0 15px 0;
        text-align: center;
    }

    .playersList p {
        margin: 0 0 0 0;
    }
}

@media only screen and (min-width: 1000px) {
    .playersList {
        background-color: var(--tertiary);
        border-radius: 20px;
        margin: 2% 5% 0 5%;
        padding: 20px 40px;
        width: 20%;
    }

    .settings {
        width: auto;
        display: flex;
        gap: 10vh;
    }

    .game-container {
        width: 30%;
    }

    .game-options {
        justify-content: center;
    }

    .personalization-main {
        padding: 5vh;
    }
}
</style>