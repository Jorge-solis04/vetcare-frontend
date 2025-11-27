import { useAuthStore } from '~/store/auth'
import type { Vet } from '~~/types'

export const useVets = () => {
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

  // GET - Obtener todos los veterinarios
  const { data: allVets, pending, error } = useAsyncData(
    'vets-data',
    () => apiFetch<Vet[]>('/vets/')
  )

  return {
    allVets,
    pending,
    error
  }
}