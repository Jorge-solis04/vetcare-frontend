<script setup lang="ts">
import type { OwnerPayload } from '../../../types'

const { createOwner } = useOwners()
const router = useRouter()
const toast = useToast()

const loading = ref(false)

const handleSubmit = async (data: OwnerPayload) => {
  loading.value = true
  try {
    await createOwner(data)
    
    toast.add({
      title: 'Dueño creado',
      description: 'El dueño se ha registrado correctamente',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    
    router.push('/owners')
  } catch (error: any) {
    const errorMessage = error?.data?.message || 'Error al crear el dueño'
    
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
  router.push('/owners')
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="mb-6">
      <nav class="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
        <NuxtLink to="/" class="hover:text-gray-700 dark:hover:text-gray-300">Inicio</NuxtLink>
        <span>/</span>
        <NuxtLink to="/owners" class="hover:text-gray-700 dark:hover:text-gray-300">Dueños</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 dark:text-white font-medium">Añadir Dueño</span>
      </nav>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Añadir Nuevo Dueño</h1>
      <p class="text-gray-500 dark:text-gray-400">Complete la información para registrar un nuevo dueño en el sistema.</p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
      <OwnersOwnerForm 
        :loading="loading"
        submit-label="Guardar Dueño"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>