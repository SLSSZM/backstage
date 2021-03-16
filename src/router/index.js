import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/Login.vue'
import Home from '../views/home/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../views/home/children/Users.vue'
import Rights from '../views/power/rights/Rights.vue'
import Roles from '../views/power/roles/Roles.vue'
import Categories from '../views/goods/Categories.vue'
import GoodsList from '../views/goods/List.vue'
import Params from '../views/goods/Params.vue'
import AddGoods from '../views/goods/AddGoods.vue'
import Order from '../views/order/Order.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/Welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories },
      { path: '/goods', component: GoodsList },
      { path: '/params', component: Params },
      { path: '/goods/add', component: AddGoods },
      { path: '/orders', component: Order }
    ]
  }
]

const router = new VueRouter({
  routes
})

//配置路由导航守卫
router.beforeEach((to, from, next) => {
  //to 将要访问的网址
  //from 代表从哪个路径跳转过来
  //next 函数，表示放行
  // next('/login)强制跳转到 /login
  if (to.path === '/login') return next();
  //根据token判断是否登录，或登录过期
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('login');
  next();
})

export default router
