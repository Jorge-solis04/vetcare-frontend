import { useAuthStore } from '~/store/auth'

export interface RegisterPayload {
  email: string
  password: string
  name: string
  role: 'ADMIN' | 'VET'
}

export interface RegisterResponse {
  message: string
  user: {
    id: string
    email: string
    name: string
    role: string
    createdAt: string
    updatedAt: string
  }
}

export const useRegister = () => {
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

  // Registrar un nuevo usuario
  const registerUser = async (payload: RegisterPayload) => {
    return await apiFetch<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: payload
    })
  }

  // Lista de usuarios (si existe un endpoint para listarlos)
  const { data: users, pending, refresh, error } = useAsyncData(
    'users-list',
    () => apiFetch<RegisterResponse['user'][]>('/users'),
    {
      lazy: true,
      server: false
    }
  )

  // Eliminar usuario (si existe el endpoint)
  const deleteUser = async (id: string) => {
    await apiFetch(`/users/${id}`, {
      method: 'DELETE'
    })
    await refresh()
  }

  // Actualizar usuario (si existe el endpoint)
  const updateUser = async (id: string, payload: Partial<RegisterPayload>) => {
    await apiFetch(`/users/${id}`, {
      method: 'PUT',
      body: payload
    })
    await refresh()
  }

  return {
    // Acciones
    registerUser,
    updateUser,
    deleteUser,
    
    // Estado (si necesitas listar usuarios)
    users,
    pending,
    error,
    refresh
  }
}