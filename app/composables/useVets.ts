import Vets from '~/pages/vets/index.vue'
import { useAuthStore } from '~/store/auth'
import type { Vet, VetPayload } from '~~/types'

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

  const searchQuery = ref('')

  // GET - Obtener todos los veterinarios
  const { data: allVets, pending, refresh, error } = useAsyncData(
    'vets-data',
    () => apiFetch<Vet[]>('/vets/'),
    {watch: [searchQuery]}
  )

  // Filtrar vets localmente
    const filteredVets = computed(() => {
      if (!allVets.value) return []
      if (!searchQuery.value) return allVets.value
      
      const query = searchQuery.value.toLowerCase()
      return allVets.value.filter(vet => 
        vet.name?.toLowerCase().includes(query) ||
        vet.specialty?.toLowerCase().includes(query) ||
        (vet.isActive ? 'active' : 'inactive').includes(query)
      )
    })
  
    // Obtener un vet por ID
    const getVetById = async (id: string) => {
      return await apiFetch<Vet>(`/vets/${id}`)
    }
  
    // Crear un nuevo vet
    const createVet = async (payload: VetPayload) => {
      await apiFetch('/vets', { method: 'POST', body: payload })
      await refresh()
    }
  
    // Actualizar un vet existente
    const updateVet = async (id: string, payload: VetPayload) => {
      await apiFetch(`/vets/${id}`, { method: 'PUT', body: payload })
      await refresh()
    }
  
    // Eliminar un vet
    const deleteVet = async (id: string) => {
      await apiFetch(`/vets/${id}`, { method: 'DELETE' })
      await refresh()
    }
  
    // Guardar (crear o actualizar según si tiene ID)
    const saveVet = async (payload: VetPayload, id?: string) => {
      if (id) {
        return await updateVet(id, payload)
      } else {
        return await createVet(payload)
      }
    }
  
    return {
      // Estado
      owners: filteredVets,
      allVets: allVets,
      pending,
      error,
      searchQuery,
      
      // Acciones
      refresh,
      getVetById,
      createVet,
      updateVet,
      deleteVet,
      saveVet
    }
  }
