<script setup lang="ts">
import type { AppointmentPayload, Pet, Vet } from '~~/types'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useVets } from '~/composables/useVets';

const props = defineProps<{
  initialData?: Partial<AppointmentPayload>
  loading?: boolean
  submitLabel?: string
}>()

const emit = defineEmits<{
  submit: [data: AppointmentPayload]
  cancel: []
}>()

// ✅ Schema de validación con Zod
const schema = z.object({
  date: z.string().min(1, 'La fecha y hora son obligatorias'),
  petId: z.string().min(1, 'Debe seleccionar una mascota'),
  vetId: z.string().min(1, 'Debe seleccionar un veterinario'),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED']).default('SCHEDULED')
})

type Schema = z.output<typeof schema>

// ✅ Estado del formulario
const state = reactive<AppointmentPayload>({
  date: props.initialData?.date || '',
  petId: props.initialData?.petId || '',
  vetId: props.initialData?.vetId || '',
  status: 'SCHEDULED'
})

// ✅ Cargar mascotas y veterinarios
const { pets, pending: loadingPets } = usePets()
const { allVets, pending: loadingVets } = useVets()

const petsOptions = computed(() => {
  if (!pets.value) return []
  return pets.value.map((pet: Pet) => ({
    label: `${pet.name} (${pet.species}) - ${pet.owner.name}`,
    value: pet.id,
    species: pet.species,
    owner: pet.owner.name
  }))
})

const vetsOptions = computed(() => {
  if (!allVets.value) return []
  return allVets.value.map((vet: Vet) => ({
    label: vet.name,
    value: vet.id,
    speciality: vet.speacility
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

// Estado para los campos de fecha y hora separados
const dateOnly = ref('')
const timeOnly = ref('')

// Watch para combinar fecha y hora en formato ISO
watch([dateOnly, timeOnly], ([date, time]) => {
  if (date && time) {
    state.date = `${date}T${time}:00.000Z`
  }
})

// Si hay datos iniciales, separar fecha y hora
onMounted(() => {
  if (props.initialData?.date) {
    const isoDate = new Date(props.initialData.date)
    dateOnly.value = isoDate.toISOString().split('T')[0]
    timeOnly.value = isoDate.toTimeString().slice(0, 5)
  }
})
</script>

<template>
  <UForm :state="state" :schema="schema" @submit="handleSubmit" class="space-y-8">
    <div>
      <h3 class="text-lg font-semibold mb-4 border-b pb-2 dark:border-gray-700">
        Información de la Cita
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Mascota -->
        <UFormField label="Mascota" name="petId" >
          <USelectMenu
            v-model="state.petId"
            value-key="value"
            :items="petsOptions"
            placeholder="Buscar mascota..."
            size="lg"
            :loading="loadingPets"
            icon="i-lucide-dog"
            class="w-auto"
            searchable
            :disabled="state.petId !== ''"
            :content="{ align: 'start' }" 
            :ui="{ content: 'w-full' }"
          >
            
          </USelectMenu>
        </UFormField>

        <!-- Veterinario -->
        <UFormField label="Veterinario Asignado" name="vetId">
          <USelectMenu
            v-model="state.vetId"
            value-key="value"
            :items="vetsOptions"
            placeholder="Buscar veterinario..."
            size="lg"
            :loading="loadingVets"
            icon="i-lucide-stethoscope"
            searchable
            :disabled="state.vetId !== ''"
            :content="{ align: 'start' }" 
            :ui="{ content: 'w-full' }"
          >
            
          </USelectMenu>
        </UFormField>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-4 border-b pb-2 dark:border-gray-700">
        Fecha y Hora de la Cita
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Fecha -->
        <UFormField label="Fecha" name="date">
          <UInput 
            v-model="dateOnly" 
            type="date" 
            size="lg"
            icon="i-lucide-calendar"
          />
        </UFormField>

        <!-- Hora -->
        <UFormField label="Hora">
          <UInput 
            v-model="timeOnly" 
            type="time" 
            size="lg"
            icon="i-lucide-clock"
          />
        </UFormField>

        
      </div>
    </div>

    <!-- Preview de los datos (opcional) -->
    <div v-if="true" class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
      <h4 class="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Vista previa del JSON:</h4>
      <pre class="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">{{ JSON.stringify(state, null, 2) }}</pre>
    </div>

    <!-- Botones de acción -->
    <div class="flex justify-end items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
      <UButton 
        @click="handleCancel"
        color="neutral" 
        variant="ghost" 
        size="lg"
        icon="i-lucide-x"
        type="button"
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
        {{ submitLabel || 'Guardar' }}
      </UButton>
    </div>
  </UForm>
</template>