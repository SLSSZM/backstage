import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$http = axios.create({
  baseURL: 'http://localhost:3000/api'
})
Vue.prototype.$http.defaults.timeout = 50000;

Vue.prototype.$http.interceptors.request.use(config => {
  const token = window.sessionStorage.getItem('token');
  config.headers.Authorization = token;
  return config;
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
