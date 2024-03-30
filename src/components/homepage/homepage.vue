<template>
    <headerApp></headerApp>
    <p>{{ player }}</p>
    <main v-if="homepage === true">
        <section class="personalization" v-if="homepage === true && !roomId">
            <form @submit.prevent="handleSubmit">
                <input type="text" class="textInput" placeholder="Enter your username" v-model="pseudo" maxlength="15"
                    required>
                <div class="avatar-choice">
                    <h3>Choose your avatar</h3>
                    <div class="avatar-container">
                        <div class="avatar-selected">
                            <!-- <img class="avatar-option" alt="Avatar"
                            v-bind:src="require(`${avatarPath}`)"> -->
                            <img class="avatar-option" src="../../assets/Avatar1.png" alt="Avatar"
                                v-if="selectedAvatar === 'Avatar1'">

                            <img class="avatar-option" src="../../assets/Avatar2.png" alt="Avatar 2"
                                v-if="selectedAvatar === 'Avatar2'">

                            <img class="avatar-option" src="../../assets/Avatar3.png" alt="Avatar 3"
                                v-if="selectedAvatar === 'Avatar3'">
                        </div>
                    </div>
                    <div class="avatar-options">
                        <img class="avatar-option" src="../../assets/Avatar1.png" alt="Avatar 1"
                            @click="selectAvatar('Avatar1')">
                        <img class="avatar-option" src="../../assets/Avatar2.png" alt="Avatar 2"
                            @click="selectAvatar('Avatar2')">
                        <img class="avatar-option" src="../../assets/Avatar3.png" alt="Avatar 3"
                            @click="selectAvatar('Avatar3')">
                    </div>
                </div>
                <!-- <RouterLink to="/game-select" class="submit"> -->
                <input type="submit" class="submitBtn" value="Play !" id="submitBtn">
                <!-- </RouterLink> -->
            </form>
        </section>

        <section v-else-if="roomId && homepage === true" class="joiningRoom">
            <div v-for="room in rooms" :key="room.id">
                <div v-if="room.id === roomId">
                    <h1>You are joining {{ room.players[0].username }}'s room</h1>
                    <form @submit.prevent="joinRoom(room)">
                        <input type="text" placeholder="Enter your username" v-model="pseudo" required maxlength="15">
                        <div class="avatar-choice">
                            <h3>Choose your avatar</h3>
                            <div class="avatar-container">
                                <div class="avatar-selected">
                                    <!-- <img class="avatar-option" alt="Avatar"
                            v-bind:src="require(`${avatarPath}`)"> -->
                                    <img class="avatar-option" src="../../assets/Avatar1.png" alt="Avatar"
                                        v-if="selectedAvatar === 'Avatar1'">

                                    <img class="avatar-option" src="../../assets/Avatar2.png" alt="Avatar 2"
                                        v-if="selectedAvatar === 'Avatar2'">

                                    <img class="avatar-option" src="../../assets/Avatar3.png" alt="Avatar 3"
                                        v-if="selectedAvatar === 'Avatar3'">
                                </div>
                            </div>
                            <div class="avatar-options">
                                <img class="avatar-option" src="../../assets/Avatar1.png" alt="Avatar 1"
                                    @click="selectAvatar('Avatar1')">
                                <img class="avatar-option" src="../../assets/Avatar2.png" alt="Avatar 2"
                                    @click="selectAvatar('Avatar2')">
                                <img class="avatar-option" src="../../assets/Avatar3.png" alt="Avatar 3"
                                    @click="selectAvatar('Avatar3')">
                            </div>
                        </div>
                        <button type="submit">Join</button>
                    </form>
                    <!-- <button @click="reload">Retourner à l'accueil</button> -->
                </div>
                <div v-else>
                    <p>The room you are trying to join does not exist</p>
                    <!-- <button @click="reload">Retourner à l'accueil</button> -->
                </div>
            </div>
        </section>

        <section class="tutorial" v-if="homepage === true">
            <h3>
                How to play ?
            </h3>
            <div id="tutorial" class="tutorial-box">{{ tutorialText }}</div>
        </section>
    </main>

    <gameSelect v-if="!homepage" :socket="socket"></gameSelect>

    <div class="footer">
        <footerApp></footerApp>
    </div>
</template>

<script lang="ts">
import footerApp from '../footer/footer.vue';
import headerApp from '../header/header.vue';
import io from 'socket.io-client';
import gameSelect from '../game-select/game-select.vue';
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
                "Étape 1 : Do this...",
                "Étape 2 : Now, this...",
                "Étape 3 : And this..."
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
            else {
                alert("Veuillez entrer un nom d'utilisateur pour rejoindre une partie");
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

<style scoped>
.avatar-container {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: var(--black);
    margin: 0 auto 30px auto;
    cursor: pointer;
}

.avatar-options {
    display: flex;
    gap: 5px;
}

.avatar-option,
.player-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    transition: transform 0.3s;
}

.avatar-option:hover {
    transform: scale(1.1);
}

.avatar-selected {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
}

.avatar-selected img {
    width: 100%;
    height: auto;
}

.email-icon {
    cursor: pointer;
}

.joiningRoom{
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
}

.joiningRoom input[type=text]{
    margin-bottom: 10%;
}

.joiningRoom button[type=submit]{
    margin: 10% auto;
    font-weight: 600;
}

@media only screen and (max-width: 600px) {

    footer {
        display: grid;
        align-items: center;
    }
}

@media only screen and (min-width: 1000px) {
    body {
        height: 100vh;
    }

    .personalization,
    .tutorial {
        margin: auto;
    }

    .footer {
        position: fixed;
        bottom: 0;
        width: 100%;
    }

    select,
    input[type=text],
    button {
        width: 30vh;
        background-color: var(--quaternary);
        border: 0;
        /* color: white; */
        color: var(--tertiary);
        margin: 10px 0;
        padding: 5px;
        border-radius: 10px;
    }

    input[type=submit] {
        background-color: var(--quaternary);
        border: 0;
        /* color: white; */
        color: var(--tertiary);
        margin: 10px 0;
        padding: 5px;
        border-radius: 10px;
        width: 30vh;
    }

    .avatar-choice {
        justify-content: center;
        display: grid;
    }

    .submit {
        justify-content: center;
        display: flex;
        margin-top: 1em;
    }
}
</style>