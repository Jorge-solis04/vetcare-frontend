<script setup lang="ts">
import type { VaccinePayload, Pet } from '~~/types'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const props = defineProps<{
  petId: string
  openVaccineModal: boolean
  initialData?: Partial<VaccinePayload> & { id?: string }
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: VaccinePayload): void
}>()

const schema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  appliedDate: z.string().min(1, 'La fecha de aplicación es obligatoria'),
  nextDose: z.string().min(1, 'La fecha de próxima dosis es obligatoria'),
  petId: z.string()
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
  appliedDate: props.initialData?.appliedDate || '',
  nextDose: props.initialData?.nextDose || '',
  petId: props.petId
})

const appliedDateOnly = ref('')
const nextDoseDateOnly = ref('')

watch([appliedDateOnly], ([applied]) => {
  if (applied) {
    const localDate = new Date(`${applied}T00:00:00`)
    state.appliedDate = localDate.toISOString()
  }
})

watch([nextDoseDateOnly], ([next]) => {
  if (next) {
    const localDate = new Date(`${next}T00:00:00`)
    state.nextDose = localDate.toISOString()
  }
})

onMounted(() => {
  if (props.initialData?.appliedDate) {
    const appliedDate = new Date(props.initialData.appliedDate)
    const year = appliedDate.getFullYear()
    const month = String(appliedDate.getMonth() + 1).padStart(2, '0')
    const day = String(appliedDate.getDate()).padStart(2, '0')
    appliedDateOnly.value = `${year}-${month}-${day}`
  }

  if (props.initialData?.nextDose) {
    const nextDoseDate = new Date(props.initialData.nextDose)
    const year = nextDoseDate.getFullYear()
    const month = String(nextDoseDate.getMonth() + 1).padStart(2, '0')
    const day = String(nextDoseDate.getDate()).padStart(2, '0')
    nextDoseDateOnly.value = `${year}-${month}-${day}`
  }
})

const { allPets, pending: loadingPets } = usePets()

const petsOptions = computed(() => {
  if (!allPets.value) return []
  return allPets.value.map((pet: Pet) => ({
    label: `${pet.name} (${pet.species})`,
    value: pet.id
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
  console.log('Submitting vaccine form with data:', event.data)
  emit('submit', event.data)
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <UModal 
    :open="openVaccineModal" 
    :title="`${props.initialData ? 'Editar Vacuna' : 'Registrar Nueva Vacuna'}`" 
    :close="{
      variant: 'ghost',
      onClick: handleClose
    }"
  >
    <template #body>
      <UForm :schema="schema" :state="state" @submit="handleSubmit">
        <div class="space-y-6">
          <!-- Tipo de Vacuna y Mascota -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Tipo de Vacuna" name="name" required>
              <USelectMenu
                v-model="state.name" 
                :items="vaccineTypes" 
                size="lg"
                icon="i-lucide-syringe"
                placeholder="Selecciona el tipo de vacuna"
              />
            </UFormField>

            
          </div>

          <!-- Fechas -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Fecha de Aplicación" name="appliedDate" required>
              <UInput 
                v-model="appliedDateOnly" 
                type="date" 
                size="lg"
                icon="i-lucide-calendar-check"
              />
            </UFormField>

            <UFormField label="Próxima Dosis" name="nextDose" required>
              <UInput 
                v-model="nextDoseDateOnly" 
                type="date" 
                size="lg"
                icon="i-lucide-calendar-clock"
              />
            </UFormField>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-3 border-t border-gray-300 dark:border-gray-700 mt-6 pt-4">
          <UButton 
            @click="handleClose" 
            color="neutral" 
            variant="ghost" 
            size="lg"
          >
            Cancelar
          </UButton>
          <UButton 
            type="submit" 
            color="success" 
            size="lg" 
            icon="i-lucide-save"
          >
            {{ initialData ? 'Actualizar' : 'Guardar' }}
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>