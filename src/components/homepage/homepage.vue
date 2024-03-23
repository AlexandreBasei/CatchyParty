<template>
    <headerApp></headerApp>
    <main>
        <section class="personalization">
            <form @submit.prevent="handleSubmit">
                <input type="text" class="textInput" placeholder="Votre pseudo" v-model="pseudo" maxlength="10">
                <div class="avatar-choice">
                    <h3>Your avatar</h3>
                    <div class="avatar-container">
                        <div class="avatar-selected">
                            <!-- Avatar sélectionné apparaîtra ici -->
                        </div>
                    </div>
                    <div class="avatar-options">
                        <img class="avatar-option" src="../../assets/Comparaison.png" alt="Avatar 1" @click="selectAvatar('Avatar 1')">
                        <img class="avatar-option" src="../../assets/Realping.png" alt="Avatar 2" @click="selectAvatar('Avatar 2')">
                        <img class="avatar-option" src="../../assets/security.png" alt="Avatar 3" @click="selectAvatar('Avatar 3')">
                    </div>
                </div>
                <RouterLink to="/game-select" class="submit">
                    <input type="submit" class="submitBtn" value="Play !" id="submitBtn">
                </RouterLink>
            </form>
        </section>
        <section class="tutorial">
            <h3>
                How to play ?
            </h3>
            <div id="tutorial" class="tutorial-box">{{ tutorialText }}</div>
        </section>
    </main>
    <footerApp></footerApp>
</template>
<style lang="scss or less">
import './homepage.css';
</style>
<script>
    import footerApp from '../footer/footer.vue';
    import headerApp from '../header/header.vue'; 

    export default {
        name: 'home_page',
        components: {
            footerApp,
            headerApp,
        },
        data() {
            return {
                pseudo: '',
                tutorialText: '',
                steps: [
                    "Étape 1 : Do this...",
                    "Étape 2 : Now, this...",
                    "Étape 3 : And this..."
                ],
                currentStep: 0
            }
        },
        methods: {
            handleSubmit() {
                localStorage.setItem("pseudoP1", this.pseudo);
                window.location.href = "../personalization/personalization.html";
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
            selectAvatar(avatarName) {
                localStorage.setItem('selectedAvatar', avatarName);
                var options = document.querySelector('.avatar-options');
                options.style.display = 'none';
            }
        },
        mounted() {
            this.nextStep();
        }
    }
</script>
