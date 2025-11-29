<script setup lang="ts">
import { useApiFetch } from "~/composables/useApiFetch";
import { useAuthStore } from "~/store/auth";

const toast = useToast();

definePageMeta({
  layout: "login", 
});

const authStore = useAuthStore();
const loading = ref(false);
const errorMessages = ref('');  

const formData = ref({
  email: "jorgesolis@vetcare.com",
  password: "password123",
});

const handleLogin = async () => {
  loading.value = true
  errorMessages.value = ''

  try {
    // Llamamos a la acción del store que creamos arriba
    await authStore.login({
      formData: formData.value,
    })

    toast.add({
      title: 'Éxito',
      description: 'Has iniciado sesión correctamente.',
      color: 'success',
      icon: 'i-lucide-check-circle',
    })
    await navigateTo('/')
    
  } catch (error: any) {
    console.error(error)
    errorMessages.value = 'Error al iniciar sesión. Verifica tus datos.'
    toast.add({
      title: 'Error',
      description: errorMessages.value,
      color: 'error',
      icon: 'i-lucide-x-circle',
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UCard class="shadow-xl">
    <template #header>
      <div class="flex flex-col items-center gap-4 py-4">
        <UIcon name="i-lucide-paw-print" class="text-vetcare-500 w-12 h-12" />
        <div class="text-center">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">VetCare</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Sistema de Gestión Veterinaria</p>
        </div>
      </div>
    </template>

    <UForm :state="formData" @submit="handleLogin" class="space-y-4">
      
      <UFormGroup label="Correo Electrónico" name="email"  required>
        <UInput 
          v-model="formData.email" 
          type="email" 
          icon="i-lucide-mail"
          class="w-full mb-3"
          placeholder="correo@ejemplo.com"
          size="lg"
        />
      </UFormGroup>

      <UFormGroup label="Contraseña" name="password" required>
        <UInput 
          v-model="formData.password" 
          type="password" 
          icon="i-lucide-lock"
          placeholder="••••••••"
          size="lg"
          class="w-full"
        />
      </UFormGroup>

      <UButton 
        type="submit" 
        block 
        size="lg" 
        color="success"
        :loading="loading"
        class="mt-6"
      >
        Ingresar al Sistema
      </UButton>

    </UForm>

    <template #footer>
      <div class="text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          ¿Olvidaste tu contraseña? Contacta al administrador
        </p>
      </div>
    </template>
  </UCard>
</template>
