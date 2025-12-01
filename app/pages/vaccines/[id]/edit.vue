<script setup lang="ts">
import type { VaccinePayload } from '~~/types'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const vaccineId = route.params.id as string

const { updateVaccine, getVaccineById } = useVaccines()

const loading = ref(false)
const loadingVaccine = ref(true)
const vaccineData = ref<VaccinePayload>()

onMounted(async () => {
  try {
    const vaccine = await getVaccineById(vaccineId)
    console.log('vaccine', vaccine)
    if (vaccine) {
      vaccineData.value = {
        name: vaccine.name,
        appliedDate: vaccine.appliedDate,
        nextDose: vaccine.nextDose,
        petId: vaccine.petId
      }
    }
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'No se pudo cargar la vacuna',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
    router.push('/vaccines')
  } finally {
    loadingVaccine.value = false
  }
})

const handleUpdate = async (data: VaccinePayload) => {
  loading.value = true
  try {
    await updateVaccine(vaccineId, data)
    
    toast.add({
      title: 'Vacuna actualizada',
      description: 'Los cambios se han guardado correctamente',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    
    router.push('/vaccines')
  } catch (error: any) {
    const errorMessage = error?.data?.message || 'Error al actualizar la mascota'
    
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
  router.push('/vaccines')
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
        <span class="text-gray-900 dark:text-white font-medium">Editar Vacuna</span>
      </nav>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Editar Vacuna</h1>
      <p class="text-gray-500 dark:text-gray-400">Actualice la información de la vacuna.</p>
    </div>

    <div v-if="loadingVaccine" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
      <VaccinesForm 
        :initial-data="vaccineData"
        :loading="loading"
        submit-label="Actualizar Vacuna"
        @submit="handleUpdate"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>