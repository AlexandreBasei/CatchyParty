<template>
  <div>
    <div v-if="!roomJoined">
      <h1>Créer ou Rejoindre un Salon</h1>
      <div v-if="rooms.length > 0">
        <ul>
          <li v-for="room in rooms" :key="room.id">
            {{ room.players.length }} / 10
            - Salon de {{ room.players[0].username }}
            - {{ room.id }}
            <button @click="joinExistingRoom(room.id)">Rejoindre</button>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>Aucun salon disponible pour le moment.</p>
      </div>
      <form @submit.prevent="createRoom">
        <label for="username">Nom d'utilisateur:</label>
        <input type="text" v-model="username" required>
        <button type="submit">Créer un salon</button>
      </form>
    </div>
    <div v-else>
      <p>Vous avez rejoint un salon avec les joueurs suivants:</p>
      <div v-for="room in rooms" :key="room.id">
        <ul v-if="room.id === currentRoom">
          <li v-for="player in room.players" :key="player.username">{{ player.username }}</li>
        </ul>
        <p v-else>{{ rooms }}</p>
        <button @click="refreshPlayers()">Actualiser</button>
        <button @click="playGame">Jouer !</button>
      </div>

    </div>
  </div>
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
      socket: io('http://localhost:3000'), // Assuming you have socket.io-client installed
      roomJoined: false,
      currentRoom: '',
    };
  },
  mounted() {
    this.socket.emit('get rooms');
    this.socket.on('list rooms', (rooms: Room[]) => {
      this.rooms = rooms;
    });
  },
  methods: {
    createRoom() {
      if (this.username) {
        const player = {
          host: true,
          roomId: null,
          username: this.username,
          socketId: this.socket.id,
        };
        this.socket.emit('playerData', player);
        this.roomJoined = true;
      }
    },
    joinExistingRoom(room: Room) {
      if (this.username) {
        const player = {
          host: false,
          roomId: room.id,
          username: this.username,
          socketId: this.socket.id,
        };
        this.socket.emit('playerData', player); // Envoyer les informations du joueur au serveur
        console.log(this.rooms);
        this.roomJoined = true;

      }
    },
    refreshPlayers() {

      console.log(this.rooms);

    },
    playGame() {
      this.socket.emit('play', {
        username: this.username,
        // roomId: this.currentRoom.id,
      });
    },
  },
});
</script>

<style scoped>
.message {
  margin-top: 20px;
  padding: 10px;
  background-color: #f0f0f0;
}

li {
  text-decoration: none;
}
</style>