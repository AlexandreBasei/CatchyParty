import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createI18n } from "vue-i18n";
import en from "../src/lang/en.json";
import fr from "../src/lang/fr.json";

const app = createApp(App)

// configure i18n
const i18n = createI18n({
  locale: localStorage.getItem('lang') || 'fr',
  fallbackLocale: "fr",
  messages: { fr, en },
});

app.use(router)
app.use(i18n);
app.mount('#app')
