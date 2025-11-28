<script setup lang="ts">
import type { Appointment, AppointmentPayload } from '~~/types'
import type { DropdownMenuItem } from '@nuxt/ui'

const props = defineProps<{ appointmentData: Appointment }>();


const appointment = computed(() => props.appointmentData)

const emit = defineEmits<{
  (e: 'cancel', id: string, data: AppointmentPayload): void
  (e: 'complete', id: string, data: AppointmentPayload): void
  (e: 'reactivate', id: string, data: AppointmentPayload): void
}>()


const items = computed<DropdownMenuItem[]>(() => [
  [{
    label: 'Reprogramar Cita',
    icon: 'i-lucide-edit-2',
    disabled: appointment.value.status === 'COMPLETED' || appointment.value.status === 'CANCELLED',
    onSelect() {
      navigateTo(`/appointments/${appointment.value.id}`);
    },
  }],
  [{
    disabled: appointment.value.status === 'CANCELLED' || appointment.value.status === 'COMPLETED',
    label: 'Completar Cita',
    icon: 'i-lucide-check-circle',
    color: 'success',
    onSelect: () => {
      emit('complete', appointment.value.id, appointment.value)
    }
  },
  {
    label: 'Cancelar Cita',
    icon: 'i-lucide-x-circle',
    color: 'error',
    disabled: appointment.value.status === 'CANCELLED' || appointment.value.status === 'COMPLETED',
    onSelect: () => {
      emit('cancel', appointment.value.id, appointment.value)
    }
  },
  {
    label: 'Reactivar Cita',
    icon: 'i-lucide-refresh-ccw',
    color: 'warning',
    disabled: appointment.value.status === 'SCHEDULED',
    onSelect: () => {
      emit('reactivate', appointment.value.id, appointment.value)
    }
  }
  ]
])

const hourToAppointment = (appt: Appointment) => {
  if (!appt?.date) return '--:--'
  return new Date(appt.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="flex items-start justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
    <div class="flex-1">
      <p class="text-lg font-medium text-vetcare-600 dark:text-vetcare-400">
        {{ hourToAppointment(appointment) }}
      </p>
      
      <!-- ✅ Validación segura con ?. -->
      <p class="text-base text-gray-600 dark:text-gray-300 mt-1 mb-1">
        <span class="font-medium">{{ appointment.pet?.name || 'Mascota desconocida' }}</span> 
      </p>
      
      <p class="text-sm text-gray-500 dark:text-gray-300 ">
        <span v-if="appointment.pet">({{ appointment.pet.species }} - {{ appointment.pet.breed }})</span>
        <span v-else>(Información no disponible)</span>
      </p>
      
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Dueño: {{ appointment.pet?.owner?.name || 'Sin dueño asignado' }}
      </p>
      
      <p class="text-sm text-vetcare-600 dark:text-vetcare-400">
        Vet: {{ appointment.vet?.name || 'Sin asignar' }}
      </p>
    </div>

    <div class="ml-4 flex flex-col items-end justify-between gap-2">
      <UDropdownMenu :items="items">
        <UButton 
          icon="i-lucide-ellipsis-vertical" 
          color="neutral" 
          variant="ghost" 
          size="md" 
        />
      </UDropdownMenu>
      
      <UBadge 
        class="mt-2"
        :color="appointment.status === 'SCHEDULED' ? 'primary' : appointment.status === 'COMPLETED' ? 'success' : appointment.status === 'CANCELLED' ? 'error' : 'neutral'" 
        variant="subtle"
        size="md"
      >
        {{ appointment.status === 'SCHEDULED' ? 'PROGRAMADA' : appointment.status === 'COMPLETED' ? 'COMPLETADA' : 'CANCELADA' }}
      </UBadge>
    </div>
  </div>
</template>
