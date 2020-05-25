import Vue from 'vue'
import Router from 'vue-router'

/* Specific page imports */
import Admin from './views/pages/Admin'
import Dashboard from './views/pages/Dashboard'
import Entry from './views/pages/Entry'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Dashboard
    },
    {
      path: '/login',
      name: 'Login',
      component: Entry,
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin
    }
  ]
})

export default router;