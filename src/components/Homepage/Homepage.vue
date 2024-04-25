<template>
    <form v-if="homepage === true" class="homepage-form">
        <div class="inputs-container">
            <input type="text" class="textInput" :placeholder="$t('UTILISATEUR')" v-model="pseudo" maxlength="15">

            <button v-if="homepage === true && !roomId" class="submitBtn" @click="handleSubmit()">{{ $t('JOUER') }}</button>
            <div v-else v-for="room in rooms" :key="room.id">
                <button v-if="room.id === roomId" @click="joinRoom(room)" class="submitBtn">{{ $t('REJOINDRE_PARTIE') }}</button>
            </div>
        </div>

        <div class="avatar-choice">
            <h3 v-if="homepage === true && !roomId">{{ $t('AVATAR') }}</h3>
            <div v-else v-for="room in rooms" :key="room.id">
                <h3 v-if="room.id === roomId">{{ $t('REJOINDRE_SALLE') }} {{ room.players[0].username }}</h3>
            </div>
            
            <div class="avatar-container">
                <ul class="arrows">
                    <button type="button" @click="previousAvatarPart('eyes')" :disabled="avatarData[1] === 0">&lt;</button>
                    <button type="button" @click="previousAvatarPart('mouth')" :disabled="avatarData[2] === 0">&lt;</button>
                    <button type="button" @click="previousAvatarPart('body')" :disabled="avatarData[0] === 0">&lt;</button>
                </ul>

                <ProfilePicture :width="200" :bodyIndex="avatarData[0]" :eyesIndex="avatarData[1]" :mouthIndex="avatarData[2]" />

                <ul class="arrows">
                    <button type="button" @click="nextAvatarPart('eyes')" :disabled="avatarData[1] === maxEyesIndex-1">&gt;</button>
                    <button type="button" @click="nextAvatarPart('mouth')" :disabled="avatarData[2] === maxMouthIndex-1">&gt;</button>
                    <button type="button" @click="nextAvatarPart('body')" :disabled="avatarData[0] === maxBodyIndex-1">&gt;</button>
                </ul>
            </div>
        </div>
    </form>

    <gameSelect v-if="!homepage" :socket="socket"></gameSelect>
</template>

<script lang="ts">
import io from 'socket.io-client';
import gameSelect from '../Game-select/Game-select.vue';
import ProfilePicture from '@/components/ProfilePicture/ProfilePicture.vue';
import { defineComponent, ref } from 'vue';

import bodyFolder from '@/assets/svg/avatars/bodies';
import eyesFolder from '@/assets/svg/avatars/eyes';
import mouthFolder from '@/assets/svg/avatars/mouths';


interface Room {
    id: string;
    players: {
        host: boolean,
        avatar: string,
        roomId: string,
        socketId: string,
        username: string,
        idea: boolean,
        tabAttributed: boolean,
        lang: string,
    }[];
}

export default defineComponent({
    name: 'home_page',
    components: {
        gameSelect,
        ProfilePicture
    },

    data() {
        return {
            homepage: true,
            lang: '',
            rooms: [] as Room[],
            pseudo: '',
            tutorialText: '',
            socket: io('http://localhost:3000'),
            stepsFr: [
                "Étape 1 : Choisir un pseudo...",
                "Étape 2 : Choisir un avatar...",
                "Étape 3 : Et choisissez vos jeux !"
            ],
            stepsEn: [
                "Step 1 : Choose a username...",
                "Step 2 : Choose a avatar...",
                "Step 3 : And select your games !"
            ],
            currentStep: 0,
            player: {
                host: false,
                avatar: [0,0,0],
                roomId: "",
                username: "",
                socketId: "",
                idea: false,
                tabAttributed: false,
            },
            roomId: "",

            avatarData: [0, 0, 0] as [number, number, number],
            currentAvatar: {},
            maxBodyIndex: bodyFolder.length,
            maxEyesIndex: eyesFolder.length,
            maxMouthIndex: mouthFolder.length
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

        if (this.homepage) {
            setInterval(() => {
                this.updRooms();
            }, 20);
        }

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const roomId = urlParams.get('room');
        this.roomId = roomId ?? "";

        if(this.lang == 'fr'){
            this.nextStepFr();
        }else{
            this.nextStepEn();
        }
        this.changeLanguage();
    },
    computed: {        
        bodySrc() {
            return require(`@/assets/svg/avatars/bodies/body${this.avatarData[0]}.svg`);
        },
        eyesSrc() {
            return require(`@/assets/svg/avatars/eyes/eyes${this.avatarData[1]}.svg`);
        },
        mouthSrc() {
            return require(`@/assets/svg/avatars/mouths/mouth${this.avatarData[2]}.svg`);
        },
    },
    methods: {
        updRooms() {
            this.socket.emit('get rooms');

            this.socket.on('list rooms', (rooms: Room[]) => {
                this.rooms = rooms;
            });
        },

        joinRoom(room: Room) {
            if (this.pseudo) {
                this.player.roomId = room.id;
                this.player.username = this.pseudo;
                this.player.socketId = this.socket.id ?? "";
                this.player.avatar = this.avatarData;

                this.socket.emit('playerData', this.player);
                this.homepage = false;
                this.roomId = "";
            }
        },

        handleSubmit() {
            if (this.pseudo) {
                this.player.host = true;
                this.player.username = this.pseudo;
                this.player.socketId = this.socket.id ?? "";
                this.player.avatar = this.avatarData;

                this.socket.emit('playerData', this.player);

                this.homepage = false;
            } else {
                alert("Tu dois entrer un pseudo !")
            }
        },
        nextStepFr() {
            this.currentStep++;
            if (this.currentStep < this.stepsFr.length) {
                this.tutorialText = this.stepsFr[this.currentStep];
                setTimeout(this.nextStepFr, 5000);
            } else {
                setTimeout(() => {
                    this.currentStep = 0;
                    this.tutorialText = this.stepsFr[this.currentStep];
                    setTimeout(this.nextStepFr, 5000);
                }, 5000);
            }
        },
        nextStepEn() {
            this.currentStep++;
            if (this.currentStep < this.stepsEn.length) {
                this.tutorialText = this.stepsEn[this.currentStep];
                setTimeout(this.nextStepEn, 5000);
            } else {
                setTimeout(() => {
                    this.currentStep = 0;
                    this.tutorialText = this.stepsEn[this.currentStep];
                    setTimeout(this.nextStepEn, 5000);
                }, 5000);
            }
        },
        
        previousAvatarPart(part: string) {
            if (part === 'body' && this.avatarData[0] > 0) {
                this.avatarData[0]--;
            } else if (part === 'eyes' && this.avatarData[1] > 0) {
                this.avatarData[1]--;
            } else if (part === 'mouth' && this.avatarData[2] > 0) {
                this.avatarData[2]--;
            }
        },
        nextAvatarPart(part: string) {
            if (part === 'body' && this.avatarData[0] < this.maxBodyIndex - 1) {
                this.avatarData[0]++;
            } else if (part === 'eyes' && this.avatarData[1] < this.maxEyesIndex - 1) {
                this.avatarData[1]++;
            } else if (part === 'mouth' && this.avatarData[2] < this.maxMouthIndex - 1) {
                this.avatarData[2]++;
            }
        },

        reload() {
            window.location.search = '?room=';
        },

        changeLanguage() {
            this.$i18n.locale = localStorage.getItem('lang') || 'fr'
        },
    },
})
</script>

<style scoped>
    @import url("./homepage.css");
</style>