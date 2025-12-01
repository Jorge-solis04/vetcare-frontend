<script setup lang="ts">
import type { DashboardStats } from '~~/types'

const { stats, pending, error, refresh } = useStats()
const { pets, pending: petsPending } = usePets()

// ✅ Computed para formatear los datos
const appointmentsToday = computed(() => stats.value?.appointmentsToday || [])
const appointmentsTodayCount = computed(() => stats.value?.appointmentsTodayCount || 0)

// Función para formatear la hora
const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
}

console.log('Stats:', appointmentsToday)

</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard</h1>
    
    <div class="flex flex-col gap-6">
      <!-- Stats Cards -->
      <article class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <section class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm rounded-lg p-6">
          <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Pacientes activos</h2>
          <p class="text-5xl font-bold mt-3 text-gray-900 dark:text-white">
            {{ pets?.length || 0 }}
          </p>
        </section>
        
        <section class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm rounded-lg p-6">
          <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Citas de hoy</h2>
          <p class="text-5xl font-bold mt-3 text-gray-900 dark:text-white">
            {{ appointmentsTodayCount }}
          </p>
        </section>

        <section class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm rounded-lg p-6">
          <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Vacunas por vencer</h2>
          <p class="text-5xl font-bold mt-3 text-gray-900 dark:text-white">
            {{ stats?.expiringVaccines?.length || 0 }}
          </p>
        </section>
      </article>

      <!-- Segunda fila: Citas de Hoy + Accesos Rápidos -->
      <article class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <!-- Citas de Hoy -->
        <section class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm rounded-lg p-6 md:col-span-2">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Citas de Hoy</h2>
          
          <!-- Loading state -->
          <div v-if="pending" class="flex justify-center py-8">
            <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary-500" />
          </div>

          <!-- Empty state -->
          <div v-else-if="appointmentsToday.length === 0" class="text-center py-8">
            <UIcon name="i-lucide-calendar-x" class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
            <p class="text-gray-500 dark:text-gray-400">No hay citas programadas para hoy</p>
          </div>

          <!-- Lista de citas -->
          <div v-else class="space-y-4">
            <div 
              v-for="appointment in appointmentsToday" 
              :key="appointment.id"
              class="flex items-start justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
            >
              <div class="flex gap-4 flex-1">
                <div class="text-center min-w-80px">
                  <p class="text-lg font-bold text-gray-900 dark:text-white">
                    {{ formatTime(appointment.date) }}
                  </p>
                </div>
                <div class="ml-6 flex-1">
                  <h3 class=" mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    {{ appointment.pet.name }} ({{ appointment.pet.species }} - {{ appointment.pet.breed }})
                  </h3>
                  <p class="text-base text-vetcare-600 dark:text-vetcare-400">
                    Dueño: {{ appointment.pet.owner.name || 'Sin nombre' }}
                  </p>
                  <p class="text-base text-gray-500 dark:text-gray-400 mt-1">
                    Veterinario asignado: {{ appointment.vet.name }}
                  </p>
                </div>
              </div>
              <div class="flex flex-col items-end gap-1">
                <UBadge 
                  :color="appointment.status === 'SCHEDULED' ? 'success' : 'neutral'" 
                  variant="subtle"
                  size="lg"
                >
                  {{ appointment.status ? 'Programada' : 'Completada' }}
                </UBadge>
                
              </div>
            </div>
          </div>
        </section>

        <!-- Accesos Rápidos -->
        <section class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm rounded-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Accesos Rápidos</h2>
          
          <div class="space-y-3">
            <UButton 
              to="/appointments/create"
              block
              size="lg"
              color="success"
              icon="i-lucide-plus"
              class="justify-center"
            >
              Nueva Cita
            </UButton>

            <UButton 
              to="/pets/create"
              block
              size="lg"
              variant="soft"
              color="success"
              icon="i-lucide-paw-print"
              class="justify-center"
            >
              Registrar Paciente
            </UButton>

            <UButton 
              to="/owners/create"
              block
              size="lg"
              variant="soft"
              color="success"
              icon="i-lucide-user-plus"
              class="justify-center"
            >
              Nuevo Dueño
            </UButton>
          </div>
        </section>
      </article>
    </div>
  </div>
</template>
