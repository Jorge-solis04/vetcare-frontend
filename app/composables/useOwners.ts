import { useAuthStore } from '~/store/auth'
import type { Owner, OwnerPayload } from '~~/types'

export const useOwners = () => {
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
  
  // Lista de dueños
  const { data: owners, pending, refresh, error } = useAsyncData(
    'owners-list',
    () => apiFetch<Owner[]>('/owners'),
    { watch: [searchQuery] }
  )

  // Filtrar dueños localmente
  const filteredOwners = computed(() => {
    if (!owners.value) return []
    if (!searchQuery.value) return owners.value
    
    const query = searchQuery.value.toLowerCase()
    return owners.value.filter(owner => 
      owner.name?.toLowerCase().includes(query) ||
      owner.email?.toLowerCase().includes(query) ||
      owner.phone?.toLowerCase().includes(query) ||
      owner.createdAt?.toLowerCase().includes(query)
    )
  })

  // Obtener un dueño por ID
  const getOwnerById = async (id: string) => {
    return await apiFetch<Owner>(`/owners/${id}`)
  }

  // Crear un nuevo dueño
  const createOwner = async (payload: OwnerPayload) => {
    await apiFetch('/owners', { method: 'POST', body: payload })
    await refresh()
  }

  // Actualizar un dueño existente
  const updateOwner = async (id: string, payload: OwnerPayload) => {
    await apiFetch(`/owners/${id}`, { method: 'PUT', body: payload })
    await refresh()
  }

  // Eliminar un dueño
  const deleteOwner = async (id: string) => {
    await apiFetch(`/owners/${id}`, { method: 'DELETE' })
    await refresh()
  }

  // Guardar (crear o actualizar según si tiene ID)
  const saveOwner = async (payload: OwnerPayload, id?: string) => {
    if (id) {
      return await updateOwner(id, payload)
    } else {
      return await createOwner(payload)
    }
  }

  return {
    // Estado
    owners: filteredOwners,
    allOwners: owners,
    pending,
    error,
    searchQuery,
    
    // Acciones
    refresh,
    getOwnerById,
    createOwner,
    updateOwner,
    deleteOwner,
    saveOwner
  }
}