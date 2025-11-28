<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const toast = useToast()
import type { Appointment } from '~~/types'
const petId = route.params.id as string

const { getPetById, deletePet } = usePets()

const loadingPet = ref(true)
const pet = ref<any>(null)

onMounted(async () => {
  try {
    pet.value = await getPetById(petId)
    console.log(pet.value)
    console.log('Pet details:', pet.value)
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'No se pudo cargar la mascota',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
    router.push('/pets')
  } finally {
    loadingPet.value = false
  }
})

const age = computed(() => {
  if (!pet.value?.birthDate) return 'N/A'
  const birth = new Date(pet.value.birthDate)
  const today = new Date()
  const years = today.getFullYear() - birth.getFullYear()
  const months = today.getMonth() - birth.getMonth()
  
  if (years === 0) return `${months} meses`
  if (months < 0) return `${years - 1} años y ${12 + months} meses`
  return `${years} años y ${months} meses`
})

const formattedBirthDate = computed(() => {
  if (!pet.value?.birthDate) return 'N/A'
  return new Date(pet.value.birthDate).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const deleting = ref(false)
const showDeleteModal = ref(false)

const handleDelete = async () => {
  deleting.value = true
  try {
    await deletePet(petId)
    
    toast.add({
      title: 'Mascota eliminada',
      description: 'La mascota ha sido eliminada correctamente',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    
    router.push('/pets')
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error?.data?.message || 'Error al eliminar la mascota',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    deleting.value = false
    showDeleteModal.value = false
  }
}


</script>

<template>
  <div class="p-6 max-w-6xl mx-auto">
    <div class="mb-6">
      <nav class="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
        <NuxtLink to="/" class="hover:text-gray-700 dark:hover:text-gray-300">Inicio</NuxtLink>
        <span>/</span>
        <NuxtLink to="/pets" class="hover:text-gray-700 dark:hover:text-gray-300">Pacientes</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 dark:text-white font-medium">{{ pet?.name || 'Detalles' }}</span>
      </nav>
      
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Detalles del Paciente</h1>
          <p class="text-gray-500 dark:text-gray-400">Información completa de la mascota</p>
        </div>
        
        <div v-if="!loadingPet" class="flex gap-3">
          <UButton
            :to="`/pets/${petId}/edit`"
            color="success"
            icon="i-lucide-pencil"
          >
            Editar
          </UButton>
          <UButton
            @click="showDeleteModal = true"
            color="error"
            variant="soft"
            icon="i-lucide-trash"
          >
            Eliminar
          </UButton>
        </div>
      </div>
    </div>

    <div v-if="loadingPet" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    
    <div v-else class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      
      <div class="lg:col-span-3 space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <UIcon name="i-lucide-info" class="w-5 h-5 text-vetcare-500" />
            Información Básica
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Nombre</label>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ pet.name }}</p>
            </div>
            
            <div>
              <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Especie</label>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ pet.species }}</p>
            </div>
            
            <div>
              <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Raza</label>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ pet.breed }}</p>
            </div>
            
            <div>
              <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Edad</label>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ age }}</p>
            </div>
            
            <div>
              <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de Nacimiento</label>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ formattedBirthDate }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <UIcon name="i-lucide-user" class="w-5 h-5 text-vetcare-500" />
            Información del Dueño
          </h2>
          
          <div class="space-y-3">
            <div>
              <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Nombre</label>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ pet.owner.name }}</p>
            </div>
            
            <div v-if="pet.owner.email">
              <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
              <p class="text-gray-900 dark:text-white">{{ pet.owner.email }}</p>
            </div>
            
            <div v-if="pet.owner.phone">
              <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Teléfono</label>
              <p class="text-gray-900 dark:text-white">{{ pet.owner.phone }}</p>
            </div>
            
            <div v-if="pet.owner.address">
              <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Dirección</label>
              <p class="text-gray-900 dark:text-white">{{ pet.owner.address }}</p>
            </div>
          </div>
        </div>
      </div>

      
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        
          <div  class="space-y-3 text-sm">
            <div>
              <label class="text-lg font-semibold mb-10 text-gray-900 dark:text-white">Historial de Citas</label>
               <div v-if="pet.appointments.length === 0">
            <p class="text-gray-600 dark:text-gray-400">No hay citas registradas.</p>
          </div>
              <PetsAppointmentPetDetail
                v-for="appointment in pet.appointments"
                :key="appointment.id"
                :appointment="appointment"
                :pet="pet"
                class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transform-gpu transition-transform duration-300 ease-in-out hover:scale-102 hover:shadow-lg hover:z-10 mb-3 mt-3 cursor-pointer"
                @edit="(id) => navigateTo(`/appointments/${id}`)"
                @cancel="(id) => console.log('Lógica de cancelar', id)"
             
                />
            </div>
         </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Tratamientos</h3>
          
            <div v-if="pet.treatments.length === 0">
                <p class="text-gray-600 dark:text-gray-400">No hay tratamientos registrados.</p>
            </div>

          <div v-else class="space-y-3 text-sm">
            <div>
              <label class="text-gray-500 dark:text-gray-400"></label>
              <p class="text-gray-900 dark:text-white font-mono text-xs">{{ pet.id }}</p>
            </div>
            
            <div>
              <label class="text-gray-500 dark:text-gray-400">Creado</label>
              <p class="text-gray-900 dark:text-white">
                {{ new Date(pet.createdAt).toLocaleDateString('es-ES') }}
              </p>
            </div>
            
            <div>
              <label class="text-gray-500 dark:text-gray-400">Última actualización</label>
              <p class="text-gray-900 dark:text-white">
                {{ new Date(pet.updatedAt).toLocaleDateString('es-ES') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

   
    <UModal v-model:open="showDeleteModal" title="Confirmar Eliminación" class="w-400">
       

        <template #body>
        <p class="text-gray-600 dark:text-gray-400">
          ¿Estás seguro de que deseas eliminar a <strong>{{ pet?.name }}</strong>? 
          Esta acción no se puede deshacer.
        </p>

        <UAlert
        title="Advertencia"
        description="Asegurate de no tener citas o vacunas asociadas a la mascota. De ser el caso, elimina primero esas asociaciones antes de eliminar la mascota."
        icon="i-lucide-message-circle-warning"
          color="warning"
          class="mt-4"
          variant="soft"
          />
        </template>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton
              @click="showDeleteModal = false"
              color="neutral"
              variant="ghost"
            >
              Cancelar
            </UButton>
            <UButton
              @click="handleDelete"
              color="error"
              :loading="deleting"
            >
              Eliminar
            </UButton>
          </div>
        </template>
    </UModal>
  </div>
</template>