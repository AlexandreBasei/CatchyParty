<template>
    <div id="piano">
        <div class="key" data-note="A0" draggable="true" v-bind:id="noteID()">A0</div>
        <div class="key" data-note="A1" draggable="true" v-bind:id="noteID()">A1</div>
        <div class="key" data-note="A2" draggable="true" v-bind:id="noteID()">A2</div>
        <div class="key" data-note="B0" draggable="true" v-bind:id="noteID()">B0</div>
        <div class="key" data-note="B1" draggable="true" v-bind:id="noteID()">B1</div>
        <div class="key" data-note="B2" draggable="true" v-bind:id="noteID()">B1</div>
        <div class="key" data-note="C1" draggable="true" v-bind:id="noteID()">C1</div>
        <div class="key" data-note="C2" draggable="true" v-bind:id="noteID()">C2</div>
        <div class="key" data-note="C3" draggable="true" v-bind:id="noteID()">C3</div>
        <div class="key" data-note="D1" draggable="true" v-bind:id="noteID()">D1</div>
        <div class="key" data-note="D2" draggable="true" v-bind:id="noteID()">D2</div>
        <div class="key" data-note="D3" draggable="true" v-bind:id="noteID()">D3</div>
        <div class="key" data-note="E1" draggable="true" v-bind:id="noteID()">E1</div>
        <div class="key" data-note="E2" draggable="true" v-bind:id="noteID()">E2</div>
    </div>
    <div id="note-container"></div>
    <button id="play">Play</button>

</template>

<script lang="ts">

import './style.css';

import { defineComponent, ref, onMounted } from 'vue';
import jsonData from '../../assets/artists.json';
import io from 'socket.io-client';
import { Howl } from 'howler';

interface Notes {
    note:string,
    duration:number,
    interval:number,
}

export default defineComponent({
    //Ici les variables utilisées dans le DOM
    data() {
        return {
            sounds: {} as Record<string, Howl>,
            notesDuration: [] as Notes[],
            socket: io('http://localhost:3000'),
        }
    },
    // Ici tout le code procédural
    mounted() {
        const keys = document.querySelectorAll(".key");
        const noteContainer = document.getElementById("note-container")!;

        keys.forEach((key) => {
            key.addEventListener("dragstart", (event) => {
                if (event instanceof DragEvent) {
                    event.dataTransfer?.setData("text/plain", (event.target as HTMLElement).dataset.note || "");
                }
            });
        });

        noteContainer.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

        noteContainer.addEventListener("drop", (event) => {
            event.preventDefault();
            if (event instanceof DragEvent) {
                const note = event.dataTransfer?.getData("text/plain") || "";
                const noteElement = document.createElement("div");
                noteElement.className = "note";
                noteElement.textContent = note;
                noteElement.dataset.duration = "1"; // Default duration
                const durationInput = document.createElement("input");
                durationInput.type = "range";
                durationInput.min = "0.2";
                durationInput.max = "2";
                durationInput.step = "0.1";
                durationInput.value = "1";
                durationInput.addEventListener("change", () => {
                    this.updateDuration(note, parseFloat(durationInput.value));
                });
                noteContainer.appendChild(noteElement);
                noteContainer.appendChild(durationInput);

                const intervalInput = document.createElement("input");
                intervalInput.type = "range";
                intervalInput.min = "0.0";
                intervalInput.max = "3";
                intervalInput.step = "0.1";
                intervalInput.value = "0";
                intervalInput.addEventListener("change", () => {
                    this.updateInterval(note, parseFloat(intervalInput.value));
                });
                noteContainer.appendChild(intervalInput);

                // Load the sound for this note
                this.sounds[note] = new Howl({
                    src: [`sounds/${note}.mp3`] // Path to local audio files
                });

                // Store the note and its duration
                this.notesDuration.push({ note: note, duration: parseFloat(noteElement.dataset.duration), interval: parseFloat(intervalInput.value) });
            }
        });

        document.getElementById("play")?.addEventListener("click", () => {
            console.log(this.notesDuration);
            let currentTime = 0;
            this.notesDuration.forEach((item, index) => {
                const sound = this.sounds[item.note];
                if (sound) {
                    setTimeout(() => {
                        sound.play();
                        setTimeout(() => sound.stop(), item.duration * 1000); // Stop playing after the specified duration
                    }, currentTime * 1000);
                    currentTime += (item.duration + (this.notesDuration[index + 1] ? parseFloat(this.notesDuration[index + 1].interval.toString()) : 0));
                }
            });
        });
    },
    //Ici les fonctions (méthodes)
    methods: {
        updateDuration(note:string, duration:number) {
            for (let i = 0; i < this.notesDuration.length; i++) {
                if (this.notesDuration[i].note === note) {
                    this.notesDuration[i].duration = duration;
                    break;
                }
            }
        },

        updateInterval(note:string, interval:number) {
            for (let i = 0; i < this.notesDuration.length; i++) {
                if (this.notesDuration[i].note === note) {
                    this.notesDuration[i].interval = interval;
                    break;
                }
            }
        },

        noteID() {
            return Math.random().toString(36).substr(2, 9);
        },
    },
});

</script>