import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from '../store'
import Login from '../views/Login'
import Sign from '../views/sign'
import Home from '../views/index'
import Forget from '../views/forget'
// import Admin from '../views/admin'
import emailCheck from '../views/emailCheck'
import userList from '../components/admin/userList'
import chatRecord from '../components/admin/chatRecord'
import config from '../components/admin/config'

Vue.use(VueRouter)

/** 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题 */
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location) {
  return originalReplace.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/admin',
    name: 'admin',
    redirect: '/admin/userList',
    component: () => import('../views/admin'),
    children: [
      {
        path: 'userList',
        name: 'userList',
        component: userList
      },
      {
        path: 'chatRecord',
        name: 'chatRecord',
        component: chatRecord
      },
      {
        path: 'config',
        name: 'config',
        component: config
      }
    ]
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
      },
      {
        path: '/forget',
        name: 'forget',
        component: Forget
      },
      {
        path: '/emailCheck',
        name: 'emailCheck',
        component: emailCheck
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes
})

router.beforeEach((to, from, next) => {
  if (['/login', '/sign', '/forget', '/emailCheck'].includes(to.path)) {
    return next()
  }
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    next('/login')
    return
  }
  next()
})

export default router
