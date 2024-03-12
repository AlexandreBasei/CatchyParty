<template>
    <main>
        <section class="personalization">
            <form>
                <input type="text" class="textInput" placeholder="Votre pseudo" id="pseudoInput" maxlength="10">
                <div>
                    <h3>Votre avatar</h3>
                    <div class="avatar-container">
                        <div class="avatar-selected">
                            <!-- Avatar sélectionné apparaîtra ici -->
                        </div>
                    </div>
                    <div class="avatar-options">
                        <img class="avatar-option" src="../../assets/Comparaison.png" alt="Avatar 1" onclick="selectAvatar(this)">
                        <img class="avatar-option" src="../../assets/Realping.png" alt="Avatar 2" onclick="selectAvatar(this)">
                        <img class="avatar-option" src="../../assets/security.png" alt="Avatar 3" onclick="selectAvatar(this)">
                    </div>
                </div>
                <input type="submit" class="submitBtn" value="Jouer !" id="submitBtn">
            </form>
        </section>
        <section class="tutorial">
            <h3>
                Comment jouer ?
            </h3>
            <div id="tutorial" class="tutorial-box"></div>
        </section>
    </main>
</template>
<style lang="scss or less">
@import "./homepage.css";
</style>