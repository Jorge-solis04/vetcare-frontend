<script setup lang="ts">
import type { PetPayload, Owner } from '~~/types'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const schema = z.object({
  name: z.string().min(3, 'El nombre es obligatorio'),
  species: z.string().min(1, 'La especie es obligatoria'),
  breed: z.string().min(1, 'La raza es obligatoria'),
  birthDate: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
  ownerId: z.string().min(1, 'El dueño es obligatorio')
})

type Schema = z.output<typeof schema>

const { createPet } = usePets()
const router = useRouter()
const toast = useToast()

const state = reactive<PetPayload>({
  name: '',
  species: 'Perro',
  breed: '',
  birthDate: '',
  ownerId: ''
})

const { allOwners, pending: loadingOwners } = useOwners()

const ownersOptions = computed(() => {
  if (!allOwners.value) return []

  return allOwners.value.map((owner: Owner) => ({
    label: owner.name,
    value: owner.id
  }))
})

const loading = ref(false)

// ✅ Cambiar el tipo del evento para usar validación Zod
const handleSave = async (event: FormSubmitEvent<Schema>) => {
  loading.value = true
  try {
    // event.data ya está validado por Zod
    await createPet(event.data)
    
    toast.add({
      title: 'Mascota creada',
      description: 'La mascota se ha registrado correctamente',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    
    router.push('/pets')
  } catch (error: any) {
    const errorMessage = error?.data?.message || 'Error al crear la mascota'
    
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
  <div class="p-6 max-w-6xl mx-auto">
    <div class="mb-6">
      <nav class="text-sm text-gray-500 mb-2 flex items-center gap-2">
        <NuxtLink to="/" class="hover:text-gray-700 dark:hover:text-gray-300 dark:text-white">Inicio</NuxtLink>
        <span>/</span>
        <NuxtLink to="/pets" class="hover:text-gray-700 dark:hover:text-gray-300 dark:text-white">Pacientes</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 font-medium dark:text-white">Añadir Paciente</span>
      </nav>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Añadir Nuevo Paciente</h1>
      <p class="text-gray-500 dark:text-gray-400">Complete la información para registrar una nueva mascota en el sistema.</p>
    </div>

    <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
      <UForm :state="state" :schema="schema" @submit="handleSave" class="space-y-8">
        <div>
          <h3 class="text-lg font-semibold mb-4 border-b-2 border-b-gray-300 pb-2 dark:border-gray-700">Información General</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField label="Nombre de la Mascota" name="name" >
              <UInput 
                v-model="state.name" 
                color="success"
                placeholder="Ej. Firulais" 
                size="lg"
                icon="i-lucide-paw-print"
              />
            </UFormField>

            <UFormField label="Dueño Asignado" name="ownerId" >
              <USelectMenu
                color="success"
                v-model="state.ownerId"
                :items="ownersOptions"
                value-key="value"
                placeholder="Buscar dueño..."
                size="lg"
                :loading="loadingOwners"
                icon="i-lucide-user"
                searchable
              />
            </UFormField>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4 border-b-2 border-b-gray-300 pb-2 dark:border-gray-700">Detalles Clínicos</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField color="success" label="Especie" name="species" >
              <USelect 
                color="success"
                
                v-model="state.species" 
                :items  ="['Perro', 'Gato', 'Ave', 'Roedor', 'Reptil', 'Otro']" 
                size="lg"
                icon="i-lucide-heart"
              />
            </UFormField>

            <UFormField label="Raza" name="breed" >
              <UInput 
                color="success"

                v-model="state.breed" 
                placeholder="Ej. Mestizo / Labrador" 
                size="lg"
                icon="i-lucide-dna"
              />
            </UFormField>

            <UFormField label="Fecha de Nacimiento" name="birthDate"  class="col-span-1">
              <UInput 
                color="success"

                v-model="state.birthDate" 
                type="date" 
                size="lg"
                icon="i-lucide-calendar"
              />
            </UFormField>
          </div>
        </div>

        

        <div class="flex justify-end items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
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
            color="success" 
            size="lg"
            :loading="loading"
            :disabled="!state.name || !state.species || !state.breed || !state.birthDate || !state.ownerId"
            icon="i-lucide-save"
          >
            Guardar Paciente
          </UButton>
        </div>
      </UForm>
    </div>
  </div>
</template>