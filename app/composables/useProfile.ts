import { useAuthStore } from '~/store/auth'
import type { Profile } from '~~/types'

export const useProfile = () => {
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

  // Obtener perfil del usuario autenticado
  const { data: profile, pending, error, refresh } = useAsyncData(
    'user-profile',
    () => apiFetch<Profile>('/auth/profile'),
    {
      lazy: true,
      server: false
    }
  )

  // Actualizar perfil
  const updateProfile = async (payload: Partial<Profile['user']>) => {
    const updated = await apiFetch<Profile>('/auth/profile', {
      method: 'PUT',
      body: payload
    })
    await refresh()
    return updated
  }

  // Cambiar contraseña
  const changePassword = async (currentPassword: string, newPassword: string) => {
    return await apiFetch('/auth/change-password', {
      method: 'POST',
      body: {
        currentPassword,
        newPassword
      }
    })
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Formatear hora
  const formatTime = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  // Obtener iniciales
  const getInitials = (name?: string) => {
    if (!name) return '??'
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }

  return {
    profile,
    pending,
    error,
    refresh,
    updateProfile,
    changePassword,
    formatDate,
    formatTime,
    getInitials
  }
}