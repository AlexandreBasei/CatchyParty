<template>
     <div class="info-container" id="infosComponent">
        <button class="infosBtn" v-if="showInfo">
            <img src="@/assets/svg/icons/infos.svg" @click="showPopUp()" alt="infos" class="infos-icon">
        </button>
        <button class="infosBtn" v-if="showClose">
            <img src="@/assets/svg/icons/close.svg" @click="closePopUp()" alt="close" class="infos-icon">
        </button>
     </div>
     <div v-if="showPopup" class="popUp">
        <h3>{{ $t('REGLES') }}</h3>
        <div class="game-infos-container">
            <div class="game-container" v-for="game in games" :key="game.id" >
                <div class="game" @click="handleGameClick(game.id)">
                    <img :src="game.image" :alt="game.name">
                </div>
            </div>
        </div>
        <div class="rules" v-if="rules">
            <div class="rule">
                    <h3 class="rulesGame" v-if="lang == 'fr'">
                        {{ selectedGameFr }}
                    </h3>
                    <h3 class="rulesGame" v-if="lang == 'en'">
                        {{ selectedGameEn }}
                    </h3>
            </div>
            <div class="rule-text">
                <p class="rulesText">
                    {{ rules }}
                </p>
            </div>
        </div>
     </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'InfosComponent',
    components: {

    },
    data() {
        return {
            games: [
                { id: 1, name: "Keyboard-notes", image: require("@/assets/svg/partinies/solar.svg") },
                { id: 2, name: "Classico", image: require("@/assets/svg/partinies/vilo.svg") },
                { id: 3, name: "What's the situation ?", image: require("@/assets/svg/partinies/blingbling.svg") }
            ],
            rulesFr: [
                { id: 1, name: "Keyboard-notes", text : "Sur le principe du téléphone arabe, chaque joueur doit entrer le nom d'une musique qu'il souhaite faire jouer à ses camarades, essayer de la reproduire à l'aide de notes de piano et deviner la musique qu'un joueur a composée."},
                { id: 2, name: "Classico", text : "À la manière d'un blindtest, les joueurs devront trouver le nom de la musique classique qui est joué le plus vite possible. Des informations complémentaires seront disponibles."},
                { id: 3, name: "What's the situation ?", text : "Différentes situations seront présentées aux joueurs et ils devront choisir les musiques qui y correspondent le plus ou qui sont les plus drôles."}
            ],
            rulesEn: [
                { id: 1, name: "Keyboard-notes", text : "On the principle of the Arabic telephone, each player must enter the name of a music that he wants to play to his comrades, try to reproduce it using piano notes and guess the music that a player has composed."},
                { id: 2, name: "Classico", text : "Like a blindtest, players will have to find the name of the classical music that is played as soon as possible. Further information will be available."},
                { id: 3, name: "What's the situation ?", text : "Different situations will be presented to the players and they will have to choose the music that corresponds to them the most or which are the funniest."}
            ],
            showPopup: false,
            showInfo: true,
            showClose: false,
            selectedGameFr: 'Cliquez sur un jeu',
            selectedGameEn: 'Click on a game',
            lang: '',
            rules: ''
        }
    },  
    mounted() {  
        const getLang = localStorage.getItem('lang');
        if(getLang){
            this.lang = getLang;
        } else{
            this.lang = 'fr';
            localStorage.setItem('lang',this.lang);
        }
    },
    methods:{
        handleGameClick(id: number) {
            if(this.lang == "fr"){
                this.rulesFr.forEach(element => {
                    if(id == element.id){
                        this.selectedGameFr = element.name;
                        this.rules = element.text;
                    }
                });
            }else{
                this.rulesEn.forEach(element => {
                    if(id == element.id){
                        this.selectedGameEn = element.name;
                        this.rules = element.text;
                    }
                });
            }
            
        },
        showPopUp() {
            this.showPopup = true;
            this.showInfo = false;
            this.showClose = true;
            const getFooter = document.getElementById('footer');
            const getContent = document.getElementById('content');
            if(getFooter){
                getFooter.style.opacity = '10%';
            }
            if(getContent){
                getContent.style.opacity = '10%';
            }
        },
        closePopUp() {
            this.showPopup = false;
            this.showInfo = true;
            this.showClose = false;
            const getFooter = document.getElementById('footer');
            const getContent = document.getElementById('content');
            if(getFooter){
                getFooter.style.opacity = '100%';
            }
            if(getContent){
                getContent.style.opacity = '100%';
            }
        }
    },
});
</script>

<style scoped>
    @import url("./infos.css");
    @import url("./infos-mobile.css");
</style>