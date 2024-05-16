import { createRouter, createWebHistory } from "vue-router";
import cguApp from "@/components/CGU/CGU.vue";
import home_page from "@/components/Homepage/Homepage.vue";
import contactApp from "@/components/Contact/Contact.vue";
import aboutApp from "@/components/About/About.vue";
import game_select from "@/components/Game-select/Game-select.vue";
import game1_screen from "@/components/Game1-screen/Game1-screen.vue";
import WtsComponent from "@/components/Wts/WtsComponent.vue";
// import game2_screen from "@/components/Game2-screen/Game2-screen.vue";
// import game3_screen from "@/components/Game3-screen/Game3-screen.vue";
// import game4_screen from "@/components/Game4-screen/Game4-screen.vue";
// import game5_screen from "@/components/Game5-screen/Game5-screen.vue";
// import game6_screen from "@/components/Game6-screen/Game6-screen.vue";
import validation_screen from "@/components/Validation-screen/Validation-screen.vue";
import rules_screen from "@/components/Rules-screen/Rules-screen.vue";
import listen_screen from "@/components/Listen-screen/Listen-screen.vue";
import ending_screen from "@/components/Ending-screen/Ending-screen.vue";

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
        {
            path: "/wts",
            component: WtsComponent,
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