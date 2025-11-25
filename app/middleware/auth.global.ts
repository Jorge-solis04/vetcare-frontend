// app/middleware/auth.global.ts
import { useAuthStore } from '~/store/auth'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/login']
  
  // Si la ruta es pública, permitir acceso
  if (publicRoutes.includes(to.path)) {
    return
  }
  
  // Si no está autenticado, redirigir a login
  if (!authStore.isAuthenticated) {
    console.log('No autenticado, redirigiendo a login')
    return navigateTo('/login')
  }
  
  // Si está autenticado y trata de ir a login, redirigir al home
  if (authStore.isAuthenticated && to.path === '/login') {
    return navigateTo('/')
  }
})