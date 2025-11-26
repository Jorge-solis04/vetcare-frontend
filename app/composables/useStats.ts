import { useAuthStore } from '~/store/auth'
import type { Pet, PetPayload, DashboardStats } from '~~/types'

export const useStats = ()  =>{
    const authStore = useAuthStore()
    const config = useRuntimeConfig()

    const apiFetch = async <T>(url: string, options: any = {}) => {
      return await $fetch<T>(`${config.public.apiBase}${url}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${authStore.token}`
        }
      })
    }

    const { data: stats, pending, error, refresh } = useAsyncData(
      'stats-data',
      () => apiFetch<DashboardStats>('/stats/dashboard')
    )

    return{
        stats,
        pending,
        error,
        refresh
    }
}