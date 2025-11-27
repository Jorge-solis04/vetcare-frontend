<script setup lang="ts">
import { id } from 'zod/locales';
import type { Appointment, AppointmentPayload } from '~~/types'
import type { DropdownMenuItem } from '@nuxt/ui'

const props = defineProps<{ appointmentData: Appointment }>();

const appointment = props.appointmentData

const emit = defineEmits<{
  (e: 'cancel', id: string, data: AppointmentPayload): void
  (e: 'complete', id: string, data: AppointmentPayload): void
  (e: 'reactivate', id: string, data: AppointmentPayload): void
}>()

const items = ref<DropdownMenuItem[]>([
  [{
    label: 'Reprogramar Cita',
    icon: 'i-lucide-edit-2',
    disabled: appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED',
    onSelect() {
      console.log('Reprogramar Cita clicked', appointment.id);
        navigateTo(`/appointments/${appointment.id}`);
      },
  }],
  [{
    disabled: appointment.status === 'CANCELLED' || appointment.status === 'COMPLETED',
    label: 'Completar Cita',
    icon: 'i-lucide-check-circle',
    color: 'success',
    onSelect: () => {
      emit('complete', appointment.id, appointment)
    }
  },
  {
    label: 'Cancelar Cita',
    icon: 'i-lucide-x-circle',
    color: 'error',
    disabled: appointment.status === 'CANCELLED' || appointment.status === 'COMPLETED',
    
   onSelect: () => {
      emit('cancel', appointment.id, appointment)
    }
  },
  {
    label: 'Reactivar Cita',
    icon: 'i-lucide-refresh-ccw',
    color: 'warning',
    disabled: appointment.status === 'SCHEDULED' ,
    
   onSelect: () => {
      emit('reactivate', appointment.id, appointment)
    }
  }
],
  
  
])

const hourToAppointment = (appointment: Appointment) => new Date(appointment.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
</script>

<template>
  <div class="flex items-start justify-between">
              <div class="flex-1">
                <p class="text-lg font-medium text-vetcare-600 dark:text-vetcare-400">
                  {{ hourToAppointment(appointment) }}
                </p>
                <p class="text-base text-gray-600 dark:text-gray-300 mt-1 mb-1">
                  <span class="font-medium">{{ appointment.pet.name }}</span> 
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-300 ">
                  <span >({{ appointment.pet.species }} - {{ appointment.pet.breed }})</span> 
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Dueño: {{ appointment.pet.owner.name }}
                </p>
                <p class="text-sm text-vetcare-600 dark:text-vetcare-400">
                  Vet: {{ appointment.vet.name }}
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
                    class="mt-13"
                    :color="appointment.status === 'SCHEDULED' ? 'primary' : appointment.status === 'COMPLETED' ? 'success' : appointment.status === 'CANCELLED' ? 'error' : 'neutral'" 
                    variant="subtle"
                    size="md"
                    >
                    {{ appointment.status === 'SCHEDULED' ? 'PROGRAMADA' : appointment.status === 'COMPLETED' ? 'COMPLETADA' : 'CANCELADA' }}
                </UBadge>
            </div>
            </div>
</template>
