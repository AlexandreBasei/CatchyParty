<template>
    <headerApp></headerApp>
    <main v-if="homepage === true">
        <section class="personalization"> 
            <form>
                <input type="text" class="textInput" placeholder="Entre ton nom d'utilisateur" v-model="pseudo" maxlength="15"
                    required>
                <div class="avatar-choice">
                    <h3 v-if="homepage === true && !roomId">Choisis un avatar</h3>
                    <div v-else v-for="room in rooms" :key="room.id">
                        <h3 v-if="room.id === roomId">Tu es en train de rejoindre la salle de {{ room.players[0].username }}</h3>
                    </div>
                    <div class="avatar-container">
                        <div class="avatar-selected">
                            <img class="avatar-option" src="@/assets/svg/avatars/profile_base.svg" alt="Avatar1"
                                v-if="selectedAvatar === 'Avatar1'">

                            <img class="avatar-option" src="@/assets/svg/avatars/profile_base_ex_pink.svg" alt="Avatar2"
                                v-if="selectedAvatar === 'Avatar2'">

                            <img class="avatar-option" src="@/assets/svg/avatars/profile_base_ex_red.svg" alt="Avatar3"
                                v-if="selectedAvatar === 'Avatar3'">
                        </div>
                    </div>
                    <div class="avatar-options">
                        <img class="avatar-option" src="@/assets/svg/avatars/profile_base.svg" alt="Avatar 1"
                            @click="selectAvatar('Avatar1')">
                        <img class="avatar-option" src="@/assets/svg/avatars/profile_base_ex_pink.svg" alt="Avatar 2"
                            @click="selectAvatar('Avatar2')">
                        <img class="avatar-option" src="@/assets/svg/avatars/profile_base_ex_red.svg" alt="Avatar 3"
                            @click="selectAvatar('Avatar3')">
                    </div>
                </div>
                <button v-if="homepage === true && !roomId" class="submitBtn" @click="handleSubmit()">Jouer !</button>
                <div v-else v-for="room in rooms" :key="room.id">
                    <button v-if="room.id === roomId" @click="joinRoom(room)" class="submitBtn">Rejoindre la partie !</button>
                </div>
            </form>
        </section>

        <section class="tutorial" v-if="homepage === true">
            <h3> Comment Jouer ? </h3>
            <div id="tutorial" class="tutorial-box">{{ tutorialText }}</div>
        </section>
    </main>

    <gameSelect v-if="!homepage" :socket="socket"></gameSelect>

    <div class="footer">
        <footerApp></footerApp>
    </div>
</template>

<script lang="ts">
    import footerApp from '../Footer/Footer.vue';
    import headerApp from '../Header/Header.vue';
    import io from 'socket.io-client';
    import gameSelect from '../Game-select/Game-select.vue';
    import { defineComponent, ref } from 'vue';

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
        }[];
    }

    export default defineComponent({
        name: 'home_page',
        components: {
            footerApp,
            headerApp,
            gameSelect,
        },

        data() {
            return {
                homepage: true,
                rooms: [] as Room[],
                pseudo: '',
                tutorialText: '',
                socket: io('http://localhost:3000'),
                steps: [
                    "Step 1 : Do this...",
                    "Step 2 : Now, this...",
                    "Step 3 : And this..."
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
            }
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
            nextStep() {
                this.currentStep++;
                if (this.currentStep < this.steps.length) {
                    this.tutorialText = this.steps[this.currentStep];
                    setTimeout(this.nextStep, 5000);
                } else {
                    setTimeout(() => {
                        this.currentStep = 0;
                        this.tutorialText = this.steps[this.currentStep];
                        setTimeout(this.nextStep, 5000);
                    }, 5000);
                }
            },
            selectAvatar(avatarName: string) {
                localStorage.setItem('selectedAvatar', avatarName);
                var options = document.querySelector('.avatar-options');
                // options.style.display = 'none';

                this.selectedAvatar = avatarName;
                // this.avatarPath = `/img/${this.player.avatar}.png`;
            },

            reload() {
                window.location.search = '?room=';
            },
        },
        mounted() {

            if (this.homepage) {
                setInterval(() => {
                    this.updRooms();
                }, 20);
            }

            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const roomId = urlParams.get('room');
            this.roomId = roomId ?? "";

            this.nextStep();
        }
    })
</script>

<style lang="css" scoped>
    @import url("./homepage.css");
</style>