import Vue from 'vue';
import Vuex from 'vuex';

import sentinel from './modules/sentinel';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    sentinel,
  },
});
