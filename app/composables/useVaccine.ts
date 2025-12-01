import { useAuthStore } from '~/store/auth'
import type { Vaccine, VaccinePayload } from '~~/types'
import { ref } from 'vue'

export const useVaccines = () => {
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

  const searchQuery = ref('')
  
  // Lista de vacunas
  const { data: vaccines, pending, refresh, error } = useAsyncData(
    'vaccines-list',
    () => apiFetch<Vaccine[]>('/vaccines'),
    { watch: [searchQuery] }
  )

  // Filtrar vacunas
  const filteredVaccines = computed(() => {
    if (!vaccines.value) return []
    if (!searchQuery.value) return vaccines.value
    
    const query = searchQuery.value.toLowerCase()
    return vaccines.value.filter(vaccine => 
      vaccine.name?.toLowerCase().includes(query)
    )
  })

  const getVaccineById = async (id: string) => {
    return await apiFetch<Vaccine>(`/vaccines/${id}`)
  }

  const createVaccine = async (payload: VaccinePayload) => {
    await apiFetch<Vaccine>('/vaccines', {
      method: 'POST',
      body: payload
    })
    await refresh()
  }

  const updateVaccine = async (id: string, payload: Partial<VaccinePayload>) => {
    await apiFetch<Vaccine>(`/vaccines/${id}`, {
      method: 'PUT',
      body: payload
    })
    await refresh()
  }

  const deleteVaccine = async (id: string) => {
    await apiFetch(`/vaccines/${id}`, {
      method: 'DELETE'
    })
    await refresh()
  }

  return {
    vaccines: filteredVaccines,
    allVaccines: vaccines,
    pending,
    error,
    searchQuery,
    refresh,
    getVaccineById,
    createVaccine,
    updateVaccine,
    deleteVaccine
  }
}