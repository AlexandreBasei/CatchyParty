<template>
    <headerApp></headerApp>
    <div class="container">
        <h1>Contact us</h1>
        <p>If you have any questions or suggestions, please contact us by e-mail :</p>
        <div>
            <span id="email">owen.donnars@gmail.com</span>
            <img class="email-icon" src="../../assets/copy.svg" alt="Email Icon" width="20" height="20" onclick="copyEmail()">
        </div>
    </div>
    <footerApp></footerApp>
</template>
<style lang="scss or less">
    import './contact.css';
</style>
<script>
    import footerApp from '../footer/footer.vue';
    import headerApp from '../header/header.vue'; 

    export default({
    name: 'contactApp',
    components: {
        footerApp,
        headerApp,
    }
    });
</script>