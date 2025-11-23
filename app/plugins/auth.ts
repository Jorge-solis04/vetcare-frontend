// app/plugins/auth.ts
import { useAuthStore } from '../store/auth'

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  
  // Restaurar sesión al cargar la app
  authStore.restoreSession()
})