import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import '@/styles/main.scss';
import 'reset-css/sass/_reset.scss';
import 'leaflet/dist/leaflet.css';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
