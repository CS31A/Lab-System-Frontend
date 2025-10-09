import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/laboratory/1',
      name: 'slab1',
      component: () => import('../views/Slab1.vue'),
    },
    {
      path: '/laboratory/2',
      name: 'slab2',
      component: () => import('../views/Slab2.vue'),
    },
    {
      path: '/laboratory/3',
      name: 'slab3',
      component: () => import('../views/Slab3.vue'),
    },
    {
      path: '/laboratory/4',
      name: 'slab4',
      component: () => import('../views/Slab4.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
    },
    {
      path: '/lab_availability',
      name: 'lab_availability',
      component: () => import('../components/LabAvailability.vue'),
    },
  ],
})

export default router
