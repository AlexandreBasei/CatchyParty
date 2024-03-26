<template>
  <!-- <RoomComponent></RoomComponent> -->
  <!-- <GeniusFindLyrics></GeniusFindLyrics> -->
  <KeyboardNotes></KeyboardNotes>
  <footerApp></footerApp>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import footerApp from './components/footer/footer.vue'; // Import du composant Footer
// import RoomComponent from './components/rooms/RoomComponent.vue';
// import GeniusFindLyrics from './components/FindLyrics/GeniusFindLyrics.vue';
import KeyboardNotes from './components/Keyboard-notes/KeyboardNotes.vue';

export default defineComponent({
  name: 'App',
  components: {
    // RoomComponent,
    // GeniusFindLyrics,
    KeyboardNotes,
    footerApp
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
