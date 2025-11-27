<script setup lang="ts">
import type { PetPayload } from '~~/types'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const petId = route.params.id as string

const { updatePet, getPetById } = usePets()

const loading = ref(false)
const loadingPet = ref(true)
const petData = ref<PetPayload>()

// ✅ Cargar datos de la mascota
onMounted(async () => {
  try {
    const pet = await getPetById(petId)
    console.log('pet', pet)
    if (pet) {
      petData.value = {
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        birthDate: pet.birthDate,
        ownerId: pet.ownerId
      }
    }
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'No se pudo cargar la mascota',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
    router.push('/pets')
  } finally {
    loadingPet.value = false
  }
})

const handleUpdate = async (data: PetPayload) => {
  loading.value = true
  try {
    await updatePet(petId, data)
    
    toast.add({
      title: 'Mascota actualizada',
      description: 'Los cambios se han guardado correctamente',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    
    router.push('/pets')
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
  router.push('/pets')
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="mb-6">
      <nav class="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
        <NuxtLink to="/" class="hover:text-gray-700 dark:hover:text-gray-300">Inicio</NuxtLink>
        <span>/</span>
        <NuxtLink to="/pets" class="hover:text-gray-700 dark:hover:text-gray-300">Pacientes</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 dark:text-white font-medium">Editar Paciente</span>
      </nav>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Editar Paciente</h1>
      <p class="text-gray-500 dark:text-gray-400">Actualice la información de la mascota.</p>
    </div>

    <div v-if="loadingPet" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
      <PetsForm 
        :initial-data="petData"
        :loading="loading"
        submit-label="Actualizar Paciente"
        @submit="handleUpdate"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>