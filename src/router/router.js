import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Sign from '../views/sign'
import Home from '../views/index'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/home',
    name: 'home',
    // redirect: '/home/chatHistory',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    children: [
      {
        path: '/sign',
        name: 'sign',
        component: Sign
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (['/login', '/sign'].includes(to.path)) return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
