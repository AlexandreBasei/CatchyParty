<template>
  <RoomComponent></RoomComponent>
  <footerApp></footerApp>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import footerApp from './components/footer/footer.vue'; // Import du composant Footer
import RoomComponent from './components/rooms/RoomComponent.vue';

export default defineComponent({
  name: 'App',
  components: {
    RoomComponent,
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
