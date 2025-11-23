import { useAuthStore } from "~/store/auth";


export const useApiFetch = <T>(request: string | (() => string), opts?: any) => {
  const config = useRuntimeConfig()
  
  return useFetch<T>(request, {
    baseURL: config.public.apiBase,
    
    ...opts,

    onRequest({ options }) {
      const authStore = useAuthStore()
      
      if (authStore.token) {
        options.headers = options.headers || {}
        // @ts-ignore
        options.headers.Authorization = `Bearer ${authStore.token}`
      }
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
        const authStore = useAuthStore()
        authStore.logout()
        await navigateTo('/login')
      }
    }
  })
}