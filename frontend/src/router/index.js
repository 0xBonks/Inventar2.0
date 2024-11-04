import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import AuthService from '../services/auth'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { guest: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('../views/Inventory.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/sales',
    name: 'Sales',
    component: () => import('../views/Sales.vue'),
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const isAuthenticated = await store.dispatch('initAuth')
    
    if (!isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (AuthService.isAuthenticated()) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 