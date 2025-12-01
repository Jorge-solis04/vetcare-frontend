<script setup lang="ts">
import type { OwnerPayload} from '../../../types'
import { email, z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const props = defineProps<{
  initialData?: Partial<OwnerPayload>
  loading?: boolean
  submitLabel?: string
}>()

const emit = defineEmits<{
  submit: [data: OwnerPayload]
  cancel: []
}>()

// ✅ Schema de validación con Zod
const schema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().min(5, 'El email es obligatorio').email('Debe ser un email válido'),
  phone: z.string().min(7, 'El teléfono es obligatorio'),
})

type Schema = z.output<typeof schema>

// ✅ Estado del formulario
const state = reactive<OwnerPayload>({
  name: props.initialData?.name || '',
  email: props.initialData?.email || '',
  phone: props.initialData?.phone || ''
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
        Nombre Completo
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Nombre -->
        <UFormGroup label="Nombre" name="name">
          <UInput 
            v-model="state.name" 
            placeholder="Ej. Juan Pérez" 
            size="lg"
            icon="i-lucide-user"
          />
        </UFormGroup>
      </div>
    </div>
    <div>
      <h3 class="text-lg font-semibold mb-4 border-b pb-2 dark:border-gray-700">
        Contacto
      </h3>
            <!-- Email -->
        <UFormGroup label="email" name="email">
          <UInput 
            v-model="state.email" 
            placeholder="Ej. juan@example.com" 
            size="lg"
            icon="i-lucide-mail"
          />
        </UFormGroup>
        <!-- Teléfono -->
        <UFormGroup label="Teléfono" name="phone">
          <UInput 
            v-model="state.phone" 
            placeholder="Ej. +52 123 456 7890" 
            size="lg"
            icon="i-lucide-phone"
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