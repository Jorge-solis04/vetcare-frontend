// app/plugins/auth.ts
import { useAuthStore } from '../store/auth'

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  
  // Restaurar sesión desde cookies
  authStore.restoreSession()
  
  if (import.meta.client) {
    console.log('🔐 Auth plugin loaded (client)')
    console.log('Token:', authStore.token)
    console.log('User:', authStore.user)
    console.log('isAuthenticated:', authStore.isAuthenticated)
  }
})