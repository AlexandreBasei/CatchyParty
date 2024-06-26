<template>
    <section>
        <h1>Song Search</h1>
        <input type="text" id="artistInput" placeholder="Artist Name" v-model="artist">
        <input type="text" id="titleInput" placeholder="Song Title" v-model="title">
        <button @click="searchSong()">Search</button>
        <div id="result"></div>
        <div id="checkboxSection"></div>
        <button id="getSelectedGenres" @click="getRandomArtist">Get Selected Genres</button>
        <div id="selectedGenres"></div>
        <div id="randomArtist"></div>
        <div id="lyrics">{{ lyrics }}</div>
    </section>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import jsonData from '../../assets/artists.json';
import io from 'socket.io-client';

export default defineComponent({
    //Ici les variables utilisées dans le DOM
    data() {
        return {
            artist: "",
            title: "",
            jsonData: jsonData,
            socket: io('http://localhost:3000'),
            lyrics: "",
        }
    },
    // Ici tout le code procédural
    mounted() {
        // Appeler la fonction à un endroit approprié, par exemple au chargement de la page
        this.fetchAndCreateCheckboxes();

        this.socket.on('get lyrics', (lyrics) => {
            this.lyrics = lyrics;
        });
    },
    //Ici les fonctions (méthodes)
    methods: {
        async fetchAndCreateCheckboxes(): Promise<void> {
            try {
                const checkboxSection = document.getElementById('checkboxSection');

                for (const genre in this.jsonData) {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.name = 'genre';
                    checkbox.value = genre;
                    checkbox.id = genre;

                    const label = document.createElement('label');
                    label.htmlFor = genre;
                    label.textContent = genre;

                    if (checkboxSection) {
                        checkboxSection.appendChild(checkbox);
                        checkboxSection.appendChild(label);
                        checkboxSection.appendChild(document.createElement('br'));
                    }
                }
            } catch (error) {
                console.error('Error fetching JSON:', error);
            }
        },

        async searchSong() {
            try {
                const response = await fetch(`/search?artist=${encodeURIComponent(this.artist)}&title=${encodeURIComponent(this.title)}`);
                const data = await response.json();
                const resultDiv = document.getElementById('result');

                if (resultDiv) {
                    if (data.error) {
                        resultDiv.innerText = data.error;
                    } else {
                        resultDiv.innerHTML = `
                                <h2>${data.title}</h2>
                                <p>Artist: ${data.primary_artist.name}</p>
                                <p>URL: <a href="${data.url}" target="_blank">${data.url}</a></p>
                            `;
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        },
        async getSelectedGenres() {
            /*eslint no-undef: 0*/
            const checkboxes: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[name=genre]:checked');
            const selectedGenres = Array.from(checkboxes).map(checkbox => checkbox.value);
            return selectedGenres;
        },
        async getRandomArtist() {
            const selectedGenres = await this.getSelectedGenres();
            if (selectedGenres.length === 0) {
                alert('Veuillez sélectionner au moins un genre.');
                return;
            }

            const randomGenre = selectedGenres[Math.floor(Math.random() * selectedGenres.length)];
            const artistsInGenre = await this.getArtistsInGenre(randomGenre);
            if (artistsInGenre.length === 0) {
                alert(`Aucun artiste trouvé dans le genre "${randomGenre}".`);
                return;
            }

            const randomArtist = artistsInGenre[Math.floor(Math.random() * artistsInGenre.length)];
            const randomSong = await this.getRandomSong(randomArtist);
            if (randomSong) {
                const randomArtistElement = document.getElementById('randomArtist');
                if (randomArtistElement) {
                    randomArtistElement.innerHTML = `
                            <p>Random Artist in ${randomGenre}: ${randomArtist}</p>
                            <p>Random Song: <a href="${randomSong.url}" target="_blank">${randomSong.title}</a></p>`;

                    const lyrics = await this.getLyrics(randomArtist, randomSong.title);
                    if (lyrics) {
                        const lyricsElement = document.getElementById('lyrics');
                        if (lyricsElement) {
                            lyricsElement.textContent = lyrics;
                        }
                    } else {
                        alert(`Aucune paroles trouvées pour la chanson "${randomSong.title}".`);
                    }
                }
            } else {
                alert(`Aucune chanson trouvée pour l'artiste "${randomArtist}".`);
            }
        },
        async getArtistsInGenre(genre: string) {
            try {
                const data: { [index: string]: string[]; } = this.jsonData;
                return data[genre] || [];
            } catch (error) {
                console.error('Error fetching artists:', error);
                return [];
            }
        },
        async getRandomSong(artistName: string) {
            try {
                const response = await fetch(`http://localhost:3000/randomSong?artist=${encodeURIComponent(artistName)}`);
                await console.log(response);
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error fetching song:', error);
                return null;
            }
        },
        async getLyrics(ArtistName: string, songName: string) {
            try {
                const response = await fetch(`http://localhost:3000/lyrics?ArtistName=${encodeURIComponent(ArtistName)}&songName=${encodeURIComponent(songName)}`);
                const data = await response.json();
                this.socket.emit("send id",this.socket.id)
                return data;
            } catch (error) {
                console.error('Error fetching lyrics:', error);
                return null;
            }
        }
    }
})
</script>
