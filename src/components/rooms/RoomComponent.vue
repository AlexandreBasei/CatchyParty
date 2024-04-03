<template>
    <!-- Affichage accueil -->
    <section v-if="!roomJoined && !roomId">
        <h1>Créer ou rejoindre un salon</h1>

        <div v-if="rooms.length > 0">
            <ul>
                <li v-for="room in rooms" :key="room.id">
                    {{ room.players.length }} / 10
                    - Salon de {{ room.players[0].username }}
                    - {{ room.id }}
                    <button @click="joinRoom(room)">Rejoindre</button>
                </li>
            </ul>
        </div>
        <div v-else>
            <p>Aucun salon disponible pour le moment</p>
        </div>

        <form @submit.prevent="createRoom">
            <label for="username">Nom d'utilisateur : </label>
            <input type="text" v-model="username" required>
            <button type="submit">Créer un salon</button>
        </form>
    </section>

    <!-- Affichage rejoindre salle via l'url -->
    <section v-else-if="roomId">
        <div v-for="room in rooms" :key="room.id">
            <div v-if="room.id === roomId">
                <h1>Vous allez rejoindre la salle de {{ room.players[0].username }}</h1>
                <form @submit.prevent="joinRoom(room)">
                    <label for="username">Nom d'utilisateur : </label>
                    <input type="text" v-model="username" required>
                    <button type="submit">Rejoindre</button>
                </form>
                <button @click="reload">Retourner à l'accueil</button>
            </div>
        </div>
    </section>

    <!-- Affichage salle rejointe-->
    <section v-else-if="roomJoined">
        <p>Vous avez rejoint un salon avec les joueurs suivants :</p>
        <div v-for="room in rooms" :key="room.id">
            <ul v-if="room.id === currentRoom">
                <li v-for="rplayer in room.players" :key="rplayer.socketId" style="position: relative;">
                    <span v-if="rplayer.host">👑</span>
                    {{ rplayer.username }}
                    <button v-if="player.host && rplayer.socketId !== player.socketId"
                        @click="displayHostMenu(rplayer.socketId)" class="hostMenuButton">
                        <svg width="10px" height="15px" xmlns="http://www.w3.org/2000/svg" fill="#000000"
                            class="bi bi-three-dots-vertical">
                            <path
                                d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                        </svg>
                    </button>
                    <div v-bind:id="rplayer.socketId" class="hostMenu">
                        <button @click="setHost(rplayer)">Define new room's host</button>
                        <button style="color: red;" @click="kickPlayer(rplayer.socketId)">Kick this player</button>
                    </div>
                </li>
                <p id="shareLink" @click="copy(`localhost:8080?room=${currentRoom}`)">Copier le lien d'invitation</p>
                <button v-if="room.players.length > 1" @click="play">Démarrer la partie</button>
                <button @click="exitRoom">Quitter la partie</button>
            </ul>
        </div>
    </section>

    <!-- Affichage salle n'existe pas -->
    <section v-if="!roomJoined && roomId">
        <div v-if="rooms.length === 0">
            <p>Le salon que vous essayez de rejoindre n'existe pas</p>
            <button @click="reload">Retourner à l'accueil</button>
        </div>
        <div v-for="room in rooms" :key="room.id">
            <div v-if="room.id !== roomId || !rooms">
                <p>Le salon que vous essayez de rejoindre n'existe pas</p>
                <button @click="reload">Retourner à l'accueil</button>
            </div>
        </div>

    </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import io from 'socket.io-client';

interface Room {
    id: string;
    players: {
        host: boolean,
        roomId: string,
        socketId: string,
        username: string,
        turn: boolean,
        win: boolean,
    }[];
}

export default defineComponent({
    data() {
        return {
            username: '',
            rooms: [] as Room[],
            socket: io('http://localhost:3000'),
            roomJoined: false,
            currentRoom: '',
            player: {
                host: false,
                roomId: "",
                username: "",
                socketId: "",
                turn: false,
                win: false,
            },
            roomId: "",
        }
    },
    mounted() {

        this.socket.on('join room', (roomId) => {
            this.player.roomId = roomId;
            this.currentRoom = roomId;
        });

        this.socket.on('new host', (newHostId) => {
            if (this.player.socketId === newHostId) {
                this.player.host = true;
            }
        });

        this.socket.on('kicked', (kickedId) => {
            if (this.player.socketId === kickedId) {
                this.exitRoom();
                console.log('kicked');
            }
        });

        setInterval(() => {
            this.updRooms();
        }, 20);

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const roomId = urlParams.get('room');
        this.roomId = roomId ?? "";

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
    },
    methods: {
        updRooms() {
            this.socket.emit('get rooms');

            this.socket.on('list rooms', (rooms: Room[]) => {
                this.rooms = rooms;
            });
        },
        createRoom() {
            if (this.username) {
                this.player.host = true;
                this.player.username = this.username;
                this.player.socketId = this.socket.id ?? "";

                this.socket.emit('playerData', this.player);
                this.roomJoined = true;
            }
        },

        joinRoom(room: Room) {
            if (this.username) {
                this.player.roomId = room.id;
                this.player.username = this.username;
                this.player.socketId = this.socket.id ?? "";

                this.socket.emit('playerData', this.player);
                this.roomJoined = true;
                this.roomId = "";
            }
            else {
                alert("Veuillez entrer un nom d'utilisateur pour rejoindre une partie");
            }
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
                    this.roomJoined = false;
                }
            });
        },

        setHost(player: object) {
            this.player.host = false;
            this.socket.emit("set host", player);
        },

        displayHostMenu(socketId: string) {
            const menuToDisplay = document.getElementById(socketId);

            if (menuToDisplay) {
                menuToDisplay.style.display = "flex";
            }
        },

        isButtonClicked(buttons: NodeListOf<HTMLElement>, target: Node): boolean {
            for (const button of buttons) {
                if (button.contains(target)) {
                    return true;
                }
            }
            return false;
        },

        kickPlayer(socketId: string) {
            this.rooms.forEach(room => {
                if (room.id === this.currentRoom) {
                    this.socket.emit("kick player", socketId);
                }
            });
        },

        reload() {
            window.location.search = '?room=';
        },

        copy(text: string) {
            navigator.clipboard.writeText(text);
        },

        play() {
            console.log('partie démarée !');

        }
    }
})
</script>

<style scoped>

ul{
    list-style-type: none;
}

ul li{
    width: fit-content;
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
    width: 20vw;
    flex-flow: wrap row;
    align-items: start;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: var(--borderradius);
    padding: 10px;
}

.hostMenu button{
    background-color: transparent;
    border: none;
    cursor: pointer;
}

.hostMenu button:hover{
    background-color: rgba(0, 0, 0, 0.4);
}

.hostMenu button:first-child{
    border-bottom: 1px solid black;
}

#shareLink {
    cursor: pointer;
    transition: all 0.2s ease;
}

#shareLink:active {
    transform: scale(1.05);
}
</style>