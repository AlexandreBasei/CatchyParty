<template>
    <div class="container">
        <h1>{{ $t('CONTACTEZ_NOUS') }}</h1>
        <p>{{ $t('CONTACTEZ_NOUS_TEXTE') }}</p>
        <div>
            <span id="email">owen.donnars@gmail.com</span>
            <img class="email-icon" src="../../assets/svg/copy.svg" alt="Email Icon" width="20" height="20" @click="copyEmail()">
        </div>
    </div>
</template>
<style lang="scss or less">
    import './contact.css';
</style>
<script>
    export default({
    name: 'contactApp',
    components: {

    },
    methods:{
        copyEmail() {
                const emailElement = document.getElementById('email');
                const email = emailElement.textContent;

                const tempInput = document.createElement('input');
                tempInput.value = email;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                
                alert("L'email a été copié dans le presse-papiers : " + email);
            }
    },
    });
</script>