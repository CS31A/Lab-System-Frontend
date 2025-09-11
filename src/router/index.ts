import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
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
    // meta: { requiresAuth: true },
  },
  {
    path: '/laboratory/2',
    name: 'slab2',
    component: () => import('../views/Slab2.vue'),
    // meta: { requiresAuth: true },
  },
  {
    path: '/laboratory/3',
    name: 'slab3',
    component: () => import('../views/Slab3.vue'),
    // meta: { requiresAuth: true },
  },
  {
    path: '/laboratory/4',
    name: 'slab4',
    component: () => import('../views/Slab4.vue'),
    // meta: { requiresAuth: true },
  },
  {
    path: '/lab_availability',
    name: 'lab_availability',
    component: () => import('../components/LabAvailability.vue'),
    // meta: { requiresAuth: true },
  },
  {
    path: '/teacher_dashboard',
    name: 'teacher_dashboard',
    component: () => import('../components/TeacherDashboard.vue'),
    // meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard to check for authentication on routes that require it
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true' // example auth check replace with real service

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'Login' })
    }
    else {
      next()
    }
  }
  else {
    next()
  }
})

export default router
