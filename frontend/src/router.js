import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/consulta',
      name: 'consulta',
      component: () => import('./views/StatusConsulta.vue'),
    },
  ],
});
