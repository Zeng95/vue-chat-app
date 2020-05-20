import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: { name: 'Login' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login'),
    meta: { requiresGuest: true }
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: (to, from, next) => {
      store.dispatch('auth/logout').then(() => next({ name: 'Home' }))
    },
    meta: { requiresAuth: true }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import(/* webpackChunkName: "chat" */ '../views/Chat'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () =>
      import(/* webpackChunkName: "profile" */ '../views/Profile'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/404',
    alias: '*',
    name: 'NotFound',
    component: () =>
      import(/* webpackChunkName: "not-found" */ '@/views/NotFound')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start()

  store.dispatch('auth/initAuthentication').then(user => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      // 如果用户存在，说明是登录状态，允许继续跳转
      user ? next() : next({ name: 'Home' })
    } else if (to.matched.some(record => record.meta.requiresGuest)) {
      // 如果用户存在，说明是登录状态，需要跳转到 Chat 页面
      !user ? next() : next({ name: 'Chat' })
    } else {
      // Make sure to always call next()!
      next()
    }
  })
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

export default router
