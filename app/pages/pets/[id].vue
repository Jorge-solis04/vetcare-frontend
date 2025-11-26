<script setup lang="ts">
import type { PetPayload, Owner } from '~~/types'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const petId = route.params.id as string

const schema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  species: z.string().min(1, 'La especie es obligatoria'),
  breed: z.string().min(2, 'La raza debe tener al menos 2 caracteres'),
  birthDate: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
  ownerId: z.string().min(1, 'Debe seleccionar un dueño')
})

type Schema = z.output<typeof schema>

const { updatePet, getPetById } = usePets()
const { allOwners, pending: loadingOwners } = useOwners()

const state = reactive<PetPayload>({
  name: '',
  species: '',
  breed: '',
  birthDate: '',
  ownerId: ''
})

const loading = ref(false)
const loadingPet = ref(true)

// Cargar datos de la mascota
onMounted(async () => {
  try {
    const pet = await getPetById(petId)
    
    if (pet) {
      state.name = pet.name
      state.species = pet.species
      state.breed = pet.breed
      state.birthDate = pet.birthDate.split('T')[0]
      state.ownerId = pet.ownerId
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

const ownersOptions = computed(() => {
  if (!allOwners.value) return []
  return allOwners.value.map((owner: Owner) => ({
    label: owner.name,
    value: owner.id
  }))
})

const handleUpdate = async (event: FormSubmitEvent<Schema>) => {
  loading.value = true
  try {
    await updatePet(petId, event.data)
    
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

    <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 ">
      <UForm :state="state" :schema="schema" @submit="handleUpdate" class="space-y-8">
        <div>
          <h3 class="text-lg font-semibold mb-4 border-b-2 border-b-gray-300 pb-2 dark:border-gray-700">Información General</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormGroup label="Nombre de la Mascota" name="name">
              <UInput 
                v-model="state.name" 
                placeholder="Ej. Firulais" 
                size="lg"
                icon="i-lucide-paw-print"
              />
            </UFormGroup>

            <UFormGroup label="Dueño Asignado" name="ownerId">
              <USelectMenu
                v-model="state.ownerId"
                :items="ownersOptions"
                value-key="value"
                placeholder="Buscar dueño..."
                size="lg"
                :loading="loadingOwners"
                icon="i-lucide-user"
                searchable
              />
            </UFormGroup>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4 border-b-2 border-b-gray-300 pb-2 dark:border-gray-700">Detalles Clínicos</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormGroup label="Especie" name="species">
              <USelect 
                v-model="state.species" 
                :items="['Perro', 'Gato', 'Ave', 'Roedor', 'Reptil', 'Otro']" 
                size="lg"
                icon="i-lucide-heart"
              />
            </UFormGroup>

            <UFormGroup label="Raza" name="breed">
              <UInput 
                v-model="state.breed" 
                placeholder="Ej. Mestizo / Labrador" 
                size="lg"
                icon="i-lucide-dna"
              />
            </UFormGroup>

            <UFormGroup label="Fecha de Nacimiento" name="birthDate" class="col-span-1">
              <UInput 
                v-model="state.birthDate" 
                type="date" 
                size="lg"
                icon="i-lucide-calendar"
              />
            </UFormGroup>
          </div>
        </div>

        

        <div class="flex justify-end items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <UButton 
            to="/pets"
            color="neutral" 
            variant="ghost" 
            size="lg"
            icon="i-lucide-x"
          >
            Cancelar
          </UButton>
          <UButton 
            type="submit" 
            color="primary" 
            size="lg"
            :loading="loading"
            icon="i-lucide-save"
          >
            Actualizar Paciente
          </UButton>
        </div>
      </UForm>
    </div>
  </div>
</template>