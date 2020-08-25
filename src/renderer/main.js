import Vue from 'vue'
import axios from 'axios'
// import { AgGridVue } from "ag-grid-vue";

import App from './App'
import router from './router'
import store from './store'


import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
// Vue.use(AgGridVue)
Vue.use(Vuetify)

const opts = {}

const vuetify = new Vuetify(opts);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  vuetify,
  template: '<App/>'
}).$mount('#app')
