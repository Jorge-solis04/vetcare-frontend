<script setup lang="ts">
import type { VetPayload} from '../../../types'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { computed, reactive } from 'vue'

const props = defineProps<{
  initialData?: Partial<VetPayload>
  loading?: boolean
  submitLabel?: string
}>()

const emit = defineEmits<{
  submit: [data: VetPayload]
  cancel: []
}>()

const schema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  specialty: z.string().min(3, 'La especialidad debe tener al menos 3 caracteres'),
  isActive: z.boolean()
})

type Schema = z.output<typeof schema>

// Estado del formulario
const state = reactive<VetPayload>({
  name: props.initialData?.name || '',
  specialty: props.initialData?.specialty || '',
  isActive: props.initialData?.isActive ?? true
})

// Computed para convertir entre boolean y Si/No
const activeOption = computed({
  get: () => state.isActive ? 'Si' : 'No',
  set: (val: string) => {
    state.isActive = val === 'Si'
  }
})

// Manejar submit con validación
const handleSubmit = (event: FormSubmitEvent<Schema>) => {
  emit('submit', event.data)
}

// Manejar cancelación
const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <UForm :state="state" :schema="schema" @submit="handleSubmit" class="space-y-8">
    <div>
      <h3 class="text-lg font-semibold mb-4 border-b pb-2 dark:border-gray-700">
        Nombre Completo
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Nombre -->
        <UFormGroup label="Nombre" name="name">
          <UInput 
            v-model="state.name" 
            placeholder="Ej. Dr. Francisco García" 
            size="lg"
            icon="i-lucide-user"
          />
        </UFormGroup>
      </div>
    </div>
    <div>
      <h3 class="text-lg font-semibold mb-4 border-b pb-2 dark:border-gray-700">
        Especialidad
      </h3>
            <!-- Email -->
        <UFormGroup label="Especialidad" name="specialty">
          <UInput 
            v-model="state.specialty" 
            placeholder="Ej. Cardiología" 
            size="lg"
            icon="i-lucide-stethoscope"
          />
        </UFormGroup>
        

    </div>
    <div>
      <h3 class="text-lg font-semibold mb-4 border-b pb-2 dark:border-gray-700">
        Activo
      </h3>
          <UFormGroup label="Activo" name="isActive">
          <USelectMenu
            v-model="activeOption"
            :items="['Si', 'No']"
            size="lg"
            icon="i-lucide-check-circle"
          />
        </UFormGroup>
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