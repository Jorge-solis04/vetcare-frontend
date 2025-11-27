import { useAuthStore } from '~/store/auth'
import type { Appointment, AppointmentPayload } from '~~/types'

export const useAppointments = () => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  // ✅ Función helper para fetch con autenticación
  const apiFetch = async <T>(url: string, options: any = {}) => {
    return await $fetch<T>(`${config.public.apiBase}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${authStore.token}`
      }
    })
  }

  // ✅ Interfaz para los filtros
  interface AppointmentFilters {
    date?: string      // YYYY-MM-DD
    vetId?: string
    petId?: string
  }

  // ✅ GET - Obtener todas las citas con filtros opcionales
  const { data: appointments, pending, error, refresh } = useAsyncData(
    'appointments-data',
    () => apiFetch<Appointment[]>('/appointments')
  )

  // ✅ GET - Obtener citas filtradas
  const getAppointments = async (filters?: AppointmentFilters) => {
    const params = new URLSearchParams()
    
    if (filters?.date) params.append('date', filters.date)
    if (filters?.vetId) params.append('vetId', filters.vetId)
    if (filters?.petId) params.append('petId', filters.petId)

    const queryString = params.toString()
    const url = queryString ? `/appointments?${queryString}` : '/appointments'

    return await apiFetch<Appointment[]>(url)
  }

  

  // ✅ GET - Obtener citas por fecha específica
  const getAppointmentsByDate = async (date: string) => {
    return await getAppointments({ date })
  }

  // ✅ GET - Obtener citas por veterinario
  const getAppointmentsByVet = async (vetId: string) => {
    return await getAppointments({ vetId })
  }

  // ✅ GET - Obtener citas por mascota
  const getAppointmentsByPet = async (petId: string) => {
    return await getAppointments({ petId })
  }

  

  const getAppointmentById = async (id: string) => {
    return await apiFetch<Appointment>(`/appointments/${id}`)
  }

  // ✅ POST - Crear nueva cita
  const createAppointment = async (payload: AppointmentPayload) => {
    return await apiFetch<Appointment>('/appointments', {
      method: 'POST',
      body: payload
    })
  }

  // ✅ PUT - Actualizar cita
  const updateAppointment = async (id: string, payload: Partial<AppointmentPayload>) => {
    return await apiFetch<Appointment>(`/appointments/${id}`, {
      method: 'PUT',
      body: payload
    })
  }

  // ✅ DELETE - Eliminar cita
  const deleteAppointment = async (id: string) => {
    return await apiFetch(`/appointments/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    // Data
    appointments,
    pending,
    error,
    
    // Methods
    refresh,
    getAppointments,
    getAppointmentsByDate,
    getAppointmentsByVet,
    getAppointmentsByPet,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment
  }
}