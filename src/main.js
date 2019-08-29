import Vue from "vue";
import VModal from 'vue-js-modal';
import Transitions from 'vue2-transitions';
import App from "./App.vue";
import router from "./router";
import store from "./store";
import './styles/styles.scss';
import Utils from './plugins/utils';
console.log(Utils);

Vue.config.productionTip = false;
Vue.use(VModal);
Vue.use(Transitions);
Vue.use(Utils);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
