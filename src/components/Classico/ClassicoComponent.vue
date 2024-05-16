<template>
  <h1>Classico</h1>
  <h2>En développement...</h2>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import io from 'socket.io-client';

export default defineComponent({
    props: {
        socket: {
            type: Object,
            required: true
        },
    },

    data() {
        return {

        }
    },

    mounted() {
        console.log("oui");
    },

    methods: {

    }
})
</script>

<style lang="css" scoped>
@import url('./classico.css');
@import url('./classico-mobile.css');
</style>