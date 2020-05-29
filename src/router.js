import Vue from 'vue'
import Router from 'vue-router'

/* Specific page imports */
import Admin from './views/pages/Admin'
import Dashboard from './views/pages/Dashboard'
import Entry from './views/pages/Entry'
import Profile from './views/pages/Profile'
import Rules from './views/pages/Rules'

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
    },
    {
      path: '/rules',
      name: 'Rules',
      component: Rules
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    }
  ]
})

export default router;