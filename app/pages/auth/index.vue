<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()

const { profile, pending, error, formatDate, formatTime, getInitials } = useProfile()
console.log(profile)    
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Mi Perfil</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">
        Gestiona la información de tu cuenta y tus datos personales.
      </p>
    </div>


    <div v-if="error" class="text-center py-12">
      <UIcon name="i-lucide-alert-circle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
      <p class="text-red-600 dark:text-red-400">Error al cargar el perfil</p>
    </div>

    <div v-else-if="profile" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Card del Usuario -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex flex-col items-center">
            <!-- Avatar -->
            <div class="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mb-4 shadow-lg">
              <span class="text-4xl font-bold text-white">
                <UIcon name="i-lucide-paw-print"/>
              </span>
            </div>

            
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white text-center">
              {{  authStore.user?.name?.split('@')[0] || 'Usuario' }}
            </h2>

           

            
          </div>
        </div>
      </div>

      <!-- Información Detallada -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Información de Contacto -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
            <UIcon name="i-lucide-mail" class="w-5 h-5 text-primary-500" />
            Información de Contacto
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

             <div>
              <label class="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
                Nombre de Usuario
              </label>
              <div class="flex items-center gap-2 text-gray-900 dark:text-white">
                <UIcon name="i-lucide-user" class="w-4 h-4 text-gray-400" />
                <span class="text-base">{{  authStore.user?.name?.split('@')[0] || 'Usuario'  }}</span>
              </div>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
                Correo Electrónico
              </label>
              <div class="flex items-center gap-2 text-gray-900 dark:text-white">
                <UIcon name="i-lucide-at-sign" class="w-4 h-4 text-gray-400" />
                <span class="text-base">{{ profile?.user.email }}</span>
              </div>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">
                ID de Usuario
              </label>
              <div class="flex items-center gap-2 text-gray-900 dark:text-white">
                <UIcon name="i-lucide-fingerprint" class="w-4 h-4 text-gray-400" />
                <span class="text-base font-mono text-xs">{{ profile?.user.id }}</span>
              </div>
            </div>
          </div>
        </div>

        

        <!-- Estadísticas Rápidas -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-blue-600 dark:text-blue-400">Rol Activo</p>
                <p class="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                  {{ profile?.user.role === 'ADMIN' ? 'Administrador' : profile?.user.role === 'VET' ? 'Veterinario' : profile?.user.role === 'RECEPTIONIST' ? 'Recepcionista' : 'Usuario' }}
                </p>
              </div>
              <div class="p-3 bg-blue-500 rounded-full">
                <UIcon name="i-lucide-shield-check" class="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-700">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-green-600 dark:text-green-400">Estado</p>
                <p class="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">Activo</p>
              </div>
              <div class="p-3 bg-green-500 rounded-full">
                <UIcon name="i-lucide-check-circle" class="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

         
        </div>
      </div>
    </div>
  </div>
</template>