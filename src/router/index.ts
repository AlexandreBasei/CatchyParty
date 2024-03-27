import { createRouter, createWebHistory } from "vue-router";
import cguApp from "../components/CGU/cgu.vue";
import home_page from "../components/homepage/homepage.vue";
import contactApp from "../components/contact/contact.vue";
import aboutApp from "../components/about/about.vue";
import game_select from "../components/game-select/game-select.vue";
import game1_screen from "../components/game1-screen/game1-screen.vue";
import game2_screen from "../components/game2-screen/game2-screen.vue";
import game3_screen from "../components/game3-screen/game3-screen.vue";
import game4_screen from "../components/game4-screen/game4-screen.vue";
import game5_screen from "../components/game5-screen/game5-screen.vue";
import game6_screen from "../components/game6-screen/game6-screen.vue";
import validation_screen from "../components/validation-screen/validation-screen.vue";
import rules_screen from "../components/rules-screen/rules-screen.vue";
import listen_screen from "../components/listen-screen/listen-screen.vue";
import ending_screen from "../components/ending-screen/ending-screen.vue";

const BASE_URL = "/";

const router = createRouter({
    history: createWebHistory(BASE_URL),
    routes: [
        {
            path: "/",
            component: home_page,
        },
        {
            path: "/cgu",
            component: cguApp,
        },
        {
            path: "/about",
            component: aboutApp,
        },
        {
            path: "/contact",
            component: contactApp,
        },
        {
            path: "/game-select",
            component: game_select,
        },
        {
            path: "/game1",
            component: game1_screen,
        },
        // {
        //     path: "/game2",
        //     component: game2_screen,
        // },
        // {
        //     path: "/game3",
        //     component: game3_screen,
        // },
        // {
        //     path: "/game4",
        //     component: game4_screen,
        // },
        // {
        //     path: "/game5",
        //     component: game5_screen,
        // },
        // {
        //     path: "/game6",
        //     component: game6_screen,
        // },
        {
            path: "/validation-screen",
            component: validation_screen,
        },
        {
            path: "/rules-screen",
            component: rules_screen,
        },
        {
            path: "/listen-screen",
            component: listen_screen,
        },
        {
            path: "/ending-screen",
            component: ending_screen,
        },
    ]
})

export default router