<script setup lang="ts">
import type { OwnerPayload } from '../../../types'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const ownerId = route.params.id as string

const { updateOwner, getOwnerById } = useOwners()

const loading = ref(false)
const loadingOwner = ref(true)
const ownerData = ref<OwnerPayload>()

// ✅ Cargar datos de la mascota
onMounted(async () => {
  try {
    const owner = await getOwnerById(ownerId)
    console.log('owner', owner)
    if (owner) {
      ownerData.value = {
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
      }
    }
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'No se pudo cargar el dueño/a',
      icon: 'i-lucide-alert-circle'
    })
    router.push('/owners')
  } finally {
    loadingOwner.value = false
  }
})

const handleUpdate = async (data: OwnerPayload) => {
  loading.value = true
  try {
    await updateOwner(ownerId, data)
    
    toast.add({
      title: 'Dueño/a actualizado/a',
      description: 'Los cambios se han guardado correctamente',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    
    router.push('/owners')
  } catch (error: any) {
    const errorMessage = error?.data?.message || 'Error al actualizar el dueño/a'
    
    toast.add({
      title: 'Error',
      description: errorMessage,
      color: 'error',
      icon: 'i-lucide-alert-circle',
      duration: 5000
    })
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push('/owners')
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="mb-6">
      <nav class="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
        <NuxtLink to="/" class="hover:text-gray-700 dark:hover:text-gray-300">Inicio</NuxtLink>
        <span>/</span>
        <NuxtLink to="/owners" class="hover:text-gray-700 dark:hover:text-gray-300">Dueños</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 dark:text-white font-medium">Editar Dueño</span>
      </nav>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Editar Dueño</h1>
      <p class="text-gray-500 dark:text-gray-400">Actualice la información del dueño.</p>
    </div>

    <div v-if="loadingOwner" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
      <OwnersOwnerForm 
        :initial-data="ownerData"
        :loading="loading"
        submit-label="Actualizar Dueño/a"
        @submit="handleUpdate"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>