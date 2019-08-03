import Vue from "vue";
import VModal from 'vue-js-modal';
import App from "./App.vue";
import router from "./router";
import store from "./store";
import './styles/styles.scss';

Vue.config.productionTip = false;
Vue.use(VModal);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
