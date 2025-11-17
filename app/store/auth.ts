// import { defineStore } from 'pinia'
// import { ref } from 'vue'

// export const useAuthStore = defineStore('auth', () => {
//   const token = ref<string | null>(null)
//   const user = ref<any>(null)

//   // Inicializar desde localStorage si existe
//   if (import.meta.client) {
//     token.value = localStorage.getItem('token')
//     const savedUser = localStorage.getItem('user')
//     if (savedUser) {
//       user.value = JSON.parse(savedUser)
//     }
//   }

//   const setAuth = (newToken: string, newUser: any) => {
//     token.value = newToken
//     user.value = newUser
    
//     if (import.meta.client) {
//       localStorage.setItem('token', newToken)
//       localStorage.setItem('user', JSON.stringify(newUser))
//     }
//   }

//   const logout = () => {
//     token.value = null
//     user.value = null
    
//     if (import.meta.client) {
//       localStorage.removeItem('token')
//       localStorage.removeItem('user')
//     }
//   }

//   const isAuthenticated = () => {
//     return !!token.value
//   }

//   return {
//     token,
//     user,
//     setAuth,
//     logout,
//     isAuthenticated,
//   }
// })
