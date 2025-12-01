// app/store/auth.ts
import { defineStore } from 'pinia'
import type { User, AuthResponse } from '~~/types/index'


export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as User | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials: { formData: { email: string; password: string } }) {
      const config = useRuntimeConfig()
      
      const response = await $fetch<AuthResponse>(`${config.public.apiBase}/auth/login`, {
        method: 'POST',
        body: credentials.formData
      })

      this.setSession(response)
    },

    setSession(data: AuthResponse) {
      this.token = data.token
      this.user = data.user

      const tokenCookie = useCookie('auth_token', { maxAge: 86400 })
      tokenCookie.value = data.token
      
      const userCookie = useCookie('auth_user', { maxAge: 86400 })
      userCookie.value = JSON.stringify(data.user)
      
      console.log('✅ Sesión guardada:', { token: this.token, user: this.user })
    },

    restoreSession() {
      const tokenCookie = useCookie<string | null>('auth_token')
      const userCookie = useCookie<string | null>('auth_user')
      
      console.log('🔄 Restaurando sesión...')
      console.log('Token cookie:', tokenCookie.value)
      console.log('User cookie:', userCookie.value)
      
      if (tokenCookie.value) {
        this.token = tokenCookie.value
      }
      
      if (userCookie.value) {
        try {
          this.user = JSON.parse(userCookie.value)
        } catch (e) {
          console.error('❌ Error parsing user cookie:', e)
          this.logout()
        }
      }
      
      console.log('✅ Sesión restaurada:', { token: this.token, user: this.user })
    },

    logout() {
      this.token = null
      this.user = null
      
      const tokenCookie = useCookie('auth_token')
      tokenCookie.value = null
      
      const userCookie = useCookie('auth_user')
      userCookie.value = null
      
      console.log('🚪 Sesión cerrada')
    }
  }
})