const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const request = require('request');
const path = require('path');
const axios = require('axios');

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));

const accessToken = 'UDBHDpaFEmGKgTq1nVV05iYgRYYEiB8pRXAlbxHtuKX-XyHeuWVPeg61itryYxm1';


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

// --------------------------- Partie recherche de musique ----------------------

function searchSong(artistName, songTitle, callback) {
  // Encode the artist name and song title for the URL
  const artistEncoded = encodeURIComponent(artistName);
  const titleEncoded = encodeURIComponent(songTitle);
  const query = `${artistEncoded} ${titleEncoded}`;

  // API endpoint for searching songs
  const apiUrl = `https://api.genius.com/search?q=${query}`;

  // Options for the request
  const options = {
      url: apiUrl,
      headers: {
          'Authorization': `Bearer ${accessToken}`
      }
  };

  // Make the GET request
  request.get(options, (error, response, body) => {
      if (error) {
          callback(error, null);
      } else if (response.statusCode !== 200) {
          callback(`Status: ${response.statusCode}`, null);
      } else {
          try {
              // Parse the JSON response
              const searchData = JSON.parse(body);
              // Check if there are any search results
              if (searchData.response.hits.length > 0) {
                  // Extract the first search result (assuming it's the most relevant)
                  const songInfo = searchData.response.hits[0].result;
                  callback(null, songInfo);
              } else {
                  callback('Song not found and', null);
              }
          } catch (parseError) {
              callback('Error parsing JSON response', null);
          }
      }
  });
}

function getRandomSongs(genre, callback) {
  // Encode the genre for the URL
  const genreEncoded = encodeURIComponent(genre);

  // API endpoint for searching songs by genre
  const apiUrl = `https://api.genius.com/search?q=${genreEncoded}&per_page=100`;

  // Options for the request
  const options = {
      url: apiUrl,
      headers: {
          'Authorization': `Bearer ${accessToken}`
      }
  };

  // Make the GET request
  request.get(options, (error, response, body) => {
      if (error) {
          callback(error, null);
      } else if (response.statusCode !== 200) {
          callback(`Status: ${response.statusCode}`, null);
      } else {
          try {
              // Parse the JSON response
              const searchData = JSON.parse(body);
              // Check if there are any search results
              if (searchData.response.hits.length > 0) {
                  // Extract all songs from the search results
                  const songs = searchData.response.hits;
                  callback(null, songs);
              } else {
                  callback('No songs found for the selected genre', null);
              }
          } catch (parseError) {
              callback('Error parsing JSON response', null);
          }
      }
  });
}

function getRandomElements(array, count) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Endpoint pour récupérer une chanson aléatoire d'un artiste depuis l'API Genius
app.get('/randomSong', async (req, res) => {
  const artistName = req.query.artist;

  try {
      const response = await axios.get(`https://api.genius.com/search?q=${encodeURIComponent(artistName)}`, {
          headers: {
              'Authorization': `Bearer ${accessToken}`
          }
      });
      const data = response.data;

      // Vérifier si la recherche a renvoyé des résultats
      if (data.meta.status === 200 && data.response.hits.length > 0) {
          // Sélectionner une chanson aléatoire parmi les résultats de la recherche
          const randomIndex = Math.floor(Math.random() * data.response.hits.length);
          const songInfo = data.response.hits[randomIndex].result;

          res.json({
              title: songInfo.title,
              url: songInfo.url,
              id: songInfo.id,
          });
      } else {
          console.error('No results found for artist:', artistName);
          res.status(404).json({ error: 'No results found' });
      }
  } catch (error) {
      console.error('Error fetching song:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint pour récupérer les paroles d'une chanson depuis l'API Genius
app.get('/lyrics', async (req, res) => {
  const songId = req.query.id;
  const titleSong = req.query.songName;
  const ArtistName = req.query.ArtistName;

  try {
      const options = {
          apiKey: 'UDBHDpaFEmGKgTq1nVV05iYgRYYEiB8pRXAlbxHtuKX-XyHeuWVPeg61itryYxm1',
          title: `${titleSong}`,
          artist: `${ArtistName}`,
          optimizeQuery: true
      };

      console.log(options);
      let lyricsContent  = document.getElementById("lyricsDiv"); // Déclaration de la variable lyricsContent en dehors de la promesse

      getLyrics(options).then((lyrics) => {
          console.log(lyrics); // Affiche les paroles dans la console
          lyricsContent.innerHTML = lyrics; // Attribution de la valeur des paroles à la variable lyricsContent
          
      });

      getSong(options).then((song) =>
          console.log(`${song.id} - ${song.title} - ${song.url} - ${song.albumArt} - ${song.lyrics}`)
      );
  } catch (err) {
      console.error("Erreur lors de la récupération des données : ", err);
      return res.sendStatus(500);
  }
});

// Route to search for song information
app.get('/search', (req, res) => {
  const artistName = req.query.artist;
  const songTitle = req.query.title;

  searchSong(artistName, songTitle, (error, songInfo) => {
      if (error) {
          res.status(404).send('Song not found');
      } else {
          res.json(songInfo);
      }
  });
});

// Route to redirect to index.html
app.get('/', (req, res) => {
  res.redirect('index.html');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});