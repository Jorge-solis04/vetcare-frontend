<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const props = defineProps<{
  appointment: {
    id: string
    date: string
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
    vetId: string
    petId: string
    description?: string
  }
  pet: {
    name: string
  }
}>()

const emit = defineEmits<{
  (e: 'edit', id: string): void
  (e: 'cancel', id: string): void
}>()

const { allVets } = useVets()

const vetName = computed(() => {
  if (!allVets.value) return 'Cargando...'
  const vet = allVets.value.find((v: any) => v.id === props.appointment.vetId)
  return vet ? vet.name : 'Sin registrar'
})

const dateObj = computed(() => new Date(props.appointment.date))

const formattedDate = computed(() => {
  const formatted = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(dateObj.value)

  return formatted.replace(/\b\p{L}/gu, char => char.toUpperCase())
})

const formattedTime = computed(() =>
  new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(dateObj.value)
)

const description = computed(() => props.appointment.description?.trim() || 'Sin descripción disponible')

const items = computed<DropdownMenuItem[]>(() => [
  [{
    label: 'Editar cita',
    icon: 'i-lucide-pencil',
    disabled: props.appointment.status !== 'SCHEDULED',
    onSelect: () => emit('edit', props.appointment.id)
  }],
  [{
    label: 'Cancelar cita',
    icon: 'i-lucide-ban',
    color: 'error',
    disabled: props.appointment.status !== 'SCHEDULED',
    onSelect: () => emit('cancel', props.appointment.id)
  }]
])
</script>

<template>
  <article class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow p-5 space-y-4">
    <header class="space-y-3">
    
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ formattedDate }}</h3>

      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <UIcon name="i-lucide-clock" class="w-4 h-4 text-vetcare-500 "  />
          <span>{{ formattedTime }}</span>
        </div>

        <UBadge
          :color="appointment.status === 'SCHEDULED' ? 'primary' : appointment.status === 'COMPLETED' ? 'success' : 'error'"
          variant="soft"
          size="sm"
          :icon="appointment.status === 'SCHEDULED' ? 'i-lucide-calendar' : appointment.status === 'COMPLETED' ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
        >
          {{ appointment.status === 'SCHEDULED' ? 'Programada' : appointment.status === 'COMPLETED' ? 'Completada' : 'Cancelada' }}
        </UBadge>
      </div>
    </header>

    <p class="text-sm text-gray-600 dark:text-gray-300">{{ description }}</p>

    <div class="h-px bg-gray-200 dark:bg-gray-700"></div>

    <footer class="flex items-center justify-between">
      <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <UIcon name="i-lucide-stethoscope" class="w-4 h-4 text-success-500" />
        <span class="font-semibold text-gray-800 dark:text-white">Veterinario:</span>
        <span>{{ vetName }}</span>
      </div>

      
    </footer>
  </article>
</template>