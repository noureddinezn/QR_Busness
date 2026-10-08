import { createRouter, createWebHistory } from 'vue-router'
const HomeView = () => import('../views/HomeView.vue')
const LoginView = () => import('../views/LoginView.vue')
const RegisterView = () => import('../views/RegisterView.vue')
const DashboardView = () => import('../views/DashboardView.vue')
const PagesView = () => import('../views/PagesView.vue')
const CreatePageView = () => import('../views/CreatePageView.vue')
const EditPageView = () => import('../views/EditPageView.vue')
const QrManagerView = () => import('../views/QrManagerView.vue')
const AnalyticsView = () => import('../views/AnalyticsView.vue')
const SettingsView = () => import('../views/SettingsView.vue')
const AdminView = () => import('../views/AdminView.vue')
const PublicPageView = () => import('../views/PublicPageView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
    { path: '/pages', name: 'pages', component: PagesView, meta: { requiresAuth: true } },
    { path: '/pages/create', name: 'pages.create', component: CreatePageView, meta: { requiresAuth: true } },
    { path: '/pages/:id/edit', name: 'pages.edit', component: EditPageView, meta: { requiresAuth: true } },
    { path: '/qr-codes', name: 'qr', component: QrManagerView, meta: { requiresAuth: true } },
    { path: '/analytics', name: 'analytics', component: AnalyticsView, meta: { requiresAuth: true } },
    { path: '/settings', name: 'settings', component: SettingsView, meta: { requiresAuth: true } },
    { path: '/admin', name: 'admin', component: AdminView, meta: { requiresAuth: true, requiresAdmin: true } },
    { path: '/p/:slug', name: 'public', component: PublicPageView },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
  ],
})

router.beforeEach((to) => {
  if (!to.meta.requiresAuth) return
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/login'
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return '/dashboard'
  }
})

export default router
