<script setup lang="ts">
import type { VaccinePayload } from '~~/types'

const { createVaccine } = useVaccines()
const router = useRouter()
const toast = useToast()

const loading = ref(false)

const handleSubmit = async (data: VaccinePayload) => {
  loading.value = true
  try {
    await createVaccine(data)
    
    toast.add({
      title: 'Vacuna creada',
      description: 'La vacuna se ha registrado correctamente',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    
    router.push('/vaccines')
  } catch (error: any) {
    const errorMessage = error?.data?.message || 'Error al crear la vacuna'
    
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
  router.push('/pets')
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="mb-6">
      <nav class="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
        <NuxtLink to="/" class="hover:text-gray-700 dark:hover:text-gray-300">Inicio</NuxtLink>
        <span>/</span>
        <NuxtLink to="/vaccines" class="hover:text-gray-700 dark:hover:text-gray-300">Vacunas</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 dark:text-white font-medium">Añadir Vacuna</span>
      </nav>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Añadir Nueva Vacuna</h1>
      <p class="text-gray-500 dark:text-gray-400">Complete la información para registrar una nueva vacuna en el sistema.</p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
      <VaccinesForm 
        :loading="loading"
        submit-label="Guardar Vacuna"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>