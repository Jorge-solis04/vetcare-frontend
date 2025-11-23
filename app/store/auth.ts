// app/store/auth.ts
import { defineStore } from 'pinia'
import type { User, AuthResponse } from '~~/types/index'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: useCookie<string | null>('auth_token').value,
    user: null as User | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    // Login - llamada al backend
    async login(credentials: { formData: { email: string; password: string } }) {
      const config = useRuntimeConfig()
      
      const response = await $fetch<AuthResponse>(`${config.public.apiBase}/auth/login`, {
        method: 'POST',
        body: credentials.formData
      })

      // Guardar sesión con los datos recibidos
      this.setSession(response)
    },

    // Guardar sesión (token + usuario)
    setSession(data: AuthResponse) {
      this.token = data.token
      this.user = data.user

      // Guardar token en cookie
      const tokenCookie = useCookie('auth_token', { maxAge: 86400 })
      tokenCookie.value = data.token
      
      // Guardar usuario en cookie para persistencia
      const userCookie = useCookie('auth_user', { maxAge: 86400 })
      userCookie.value = JSON.stringify(data.user)
    },

    // Restaurar sesión desde cookies
    restoreSession() {
      const userCookie = useCookie<string>('auth_user')
      if (userCookie.value && this.token) {
        try {
          this.user = JSON.parse(userCookie.value)
        } catch (e) {
          console.error('Error parsing user cookie:', e)
          this.logout()
        }
      }
    },

    // Cerrar sesión
    logout() {
      this.token = null
      this.user = null
      
      const tokenCookie = useCookie('auth_token')
      tokenCookie.value = null
      
      const userCookie = useCookie('auth_user')
      userCookie.value = null
    }
  }
})