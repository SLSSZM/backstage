import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'

//导入nprogress进度条
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

Vue.config.productionTip = false
Vue.prototype.$http = axios.create({
  baseURL: 'http://10.50.244.77:3000/api'
})
Vue.prototype.$http.defaults.timeout = 50000;
//在request拦截器展示进度条
Vue.prototype.$http.interceptors.request.use(config => {
  NProgress.start();
  const token = window.sessionStorage.getItem('token');
  config.headers.Authorization = token;
  return config;
})
//在response拦截器隐藏进度条
Vue.prototype.$http.interceptors.response.use(config => {
  NProgress.done();
  return config;
})

Vue.filter('dateFormat', originVal => {
  const date = new Date(originVal);
  const y = date.getFullYear();
  const m = (date.getMonth() + 1 + '').padStart(2, '0');
  const d = (date.getDate() + '').padStart(2, '0');

  const hh = (date.getHours() + '').padStart(2, '0');
  const mm = (date.getMinutes() + '').padStart(2, '0');
  const ss = (date.getSeconds() + '').padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
