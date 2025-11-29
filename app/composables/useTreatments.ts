import { useAuthStore } from '~/store/auth'
import type { Treatment, TreatmentPayload } from '~~/types'

export const useTreatments = () => {
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

  const getTreatmentsByPet = async (petId: string) => {
    return await apiFetch<Treatment[]>(`/treatments/pet/${petId}`)
  }

  const createTreatment = async (payload: TreatmentPayload) => {
    return await apiFetch<Treatment>('/treatments', {
      method: 'POST',
      body: payload
    })
  }

  const updateTreatment = async (id: string, payload: Partial<TreatmentPayload>) => {
    return await apiFetch<Treatment>(`/treatments/${id}`, {
      method: 'PUT',
      body: payload
    })
  }

  const deleteTreatment = async (id: string) => {
    return await apiFetch(`/treatments/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    getTreatmentsByPet,
    createTreatment,
    updateTreatment,
    deleteTreatment
  }
}