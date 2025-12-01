<script setup lang="ts">
import type { RegisterPayload } from '~/composables/useAuth'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const props = defineProps<{
  open: boolean
  
}>()

const emit = defineEmits<{
  close: []
  submit: [data: RegisterPayload]
}>()

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  role: z.enum(['ADMIN', 'VET', 'RECEPTIONIST'], {
    errorMap: () => ({ message: 'Selecciona un rol válido' })
  })
})

type Schema = z.output<typeof schema>

const state = reactive<RegisterPayload>({
  email: '',
  password: '',
  name: '',
  role: 'VET'
})

const roleOptions = [
  {
    label: 'Veterinario',
    value: 'VET',
    icon: 'i-lucide-stethoscope',
    description: 'Acceso a gestión de pacientes y citas'
  },
  {
    label: 'Administrador',
    value: 'ADMIN',
    icon: 'i-lucide-shield-check',
    description: 'Acceso completo al sistema'
  },
  {
    label: 'Recepcionista',
    value: 'RECEPTIONIST',
    icon: 'i-lucide-user-check',
    description: 'Gestión de citas y dueños'
  }
]

const showPassword = ref(false)

const handleSubmit = (event: FormSubmitEvent<Schema>) => {
  emit('submit', event.data)
}

const handleClose = () => {
  // Reset form
  state.email = ''
  state.password = ''
  state.name = ''
  state.role = 'VET'
  showPassword.value = false
  
  emit('close')
}
</script>

<template>
  <UModal 
    :open="open" 
    title="Registrar Nuevo Usuario (Solo pueden administradores)"
    :close="{
      variant: 'ghost',
      onClick: handleClose
    }"
    size="lg"
  >
    <template #body>
      <UForm :schema="schema" :state="state" @submit="handleSubmit" class="space-y-6">
        <!-- Información del Usuario -->
        <div>
          <h4 class="text-base font-semibold mb-4 pb-2 border-b dark:border-gray-700 text-gray-900 dark:text-white">
            Información del Usuario
          </h4>
          
          <div class="space-y-4">
            <!-- Nombre Completo -->
            <UFormField label="Nombre Completo" name="name" required>
              <UInput
                v-model="state.name"
                type="text"
                placeholder="Ej: Dr. Juan Pérez"
                size="lg"
                icon="i-lucide-user"
              />
            </UFormField>

            <!-- Email -->
            <UFormField label="Correo Electrónico" name="email" required>
              <UInput
                v-model="state.email"
                type="email"
                placeholder="ejemplo@vetclinic.com"
                size="lg"
                icon="i-lucide-mail"
              />
            </UFormField>

            <!-- Contraseña -->
            <UFormField label="Contraseña" name="password" required>
              <UInput
                v-model="state.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Mínimo 6 caracteres"
                size="lg"
                icon="i-lucide-lock"
              >
                <template #trailing>
                  <UButton
                    @click="showPassword = !showPassword"
                    :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    type="button"
                  />
                </template>
              </UInput>
            </UFormField>
          </div>
        </div>

        <!-- Rol del Usuario -->
        <div>
          <h4 class="text-base font-semibold mb-4 pb-2 border-b dark:border-gray-700 text-gray-900 dark:text-white">
            Rol y Permisos
          </h4>
          
          <UFormField label="Rol del Usuario" name="role" required class="w-full">
            <USelectMenu
              class="w-full"
              v-model="state.role"
              :items="roleOptions"
              value-key="value"
              size="lg"
            >
             
            </USelectMenu>
          </UFormField>

          <!-- Info sobre el rol seleccionado -->
          <UAlert
            v-if="state.role"
            :icon="roleOptions.find(r => r.value === state.role)?.icon"
            :title="roleOptions.find(r => r.value === state.role)?.label"
            :description="roleOptions.find(r => r.value === state.role)?.description"
            color="primary"
            variant="soft"
            class="mt-3"
          />
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-3 border-t border-gray-300 dark:border-gray-700 pt-4">
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
            icon="i-lucide-user-plus"
          >
            Registrar Usuario
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>