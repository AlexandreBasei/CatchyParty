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

const rooms = [];

io.on('connection', (socket) => {
    console.log(`[connection] ${socket.id}`);

  socket.on('get rooms', () => {
    io.emit('list rooms', rooms);
  });

  socket.on('playerData', (player) => {
    if (player.host) {
      // Générer l'ID de la nouvelle salle
      const newRoomId = generateRoomId();
      const newRoom = {
        id: newRoomId, // Assigner l'ID généré à la nouvelle salle
        players: [player],
      };
      rooms.push(newRoom);
      io.emit('list rooms', rooms);
      socket.emit('join room', newRoomId); // Envoyer l'ID de la nouvelle salle au joueur
    } else {
      const room = rooms.find((room) => room.id === player.roomId);
      if (room && room.players.length < 10) { // Limiter à 10 joueurs par salon
        room.players.push(player);
        io.emit('list rooms', rooms);
      } else {
        socket.emit('room full', player.roomId);
      }
    }
  });

  socket.on('get room players', (roomId) => {
    const room = rooms.find((room) => room.id === roomId);
    if (room) {
      io.to(roomId).emit('room players updated', room.players);
    }
  });

  socket.on('play', (player) => {
    socket.to(player.roomId).emit('play', player);
  });

  socket.on('play again', (roomId) => {
    const roomIndex = rooms.findIndex((room) => room.id === roomId);
    if (roomIndex !== -1) {
      rooms.splice(roomIndex, 1);
      io.emit('list rooms', rooms);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté');
    // Gérer la déconnexion d'un joueur (supprimer le joueur du salon, etc.)
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

function generateRoomId() {
  return Math.random().toString(36).substr(2, 8);
}
