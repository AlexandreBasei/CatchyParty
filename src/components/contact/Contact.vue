<template>
    <headerApp></headerApp>
    <div class="container">
        <h1>Contact us</h1>
        <p>If you have any questions or suggestions, please contact us by e-mail :</p>
        <div>
            <span id="email">owen.donnars@gmail.com</span>
            <img class="email-icon" src="../../assets/svg/icons/copy.svg" alt="Email Icon" width="20" height="20" @click="copyEmail()">
        </div>
    </div>
    <div class="footer">
        <footerApp></footerApp>
    </div>
</template>

<script>
    import footerApp from '../Footer/Footer.vue';
    import headerApp from '../Header/Header.vue'; 

    export default({
    name: 'contactApp',
    components: {
        footerApp,
        headerApp,
    }
    });
</script>

<style lang="css" scoped>
    @import './contact.css';
</style>
