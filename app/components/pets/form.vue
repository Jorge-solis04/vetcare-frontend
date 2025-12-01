<script setup lang="ts">
import type { PetPayload, Owner } from '~~/types'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const props = defineProps<{
  initialData?: Partial<PetPayload>
  loading?: boolean
  submitLabel?: string
}>()

const emit = defineEmits<{
  submit: [data: PetPayload]
  cancel: []
}>()

// ✅ Schema de validación con Zod
const schema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  species: z.string().min(1, 'La especie es obligatoria'),
  breed: z.string().min(2, 'La raza debe tener al menos 2 caracteres'),
  birthDate: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
  ownerId: z.string().min(1, 'Debe seleccionar un dueño')
})

type Schema = z.output<typeof schema>

// ✅ Estado del formulario
const state = reactive<PetPayload>({
  name: props.initialData?.name || '',
  species: props.initialData?.species || 'Perro',
  breed: props.initialData?.breed || '',
  birthDate: props.initialData?.birthDate?.split('T')[0] || '',
  ownerId: props.initialData?.ownerId || ''
})

// ✅ Cargar owners
const { allOwners, pending: loadingOwners } = useOwners()

const ownersOptions = computed(() => {
  if (!allOwners.value) return []
  return allOwners.value.map((owner: Owner) => ({
    label: owner.name,
    value: owner.id,
    email: owner.email
  }))
})

// ✅ Manejar submit con validación
const handleSubmit = (event: FormSubmitEvent<Schema>) => {
  emit('submit', event.data)
}

// ✅ Manejar cancelación
const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <UForm :state="state" :schema="schema" @submit="handleSubmit" class="space-y-8">
    <div>
      <h3 class="text-lg font-semibold mb-4 border-b pb-2 dark:border-gray-700">
        Información General
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Nombre -->
        <UFormGroup label="Nombre de la Mascota" name="name">
          <UInput 
            v-model="state.name" 
            placeholder="Ej. Firulais" 
            size="lg"
            icon="i-lucide-paw-print"
          />
        </UFormGroup>

        <!-- Dueño -->
        <UFormGroup label="Dueño Asignado" name="ownerId">
          <USelect
            v-model="state.ownerId"
            :items="ownersOptions"
            :value-key="'value'"
            placeholder="Buscar dueño..."
            size="lg"
            :loading="loadingOwners"
            icon="i-lucide-user"
            searchable
          >
            
          </USelect>
        </UFormGroup>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-4 border-b pb-2 dark:border-gray-700">
        Detalles Clínicos
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Especie -->
        <UFormGroup label="Especie" name="species">
          <USelectMenu
            v-model="state.species" 
            :items="['Perro', 'Gato', 'Ave', 'Roedor', 'Reptil', 'Otro']" 
            size="lg"
            icon="i-lucide-heart"
          />
        </UFormGroup>

        <!-- Raza -->
        <UFormGroup label="Raza" name="breed">
          <UInput 
            v-model="state.breed" 
            placeholder="Ej. Mestizo / Labrador" 
            size="lg"
            icon="i-lucide-dna"
          />
        </UFormGroup>

        <!-- Fecha de nacimiento -->
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

    <!-- Preview de los datos (opcional, solo en desarrollo) -->
    <div v-if="false" class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
      <h4 class="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Vista previa del JSON:</h4>
      <pre class="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">{{ JSON.stringify(state, null, 2) }}</pre>
    </div>

    <!-- Botones de acción -->
    <div class="flex justify-end items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
      <UButton 
        @click="handleCancel"
        color="neutral" 
        class="hover:cursor-pointer"
        variant="ghost" 
        size="lg"
        icon="i-lucide-x"
        type="button"
      >
        Cancelar
      </UButton>
      <UButton 
        type="submit" 
        class="hover:cursor-pointer"

        color="success" 
        size="lg"
        :loading="loading"
        icon="i-lucide-save"
      >
        {{ submitLabel || 'Guardar' }}
      </UButton>
    </div>
  </UForm>
</template>