<template>
    <langApp></langApp>
    <div class="container">
        <h1>{{ $t('CONTACTEZ_NOUS') }}</h1>
        <p>{{ $t('CONTACTEZ_NOUS_TEXTE') }}</p>
        <div>
            <span id="email">catchyparty0@gmail.com</span>
            <img class="email-icon" src="@/assets/svg/icons/copy.svg" alt="Email Icon" width="20" height="20" @click="copyEmail()">
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import langApp from '@/components/Lang/Lang.vue';

export default defineComponent({
    name: 'contactApp',
    components: {
        langApp
    },
    methods:{
        copyEmail() {
            const emailElement = document.getElementById('email');
            const email = emailElement?.textContent;

            if (email) {
                const tempInput = document.createElement('input');
                tempInput.value = email;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                
                alert(this.$t('EMAIL_COPIEE') + email);
            }
        }
    },
    });
</script>

<style lang="css" scoped>
    @import './contact.css';
</style>
