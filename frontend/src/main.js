import Vue from 'vue';

import BootstrapVue from 'bootstrap-vue';
import Multiselect from 'vue-multiselect';

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

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(Multiselect);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
