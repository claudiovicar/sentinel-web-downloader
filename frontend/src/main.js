import Vue from 'vue';

import BootstrapVue from 'bootstrap-vue';
import Multiselect from 'vue-multiselect';
import Snotify, { SnotifyPosition } from 'vue-snotify';

import App from './App.vue';
import router from './router';
import store from '@/store/store';


import 'vue-awesome/icons';

import '@/styles/main.scss';
import 'reset-css/sass/_reset.scss';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import 'vue-snotify/styles/material.css';
import 'animate.css';

const snotifyOptions = {
  toast: {
    position: SnotifyPosition.centerTop,
    showProgressBar: false,
    titleMaxLength: 24,
    maxOnScreen: 2,
  },
};

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(Multiselect);
Vue.use(Snotify, snotifyOptions);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
