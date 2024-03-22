import { createRouter, createWebHistory } from "vue-router";
import cguApp from "../components/CGU/cgu.vue";
import home_page from "../components/homepage/homepage.vue";
import contactApp from "../components/contact/contact.vue";
import aboutApp from "../components/about/about.vue";
import game_select from "../components/game-select/game-select.vue";

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
    ]
})

export default router