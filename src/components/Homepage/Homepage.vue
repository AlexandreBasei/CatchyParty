<template>
    <main v-if="homepage === true">
        <section class="personalization"> 
            <form>
                <input type="text" class="textInput" :placeholder="$t('UTILISATEUR')" v-model="pseudo" maxlength="15"
                    required>
                <div class="avatar-choice">
                    <h3 v-if="homepage === true && !roomId">{{ $t('AVATAR') }}</h3>
                    <div v-else v-for="room in rooms" :key="room.id">
                        <h3 v-if="room.id === roomId">{{ $t('REJOINDRE_SALLE') }} {{ room.players[0].username }}</h3>
                    </div>
                    <div class="avatar-container">
                        <ul class="arrows">
                            <button @click="previousAvatarPart('eyes')" :disabled="avatarData[0] === 0">&lt;</button>
                            <button @click="previousAvatarPart('mouth')" :disabled="avatarData[1] === 0">&lt;</button>
                        </ul>

                        <div class="current-avatar">
                            <img :src="bodySrc" class="avatar-part"/>
                            <img :src="eyesSrc" class="avatar-part"/>
                            <img :src="mouthSrc" class="avatar-part"/>
                        </div>

                        <ul class="arrows">
                            <button @click="nextAvatarPart('eyes')" :disabled="avatarData[0] === maxEyesIndex-1">&gt;</button>
                            <button @click="nextAvatarPart('mouth')" :disabled="avatarData[1] === maxMouthIndex-1">&gt;</button>
                        </ul>
                    </div>
                    
                    <input type="color" v-model="avatarColor" @change="updateAvatarColor" />
                    <!-- <div class="avatar-options">
                        <img class="avatar-option" src="@/assets/svg/avatars/profile_base.svg" alt="Avatar 1"
                            @click="selectAvatar('Avatar1')">
                        <img class="avatar-option" src="@/assets/svg/avatars/profile_base_ex_pink.svg" alt="Avatar 2"
                            @click="selectAvatar('Avatar2')">
                        <img class="avatar-option" src="@/assets/svg/avatars/profile_base_ex_red.svg" alt="Avatar 3"
                            @click="selectAvatar('Avatar3')">
                    </div> -->
                </div>
                <button v-if="homepage === true && !roomId" class="submitBtn" @click="handleSubmit()">{{ $t('JOUER') }}</button>
                <div v-else v-for="room in rooms" :key="room.id">
                    <button v-if="room.id === roomId" @click="joinRoom(room)" class="submitBtn">{{ $t('REJOINDRE_PARTIE') }}</button>
                </div>
            </form>
        </section>

        <section class="tutorial" v-if="homepage === true">
            <h3> {{ $t('COMMENT_JOUER') }} </h3>
            <div id="tutorial" class="tutorial-box">{{ tutorialText }}</div>
        </section>
    </main>

    <gameSelect v-if="!homepage" :socket="socket"></gameSelect>

    <!-- <div class="footer">
        <footerApp></footerApp>
    </div> -->
</template>

<script lang="ts">
import io from 'socket.io-client';
import gameSelect from '../Game-select/Game-select.vue';
import { defineComponent, ref } from 'vue';

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
                avatar: "Avatar 1",
                roomId: "",
                username: "",
                socketId: "",
                idea: false,
                tabAttributed: false,
            },
            selectedAvatar: "Avatar1",
            roomId: "",

            avatarData: [0, 0, "#ffffff"] as [number, number, string],
            currentAvatar: {},
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
            return require(`@/assets/svg/avatars/profile_base.svg`);
        },
        eyesSrc() {
            return require(`@/assets/svg/avatars/eyes/eyes${this.avatarData[0]}.svg`);
        },
        mouthSrc() {
            return require(`@/assets/svg/avatars/mouths/mouth${this.avatarData[1]}.svg`);
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
                this.player.avatar = this.selectedAvatar;

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
                this.player.avatar = this.selectedAvatar;

                this.socket.emit('playerData', this.player);

                this.homepage = false;
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
        // selectAvatar(avatarName: string) {
        //     localStorage.setItem('selectedAvatar', avatarName);
        //     var options = document.querySelector('.avatar-options');
        //     // options.style.display = 'none';

        //     this.selectedAvatar = avatarName;
        //     // this.avatarPath = `/img/${this.player.avatar}.png`;
        // },
        previousAvatarPart(part: string) {
            if (part === 'eyes' && this.avatarData[0] > 0) {
                this.avatarData[0]--;
            } else if (part === 'mouth' && this.avatarData[1] > 0) {
                this.avatarData[1]--;
            }
            console.log(this.avatarData)
        },
        nextAvatarPart(part: string) {
            if (part === 'eyes' && this.avatarData[0] < this.maxEyesIndex - 1) {
                this.avatarData[0]++;
            } else if (part === 'mouth' && this.avatarData[1] < this.maxMouthIndex - 1) {
                this.avatarData[1]++;
            }
        },
        updateAvatarColor() {
            console.log("color!")
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