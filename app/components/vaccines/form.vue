<script setup lang="ts">
import type { VaccinePayload, Pet } from '~~/types'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const props = defineProps<{
  initialData?: Partial<VaccinePayload>
  loading?: boolean
  submitLabel?: string
}>()

const emit = defineEmits<{
  submit: [data: VaccinePayload]
  cancel: []
}>()

const schema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  appliedDate: z.string().min(1, 'La fecha de aplicación es obligatoria'),
  nextDose: z.string().min(1, 'La fecha de próxima dosis es obligatoria'),
  petId: z.string().min(1, 'Debe seleccionar una mascota')
}).refine((data) => {
  const applied = new Date(data.appliedDate)
  const next = new Date(data.nextDose)
  return next >= applied
}, {
  message: 'La próxima dosis debe ser posterior o igual a la fecha de aplicación',
  path: ['nextDose']
})

type Schema = z.output<typeof schema>

const state = reactive<VaccinePayload>({
  name: props.initialData?.name || '',
  appliedDate: props.initialData?.appliedDate?.split('T')[0] || '',
  nextDose: props.initialData?.nextDose?.split('T')[0] || '',
  petId: props.initialData?.petId || ''
})

const { allPets, pending: loadingPets } = usePets()

const petsOptions = computed(() => {
  if (!allPets.value) return []
  return allPets.value.map((pet: Pet) => ({
    label: `${pet.name} (${pet.species})`,
    value: pet.id,
    species: pet.species,
    owner: pet.owner?.name
  }))
})

const vaccineTypes = [
  'Rabia',
  'Parvovirus',
  'Moquillo',
  'Rinotraqueítis',
  'Leucemia Felina',
  'Triple Felina',
  'Séxtuple Canina',
  'Bordetella',
  'Leptospirosis',
  'Otra'
]

const handleSubmit = (event: FormSubmitEvent<Schema>) => {
  emit('submit', event.data)
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <UForm :state="state" :schema="schema" @submit="handleSubmit" class="space-y-8">
    <div>
      <h3 class="text-lg font-semibold mb-4 border-b pb-2 dark:border-gray-700">
        Información de la Vacuna
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Nombre de la Vacuna -->
        <UFormGroup label="Tipo de Vacuna" name="name">
          <USelectMenu
            v-model="state.name" 
            :items="vaccineTypes" 
            size="lg"
            icon="i-lucide-syringe"
            placeholder="Selecciona el tipo de vacuna"
          />
        </UFormGroup>

        <!-- Mascota -->
        <UFormGroup label="Mascota" name="petId">
          <USelect
            v-model="state.petId"
            :items="petsOptions"
            :value-key="'value'"
            placeholder="Buscar mascota..."
            size="lg"
            :loading="loadingPets"
            icon="i-lucide-paw-print"
            searchable
          />
        </UFormGroup>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-4 border-b pb-2 dark:border-gray-700">
        Fechas de Aplicación
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Fecha de Aplicación -->
        <UFormGroup label="Fecha de Aplicación" name="appliedDate">
          <UInput 
            v-model="state.appliedDate" 
            type="date" 
            size="lg"
            icon="i-lucide-calendar-check"
          />
        </UFormGroup>

        <!-- Próxima Dosis -->
        <UFormGroup label="Próxima Dosis" name="nextDose">
          <UInput 
            v-model="state.nextDose" 
            type="date" 
            size="lg"
            icon="i-lucide-calendar-clock"
          />
        </UFormGroup>
      </div>
    </div>

    <!-- Preview de los datos -->
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