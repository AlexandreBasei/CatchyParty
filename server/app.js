const { log } = require('console');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

let rooms = [];

io.on('connection', (socket) => {
  console.log(`[connection] ${socket.id}`);

  socket.on('playerData', (player) => {
    console.log(`[playerData] ${player.username}`);

    let room = null;

    if (player.roomId === "") {
      room = createRoom(player);
      console.log(`[create room ] - ${room.id} - ${player.username}`);
    }
    else {
      room = rooms.find(r => r.id === player.roomId);

      if (room === undefined) {
        return;
      }

      player.roomId = room.id;
      room.players.push(player);
    }

    socket.join(room.id);

    io.to(socket.id).emit('join room', room.id);
  });

  socket.on('get rooms', () => {
    io.to(socket.id).emit('list rooms', rooms);
  });

  // socket.on('play', (roomId) => {

  // });

  socket.on('disconnect', () => {
    console.log(`[disconnect] ${socket.id}`);
    let room = null;

    rooms.forEach(r => {
      r.players.forEach(p => {
        if (p.socketId === socket.id && p.host) {
          room = r;
          rooms = rooms.filter(r => r !== room);
        }
      })
    })
  });
})

function createRoom(player) {
  const room = { id: roomId(), players: [] };

  player.roomId = room.id;

  room.players.push(player);
  rooms.push(room);

  return room;
}

function roomId() {
  return Math.random().toString(36).substr(2, 9);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});