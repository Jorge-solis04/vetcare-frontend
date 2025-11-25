// app/composables/usePets.ts
import { useAuthStore } from '~/store/auth'
import type { Pet, PetPayload } from '~~/types'

export const usePets = () => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  
  // Helper para peticiones autenticadas
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
  
  // Lista de mascotas
  const { data: pets, pending, refresh, error } = useAsyncData(
    'pets-list',
    () => apiFetch<Pet[]>('/pets'),
    { watch: [searchQuery] }
  )

  // Filtrar mascotas
  const filteredPets = computed(() => {
    if (!pets.value) return []
    if (!searchQuery.value) return pets.value
    
    const query = searchQuery.value.toLowerCase()
    return pets.value.filter(pet => 
      pet.name?.toLowerCase().includes(query) ||
      pet.species?.toLowerCase().includes(query) ||
      pet.breed?.toLowerCase().includes(query)
    )
  })

  const getPetById = async (id: string) => {
    return await apiFetch<Pet>(`/pets/${id}`)
  }

  const createPet = async (payload: PetPayload) => {
    await apiFetch('/pets', { method: 'POST', body: payload })
    await refresh()
  }

  const updatePet = async (id: string, payload: PetPayload) => {
    await apiFetch(`/pets/${id}`, { method: 'PUT', body: payload })
    await refresh()
  }

  const deletePet = async (id: string) => {
    await apiFetch(`/pets/${id}`, { method: 'DELETE' })
    await refresh()
  }

  return {
    pets: filteredPets,
    allPets: pets,
    pending,
    error,
    searchQuery,
    refresh,
    getPetById,
    createPet,
    updatePet,
    deletePet
  }
}