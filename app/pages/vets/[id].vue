<script setup lang="ts">
import type { VetPayload } from '../../../types'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const vetId = route.params.id as string

const { updateVet, getVetById } = useVets()

const loading = ref(false)
const loadingVet = ref(true)
const vetData = ref<VetPayload>()

onMounted(async () => {
  try {
    const vet = await getVetById(vetId)
    console.log('veterinario', vet)
    if (vet) {
      vetData.value = {
        name: vet.name,
        specialty: vet.specialty,
        isActive: vet.isActive,
      }
    }
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'No se pudo cargar el veterinario/a',
      icon: 'i-lucide-alert-circle'
    })
    router.push('/vets')
  } finally {
    loadingVet.value = false
  }
})

const handleUpdate = async (data: VetPayload) => {
  loading.value = true
  try {
    await updateVet(vetId, data)
    
    toast.add({
      title: 'Veterinario/a actualizado/a',
      description: 'Los cambios se han guardado correctamente',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    
    router.push('/vets')
  } catch (error: any) {
    const errorMessage = error?.data?.message || 'Error al actualizar el veterinario/a'
    
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
        <span class="text-gray-900 dark:text-white font-medium">Editar Veterinario</span>
      </nav>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Editar Veterinario</h1>
      <p class="text-gray-500 dark:text-gray-400">Actualice la información del veterinario.</p>
    </div>

    <div v-if="loadingVet" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
      <VetsVetForm 
        :initial-data="vetData"
        :loading="loading"
        submit-label="Actualizar Veterinario/a"
        @submit="handleUpdate"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>