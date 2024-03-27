<template>
    <headerApp></headerApp>
    <div class="content">
        <section class="playersList">
            <h3>Players</h3>
            <div class="playersContainer">
                <div class="playerContainer">
                    <img class="player-icon" id="avatarImg" alt="player 1">
                    <p id="pseudoPlayer1"></p>
                </div>
            </div>
        </section>
        <main class="personalization-main">
            <section class="settings">
                <form>
                    <label for="nbPlayers">Number of players</label>
                    <select id="nbPlayers">
                        
                    </select>
                    <br>
                    <label for="nbRounds">Number of rounds</label>
                    <select id="nbRounds">
                        
                    </select>
                    <br>
                    <input type="submit" value="Select" class="submitBtn" style="margin: auto;">
                </form>
                <div>
                    <h3>Game selection</h3>

                    <div class="game-options">
                        <div class="game-container">
                            <div class="game" @click="toggleSelection"><img src="../../assets/svg/img-jeu.png" alt="Game 1"></div>
                            <p>Game1</p>
                        </div>
                        <div class="game-container">
                            <div class="game" @click="toggleSelection"><img src="../../assets/svg/img-jeu.png" alt="Game 2"></div>
                            <p>Game2</p>
                        </div>
                        <div class="game-container">
                            <div class="game" @click="toggleSelection"><img src="../../assets/svg/img-jeu.png" alt="Game 3"></div>
                            <p>Game3</p>
                        </div>
                        <div class="game-container">
                            <div class="game" @click="toggleSelection"><img src="../../assets/svg/img-jeu.png" alt="Game 4"></div>
                            <p>Game4</p>
                        </div>
                        <div class="game-container">
                            <div class="game" @click="toggleSelection"><img src="../../assets/svg/img-jeu.png" alt="Game 5"></div>
                            <p>Game5</p>
                        </div>
                        <div class="game-container">
                            <div class="game" @click="toggleSelection"><img src="../../assets/svg/img-jeu.png" alt="Game 6"></div>
                            <p>Game6</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
    <div class="footer">
        <footerApp></footerApp>
    </div>
</template>

<script>
    import footerApp from '../footer/footer.vue';
    import headerApp from '../header/header.vue'; 

export default {
    name: 'game_select',
    components: {
            footerApp,
            headerApp,
        },
    mounted() {
        this.roundsNumber();
        this.playersNumber();
        this.updateAvatar();
    },
    methods: {
        playersNumber() {
            var selectElement = document.getElementById("nbPlayers");

            for (var i = 1; i <= 10; i++) {
                var option = document.createElement("option");
                option.text = i;
                option.value = i;
                selectElement.appendChild(option);
            }
        },
        roundsNumber() {
            var selectElement = document.getElementById("nbRounds");

            for (var i = 1; i <= 3; i++) {
                var option = document.createElement("option");
                option.text = i;
                option.value = i;
                selectElement.appendChild(option);
            }
        },
        toggleSelection(event) {
            event.currentTarget.classList.toggle("selected");
        },
        updateAvatar() {
            var img = document.getElementById('avatarImg');
            var avatarPath = this.getAvatar();
            img.src = avatarPath;
            var img1 = document.getElementById('pseudoPlayer1');
            var pseudoText = this.getPseudo();
            img1.textContent = pseudoText;
        },
        getAvatar() {
            var avatar = localStorage.getItem('selectedAvatar');
            if (avatar == 'Avatar 1') {
                return '../../assets/Comparaison.png';
            }
            if (avatar == 'Avatar 2') {
                return '../../assets/Realping.png';
            }
            if (avatar == 'Avatar 3') {
                return '../../assets/security.png';
            }
        },
        getPseudo() {
            var pseudo = localStorage.getItem('pseudoP1');
            if (!pseudo) {
                return 'Randomname';
            } else {
                return pseudo;
            }
        }
    }
}
</script>

<style scoped>
    @import './game-select.css';
</style>
