<template>
    <headerApp></headerApp>
     <main class="about-main">
        <section id="mission">
            <h2>Our Mission</h2>
            <p>Our project aims to create an online gaming platform centered around music, inspired by popular games like GarticPhone. We are passionate about music and games, and we want to provide an entertaining experience for players of all skill levels.</p>
        </section>
        <section id="equipe">
            <h2>Our Team</h2>
            <p>We are a team of students in the Bachelor of Multimedia and Internet Technologies (BUT MMI) program, passionate about creating multimedia content. Our team consists of web developers, graphic designers, and user experience specialists, working together to bring this project to life.</p>
        </section>
        <section id="vision">
            <h2>Our Vision</h2>
            <p>We believe that music has the power to bring people together and create moments of joy and connection. By combining music and games, we aim to provide a platform where users can have fun, express their creativity, and share their passion for music with others.</p>
        </section>
    </main>
    <div class="footer">
        <footerApp></footerApp>
    </div>
</template>

<script>
    import footerApp from '../Footer/Footer.vue';
    import headerApp from '../Header/Header.vue'; 

    export default({
    name: 'aboutApp',
    components: {
        footerApp,
        headerApp,
    }
    });
</script>

<style lang="css" scoped>
    @import './about.css';
</style>