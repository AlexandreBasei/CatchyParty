<template>
    <div>
      <input type="text" v-model="username" placeholder="Entrez votre nom" />
      <button @click="joinRoom">Rejoindre la salle</button>
      <div v-if="joinedRoom">
        <h2>Bienvenue dans la salle {{ roomName }}</h2>
        <ul>
          <li v-for="user in users" :key="user.id">{{ user.name }}</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, Ref } from 'vue';
  import io from 'socket.io-client';
  
  interface User {
    id: string;
    name: string;
  }
  
  export default defineComponent({
    props: {
      serverUrl: { type: String, default: 'http://localhost:3000' },
      roomId: { type: String, required: true },
    },
    setup(props) {
      // const socket: Ref<SocketIOClient.Socket | null> = ref(null);
      const username = ref('');
      const joinedRoom = ref(false);
      const roomName = ref('');
      const users = ref<User[]>([]);
  
      const joinRoom = () => {
        // if (username.value && props.roomId && socket.value) {
        //   // socket.value.emit('joinRoom', { username: username.value, roomId: props.roomId });
        //   joinedRoom.value = true;
        // }
      };
  
      // socket.value = io(props.serverUrl);
      // socket.value.on('connect', () => {
      //   console.log('Connected to server');
      // });
      // socket.value.on('roomInfo', ({ roomName: name, users: roomUsers }: { roomName: string, users: User[] }) => {
      //   roomName.value = name;
      //   users.value = roomUsers;
      // });
  
      return {
        username,
        joinedRoom,
        roomName,
        users,
        joinRoom,
      };
    },
  });
  </script>
  