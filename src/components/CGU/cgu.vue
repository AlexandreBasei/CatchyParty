<template>
    <headerApp></headerApp>
    <main class="CGU-main">
        <section>
            <h2>Introduction</h2>
            <p>
                Welcome to CatchyParty, a website offering music-themed games. These Terms of Use govern your use of this site. By accessing and using this site, you agree to these terms in their entirety.
            </p>
        </section>
        <section>
            <h2>Intellectual property</h2>
            <p>
                CatchyParty and its content, including but not limited to, texts, graphics, images, logos, sounds, videos, and source code, are the intellectual property of The Socket Team and are protected by copyright laws and international treaties.
            </p>
            <p>
                You may not reproduce, duplicate, copy, sell, resell or otherwise exploit any of the content of this site without our express written permission.
            </p>
        </section>
        <section>
            <h2>Use of the site</h2>
            <p>
                You agree to use this site only for legal purposes and in accordance with these terms. You should not use this site in a way that could cause harm to the site or other users.
            </p>
            <p>
                You agree not to use robots, spiders, or any other automated means to access the Site for any purpose without our express written permission.
            </p>
        </section>
        <section>
            <h2>Limitation of liability</h2>
            <p>
                The Socket Team will not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages arising from your use of this site or any information or content available on this site.
            </p>
        </section>
        <section>
            <h2>Modification of the conditions</h2>
            <p>
                We reserve the right to change these terms at any time. Changes will take effect upon posting on this site. By continuing to use this site after the changes are posted, you agree to the amended terms.
            </p>
        </section>
    </main>
    <div class="footer">
        <footerApp></footerApp>
    </div>
</template>
<style lang="scss or less">
    import './cgu.css';
</style>
<script>
    import footerApp from '../footer/footer.vue';
    import headerApp from '../header/header.vue';

    export default({
    name: 'cguApp',
    components: {
        footerApp,
        headerApp,
    }
    });
</script>