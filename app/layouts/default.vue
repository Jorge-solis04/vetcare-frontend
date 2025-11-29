<template>
  <div class="flex h-screen bg-white dark:bg-gray-900">
    <aside 
      class="border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 ease-out"
      :class="expanded ? 'w-64' : 'w-16'"
      @mouseenter="expanded = true"
      @mouseleave="expanded = false"
    >
      <div class="p-6 flex items-center gap-2 h-20 overflow-hidden">
        <UIcon name="i-lucide-paw-print" class="text-vetcare-500 w-8 h-8 flex-shrink-0" />
        <span 
          class="text-xl font-bold text-blue-900 dark:text-white whitespace-nowrap transition-opacity duration-300"
          :class="expanded ? 'opacity-100' : 'opacity-0'"
        >
          VetCare
        </span>
      </div>

      <div class="flex-1 px-2 py-2 overflow-hidden">
        <nav class="space-y-1">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            active-class="bg-vetcare-50 text-vetcare-700 dark:bg-vetcare-900/20 dark:text-vetcare-400"
          >
            <UIcon :name="link.icon" class="w-5 h-5 flex-shrink-0" />
            <span 
              class="whitespace-nowrap transition-opacity duration-300"
              :class="expanded ? 'opacity-100' : 'opacity-0 w-0'"
            >
              {{ link.label }}
            </span>
          </NuxtLink>
        </nav>
      </div>

      <div class="p-4 border-t border-gray-200 dark:border-gray-800">
        <p 
          class="text-xs text-gray-500 text-center transition-opacity duration-300"
          :class="expanded ? 'opacity-100' : 'opacity-0'"
        >
          v1.0.0 - VetCare System
        </p>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <header class="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
        <h1 class="text-lg font-medium text-gray-700 dark:text-gray-200">
          Bienvenido
        </h1>

        <div class="flex items-center gap-4">
          <UButton
            :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
            color="neutral"
            variant="ghost"
            aria-label="Theme"
            @click="toggleDark"
          />

          <UDropdownMenu :items="userItems" :popper="{ placement: 'bottom-end' }">
            <UButton color="neutral" variant="ghost" trailing-icon="i-lucide-chevron-down">
              <UAvatar size="xs">
                <UIcon name="i-lucide-user" class="w-4 h-4" />
              </UAvatar>
              <span class="ml-2 text-sm hidden sm:block">
                {{ authStore.user?.name?.split('@')[0] || 'Usuario' }}
              </span>
            </UButton>
          </UDropdownMenu>
        </div>
      </header>

      <main class="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-950">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()
const colorMode = useColorMode()
const expanded = ref(false)

const toggleDark = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const links = [
  { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/' }, 
  { label: 'Agenda', icon: 'i-lucide-calendar', to: '/appointments/' },
  { label: 'Dueños', icon: 'i-lucide-users', to: '/owners/' },
  { label: 'Pacientes', icon: 'i-lucide-cat', to: '/pets/' },
  {label: 'Vacunas', icon:"i-lucide-syringe", to: '/vaccines/' }
]

const logout = async () => {
  console.log('Cerrando sesión...')
  authStore.logout()

  await navigateTo('/login')
}

const userItems = [
  [{
    label: 'Mi Perfil',
    icon: 'i-lucide-user',
    onSelect: () => {
      navigateTo('/auth/')
    }
  }],
  [{
    label: 'Cerrar Sesión',
    icon: 'i-lucide-log-out',
    onSelect: () => logout()
    
  }]
]
</script>