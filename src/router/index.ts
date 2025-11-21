import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
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
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordView.vue'),
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: () => import('../views/ResetPasswordView.vue'),
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
      redirect: '/admin/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('../components/admin/Dashboard.vue'),
        },
        {
          path: 'classrooms',
          name: 'admin-classrooms',
          component: () => import('../components/admin/Classrooms.vue'),
        },
        {
          path: 'students',
          name: 'admin-students',
          component: () => import('../components/admin/Students.vue'),
        },
        {
          path: 'teachers',
          name: 'admin-teachers',
          component: () => import('../components/admin/Teachers.vue'),
        },
        {
          path: 'schedules',
          name: 'admin-schedules',
          component: () => import('../components/admin/Schedules.vue'),
        },
        {
          path: 'activity',
          name: 'admin-activity',
          component: () => import('../components/admin/ActivityLog.vue'),
        },
        {
          path: 'settings',
          name: 'admin-settings',
          component: () => import('../components/admin/Settings.vue'),
        },
      ],
    },
    {
      path: '/lab_availability',
      name: 'lab_availability',
      component: () => import('../components/LabAvailability.vue'),
    },
  ],
})

export default router
