<script setup lang="ts">
import type { AppointmentPayload } from '~~/types'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const appointmentId = route.params.id as string

const { updateAppointment, getAppointmentById } = useAppointments()


const loading = ref(false)
const loadingAppointment = ref(true)
const appointmentData = ref<AppointmentPayload>()

// ✅ Cargar datos de la cita
onMounted(async () => {
  try {
    const appointment = await getAppointmentById(appointmentId)
    
    if (appointment) {
      appointmentData.value = {
        date: appointment.date,
        petId: appointment.petId,
        vetId: appointment.vetId,
        status: appointment.status
      }
    }
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'No se pudo cargar la cita',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
    router.push('/appointments')
  } finally {
    loadingAppointment.value = false
  }
})

const handleUpdate = async (data: AppointmentPayload) => {
  loading.value = true
  try {
    await updateAppointment(appointmentId, data)
    
    toast.add({
      title: 'Cita actualizada',
      description: 'Los cambios se han guardado correctamente',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    
    router.push('/appointments')
  } catch (error: any) {
    const errorMessage = error?.data?.message || 'Error al actualizar la cita'
    
    toast.add({
      title: 'Error',
      description: errorMessage,
      color: 'error',
      icon: 'i-lucide-alert-circle',
      duration: 5000
    })
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push('/appointments')
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="mb-6">
      <nav class="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
        <NuxtLink to="/" class="hover:text-gray-700 dark:hover:text-gray-300">Inicio</NuxtLink>
        <span>/</span>
        <NuxtLink to="/appointments" class="hover:text-gray-700 dark:hover:text-gray-300">Citas</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 dark:text-white font-medium">Editar Cita</span>
      </nav>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Editar Cita</h1>
      <p class="text-gray-500 dark:text-gray-400">Actualice la información de la cita veterinaria.</p>
    </div>

    <!-- Loading state -->
    <div v-if="loadingAppointment" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Form -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
      <AppointmentsForm 
        :initial-data="appointmentData"
        :loading="loading"
        submit-label="Actualizar Cita"
        @submit="handleUpdate"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>