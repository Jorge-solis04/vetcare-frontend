<script setup lang="ts">
import { CalendarDate, parseDate, getLocalTimeZone } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'
import { useAppointments } from '~/composables/useAppointments'
import type { AppointmentPayload } from '~~/types'
const toast = useToast()
const selectedDate = ref<DateValue>(parseDate(new Date().toISOString().split('T')[0]))

const { 
  appointments, 
  pending, 
  getAppointmentsByDate,
  updateAppointment 
  
} = useAppointments()

const appointmentsForSelectedDate = ref<any[]>([])
const loadingDate = ref(false)

// ✅ Convertir CalendarDate a string YYYY-MM-DD para la API
const dateString = computed(() => {
  if (!selectedDate.value) return ''
  return `${selectedDate.value.year}-${String(selectedDate.value.month).padStart(2, '0')}-${String(selectedDate.value.day).padStart(2, '0')}`
})

const loadAppointments = async () => {
  loadingDate.value = true
  try {
    appointmentsForSelectedDate.value = await getAppointmentsByDate(dateString.value)
  } catch (error) {
    console.error('Error loading appointments:', error)
  } finally {
    loadingDate.value = false
  }
}

// Cargar citas cuando cambia la fecha
watch(dateString, () => {
  loadAppointments()
})

// Cargar citas iniciales
onMounted(() => {
  loadAppointments()
})

const cancelAppointment = async (id: string, data: AppointmentPayload) => {

  const newData: AppointmentPayload = { ...data, status: 'CANCELLED' }

  try {
    await updateAppointment(id, newData)
    await loadAppointments()
    toast.add({
      title: 'Cita cancelada',
      description: 'La cita ha sido cancelada exitosamente.',
      color: 'success',
      duration: 3000,
    })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    toast.add({
      title: 'Error',
      icon: 'i-lucide-alert-circle',
      description: 'No se pudo cancelar la cita. Inténtalo de nuevo.',
      color: 'error',
      duration: 3000,
    })
  }
}

const completeAppointment = async(id: string, data: AppointmentPayload) =>{
  const newData: AppointmentPayload = { ...data, status: 'COMPLETED' }

  try {
    await updateAppointment(id, newData)
    await loadAppointments()
    toast.add({
      title: 'Cita completada',
      description: 'La cita ha sido completada exitosamente.',
      color: 'success',
      duration: 3000,
    })
  } catch (error) {
    console.error('Error updating appointment:', error)
    toast.add({
      title: 'Error',
      icon: 'i-lucide-alert-circle',
      description: 'No se pudo completar la cita. Inténtalo de nuevo.',
      color: 'error',
      duration: 3000,
    })
  }
}

// ✅ Formatear fecha para mostrar
const formattedDate = computed(() => {
  if (!selectedDate.value) return ''
  return new Date(dateString.value).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})




</script>

<template>
  <UiLayout title="Gestión de Citas" buttonTitle="Nueva Cita" icon="calendar" description="Visualiza, agenda y gestiona todas las citas de la clinica." path="/appointments/create">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Calendario -->
      <div class="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Calendario de Citas</h2>
        
        <UCalendar 
          v-model="selectedDate" 
          color="success"
          size="lg"
        />
      </div>

      <!-- Panel lateral con citas -->
      <div class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm rounded-lg p-6">
        <div class="mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Citas del día
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ formattedDate }}
          </p>
        </div>
        
        <!-- Loading -->
        <div v-if="loadingDate" class="flex justify-center py-8">
          <UIcon name="i-lucide-loader-2" class="w-6 h-6 animate-spin text-primary-500" />
        </div>

        <!-- Lista de citas -->
        <div v-else-if="appointmentsForSelectedDate.length > 0" class="space-y-3">
            <div 
            v-for="appointment in appointmentsForSelectedDate" 
            :key="appointment.id"
            class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transform transition-all duration-300 ease-in-out hover:scale-101 hover:shadow-md hover:z-10"
          >
            <AppointmentsAppointmentCard 
              :appointmentData="appointment"
              @cancel="cancelAppointment"
              @complete="completeAppointment"
            />
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
          <UIcon name="i-lucide-calendar-x" class="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No hay citas para este día</p>
        </div>
      </div>
    </div>
  </UiLayout>
</template>

