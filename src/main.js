import Vue from 'vue'
import App from './Components/App/App.vue'
import router from "./routes";

import 'bootstrap/dist/css/bootstrap-grid.min.css';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
Vue.use(Vuetify);

import VueResource from 'vue-resource';
Vue.use(VueResource);
Vue.http.options.emulateJSON = true;

import VueRouter from 'vue-router';
Vue.use(VueRouter);

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})
