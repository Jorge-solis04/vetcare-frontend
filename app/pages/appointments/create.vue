<script setup lang="ts">
import type { AppointmentPayload } from '~~/types'

const { createAppointment } = useAppointments()
const router = useRouter()
const toast = useToast()

const loading = ref(false)

const handleSubmit = async (data: AppointmentPayload) => {
  loading.value = true
  try {
    await createAppointment(data)
    
    toast.add({
      title: 'Cita creada',
      description: 'La cita se ha registrado correctamente',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    
    router.push('/appointments')
  } catch (error: any) {
    const errorMessage = error?.data?.message || 'Error al crear la cita'
    
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
        <span class="text-gray-900 dark:text-white font-medium">Nueva Cita</span>
      </nav>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Agendar Nueva Cita</h1>
      <p class="text-gray-500 dark:text-gray-400">Complete la información para registrar una nueva cita veterinaria.</p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
      <AppointmentsForm 
        :loading="loading"
        submit-label="Agendar Cita"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>