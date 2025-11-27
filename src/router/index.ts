import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

// Extend RouteMeta interface for type safety
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    roles?: Array<'admin' | 'teacher'>
    redirectIfAuthenticated?: boolean
  }
}

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
      meta: { requiresAuth: true, roles: ['admin', 'teacher'] },
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: { redirectIfAuthenticated: true },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: () => import('../views/ResetPasswordView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/laboratory/:id',
      name: 'laboratory',
      component: () => import('../views/Slab.vue'),
      meta: { requiresAuth: true, roles: ['admin', 'teacher'] },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      redirect: '/admin/dashboard',
      meta: { requiresAuth: true, roles: ['admin'] },
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
        {
          path: 'reports',
          name: 'admin-reports',
          component: () => import('../views/LaboratoryReports.vue'),
        },
      ],
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: () => import('../views/TeacherView.vue'),
      redirect: '/teacher/dashboard',
      meta: { requiresAuth: true, roles: ['teacher'] },
      children: [
        {
          path: 'dashboard',
          name: 'teacher-dashboard',
          component: () => import('../components/teacher/Dashboard.vue'),
        },
        {
          path: 'classrooms',
          name: 'teacher-classrooms',
          component: () => import('../components/admin/Classrooms.vue'),
        },
        {
          path: 'students',
          name: 'teacher-students',
          component: () => import('../components/admin/Students.vue'),
        },
        {
          path: 'schedules',
          name: 'teacher-schedules',
          component: () => import('../components/admin/Schedules.vue'),
        },
        {
        path: 'lab_availability',
        name: 'lab_availability',
        component: () => import('../components/LabAvailability.vue'),
        },
        {
          path: 'reports',
          name: 'teacher-reports',
          component: () => import('../views/LaboratoryReports.vue'),
        },
      ],
    },

  ],
})

// Navigation guard for authentication and authorization
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // Wait for auth initialization on first navigation
  if (!authStore.isInitialized && !authStore.isLoading) {
    await authStore.initializeAuth()
  }
  else if (authStore.isLoading) {
    // Wait for any pending auth operations to complete efficiently
    await new Promise<void>((resolve) => {
      const checkLoading = () => {
        if (!authStore.isLoading) {
          resolve()
        }
        else {
          setTimeout(checkLoading, 50)
        }
      }
      checkLoading()
    })
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const redirectIfAuthenticated = to.meta.redirectIfAuthenticated

  // Collect roles from all matched route records (parent + child)
  const allowedRoles = to.matched.reduce<Array<'admin' | 'teacher'>>((roles, record) => {
    if (record.meta.roles) {
      return [...roles, ...record.meta.roles]
    }
    return roles
  }, [])

  // Handle authenticated users trying to access login page
  if (redirectIfAuthenticated && authStore.isAuthenticated) {
    const redirectPath = authStore.isAdmin ? '/admin/dashboard' : authStore.isTeacher ? '/teacher/dashboard' : '/home'
    return next(redirectPath)
  }

  // Public routes - allow access
  if (!requiresAuth) {
    return next()
  }

  // Protected routes - check authentication
  if (!authStore.isAuthenticated) {
    // Store intended destination for redirect after login
    return next({
      name: 'Login',
      query: { redirect: to.fullPath },
    })
  }

  // Check role-based access using collected roles from route hierarchy
  if (allowedRoles.length > 0 && !authStore.hasRole(allowedRoles)) {
    console.warn(
      `Access denied: User role '${authStore.user?.role}' not in allowed roles:`,
      allowedRoles,
    )

    // Redirect to appropriate home page based on role
    const fallbackPath = authStore.isAdmin ? '/admin/dashboard' : authStore.isTeacher ? '/teacher/dashboard' : '/home'
    return next(fallbackPath)
  }

  // All checks passed
  next()
})

export default router
