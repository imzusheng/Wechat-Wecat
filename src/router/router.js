import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Sign from '../views/sign'
import Home from '../views/index'
import Forget from '../views/forget'
import store from '../store/index'
import Admin from '../views/admin'
import emailCheck from '../views/emailCheck'
import userList from '../components/admin/userList'
import chatRecord from '../components/admin/chatRecord'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
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
    component: Admin,
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
  base: '/chat',
  routes
})

router.beforeEach((to, from, next) => {
  if (['/login'].includes(to.path)) {
    return next()
  } else if (['/sign', '/forget', '/emailCheck'].includes(to.path)) { // 防止直接通过url进入注册页面
    if (store.state.sign || store.state.forget || store.state.emailCheck) {
      return next()
    } else {
      return next('/login')
    }
  }
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
