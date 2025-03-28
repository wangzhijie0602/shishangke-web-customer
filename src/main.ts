import { createSSRApp } from "vue";
import * as Pinia from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'weapp-cookie'
import App from "./App.vue";
export function createApp() {
  const app = createSSRApp(App);
  const pinia = Pinia.createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
  return {
    app,
    Pinia,
  };
}
