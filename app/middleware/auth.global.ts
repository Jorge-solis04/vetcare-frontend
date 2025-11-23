// app/middleware/auth.global.ts
import { useAuthStore } from '~/store/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // Lista de rutas públicas (donde no necesitas login)
  const publicRoutes = ['/login']

  // 1. Caso: El usuario NO está autenticado
  if (!authStore.isAuthenticated) {
    // Si intenta ir a una ruta que NO es pública...
    if (!publicRoutes.includes(to.path)) {
      // ...lo mandamos al login
      return navigateTo('/login')
    }
  } 
  
  // 2. Caso: El usuario SÍ está autenticado
  else {
    // Si intenta entrar al login estando ya logueado...
    if (to.path === '/login') {
      // ...lo mandamos al dashboard
      return navigateTo('/')
    }
  }

  // 3. Caso: Protección de Roles (Ejemplo para futuro)
  // if (to.path.startsWith('/admin') && authStore.user?.role !== 'Admin') {
  //   return navigateTo('/') // Acceso denegado
  // }
})