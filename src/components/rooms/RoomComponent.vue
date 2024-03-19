<template>
    <section v-if="!roomJoined">
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

    <section v-else>
        <p>Vous avez rejoint un salon avec les joueurs suivants :</p>
        <div v-for="room in rooms" :key="room.id">
            <ul v-if="room.id === currentRoom">
                <li v-for="player in room.players" :key="player.username">{{ player.username }}</li>
                <button v-if="room.players.length > 1" @click="play">Démarrer la partie</button>
            </ul>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import io from 'socket.io-client';

interface Room {
    id: string;
    players: { username: string }[];
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
                win: false
            },
            linkToShare: {},
        }
    },
    mounted() {

        this.socket.on('join room', (roomId) => {
            this.player.roomId = roomId;
            this.linkToShare = { link: window.location.href, room: this.player.roomId };
            this.currentRoom = roomId;
        });

        setInterval(() => {
            this.updRooms();
        }, 10);
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
                this.updRooms();
            }
        },

        joinRoom(room: Room) {
            if (this.username) {
                this.player.roomId = room.id;
                this.player.username = this.username;
                this.player.socketId = this.socket.id ?? "";

                this.socket.emit('playerData', this.player);
                console.log(this.rooms);
                this.roomJoined = true;
                this.updRooms();
            }
            else {
                alert("Veuillez entrer un nom d'utilisateur pour rejoindre une partie");
            }
        },

        exitRoom() {
            if (this.roomJoined === true) {
                console.log('exit');

            }
        },

        play() {
            console.log('partie démarée !');

        }
    }
})
</script>
