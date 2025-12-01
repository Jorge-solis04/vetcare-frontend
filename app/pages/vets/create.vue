<script setup lang="ts">
import type { VetPayload } from '../../../types'

const { createVet} = useVets()
const router = useRouter()
const toast = useToast()

const loading = ref(false)

const handleSubmit = async (data: VetPayload) => {
  loading.value = true
  try {
    await createVet(data)
    
    toast.add({
      title: 'Veterinario creado',
      description: 'El veterinario se ha registrado correctamente',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    
    router.push('/vets')
  } catch (error: any) {
    const errorMessage = error?.data?.message || 'Error al crear el veterinario'
    
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
  router.push('/vets')
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="mb-6">
      <nav class="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
        <NuxtLink to="/" class="hover:text-gray-700 dark:hover:text-gray-300">Inicio</NuxtLink>
        <span>/</span>
        <NuxtLink to="/owners" class="hover:text-gray-700 dark:hover:text-gray-300">Veterinarios</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 dark:text-white font-medium">Añadir Veterinario</span>
      </nav>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Añadir Nuevo Veterinario</h1>
      <p class="text-gray-500 dark:text-gray-400">Complete la información para registrar un nuevo veterinario en el sistema.</p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
      <VetsVetForm 
        :loading="loading"
        submit-label="Guardar Veterinario"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>