<template>
    <!-- Affichage accueil -->
    <section v-if="!roomJoined && !roomId">
        <h1>{{ $t('CREER_OU_REJOINDRE_SALON') }}</h1>

        <div v-if="rooms.length > 0">
            <ul>
                <li v-for="room in rooms" :key="room.id">
                    {{ room.players.length }} / 10
                    - Salon de {{ room.players[0].username }}
                    - {{ room.id }}
                    <button @click="joinRoom(room)">{{ $t('REJOINDRE') }}</button>
                </li>
            </ul>
        </div>
        <div v-else>
            <p>{{ $t('AUCUN_SALON_DISPONIBLE') }}</p>
        </div>

        <form @submit.prevent="createRoom">
            <label for="username">{{ $t('NOM_UTILISATEUR') }}</label>
            <input type="text" v-model="username" required>
            <button type="submit">{{ $t('CREER_SALON') }}</button>
        </form>
    </section>

    <!-- Affichage rejoindre salle via l'url -->
    <section v-else-if="roomId">
        <div v-for="room in rooms" :key="room.id">
            <div v-if="room.id === roomId">
                <h1>{{ $t('REJOINDRE_LA_SALLE') }}{{ room.players[0].username }}</h1>
                <form @submit.prevent="joinRoom(room)">
                    <label for="username">{{ $t('NOM_UTILISATEUR') }}</label>
                    <input type="text" v-model="username" required>
                    <button type="submit">{{ $t('REJOINDRE') }}</button>
                </form>
                <button @click="reload">{{ $t('RETOURNER_A_ACCUEIL') }}</button>
            </div>
        </div>
    </section>

    <!-- Affichage salle rejointe-->
    <section v-else-if="roomJoined">
        <p>{{ $t('TU_AS_REJOINT_UN_SALON') }}</p>
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
                        <button @click="setHost(rplayer)">{{ $t('CREER_OU_REJOINDRE_SALON') }}</button>
                        <button style="color: red;" @click="kickPlayer(rplayer.socketId)">{{ $t('EJECTER_JOUEUR') }}</button>
                    </div>
                </li>
                <button id="shareLink" @click="copy(`localhost:8080?room=${currentRoom}`)">{{ $t('COPIER_LIEN') }}</button>
                <button v-if="room.players.length > 1" @click="play">{{ $t('DEMARRER_PARTIE') }}</button>
                <button @click="exitRoom">{{ $t('QUITTER_PARTIE') }}</button>
            </ul>
        </div>
    </section>

    <!-- Affichage salle n'existe pas -->
    <section v-if="!roomJoined && roomId">
        <div v-if="rooms.length === 0">
            <p>{{ $t('SALON_EXISTE_PAS') }}</p>
            <button @click="reload">{{ $t('RETOURNER_A_ACCUEIL') }}</button>
        </div>
        <div v-for="room in rooms" :key="room.id">
            <div v-if="room.id !== roomId || !rooms">
                <p>{{ $t('SALON_EXISTE_PAS') }}</p>
                <button @click="reload">{{ $t('RETOURNER_A_ACCUEIL') }}</button>
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

<style lang="css" scoped>
    @import "./roomcomponent.css"
</style>