import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('../views/login/Login.vue')
const Home = () => import('../views/home/Home.vue')
const Welcome = () => import('../components/Welcome.vue')
const Users = () => import('../views/home/children/Users.vue')
const Rights = () => import('../views/power/rights/Rights.vue')
const Roles = () => import('../views/power/roles/Roles.vue')
const Categories = () => import('../views/goods/Categories.vue')
const GoodsList = () => import('../views/goods/List.vue')
const Params = () => import('../views/goods/Params.vue')
const AddGoods = () => import('../views/goods/AddGoods.vue')
const Order = () => import('../views/order/Order.vue')
const Report = () => import('../views/report/Report.vue')

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
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
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
