<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const toast = useToast()
import { da } from 'zod/locales'
import type { TreatmentPayload, VaccinePayload } from '~~/types'

const petId = route.params.id as string

const { getPetById, deletePet } = usePets()
const { createTreatment, updateTreatment, deleteTreatment } = useTreatments()
const { createVaccine, updateVaccine, deleteVaccine } = useVaccines()

const loadingPet = ref(true)
const pet = ref<any>(null)

const showTreatmentModal = ref(false)
const loadingTreatment = ref(false)
const editingTreatment = ref<any>(null)

const showVaccineModal = ref(false)
const editingVaccine = ref<any>(null)



const loadPet = async () => {
  try {
    pet.value = await getPetById(petId)
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
}

onMounted(async () => {
  await loadPet()
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

const handleOpenTreatmentModal = (treatment?: any) => {
  editingTreatment.value = treatment || null
  showTreatmentModal.value = true
}

const handleCloseTreatmentModal = () => {
  showTreatmentModal.value = false
  editingTreatment.value = null
}

const handleSubmitTreatment = async (data: TreatmentPayload) => {
  loadingTreatment.value = true
  try {
    if (editingTreatment.value) {
      await updateTreatment(editingTreatment.value.id, data)
      toast.add({
        title: 'Tratamiento actualizado',
        description: 'Los cambios se han guardado correctamente',
        color: 'success',
        icon: 'i-lucide-check-circle'
      })
    } else {
      await createTreatment(data)
      toast.add({
        title: 'Tratamiento creado',
        description: 'El tratamiento se ha registrado correctamente',
        color: 'success',
        icon: 'i-lucide-check-circle'
      })
    }
    
    handleCloseTreatmentModal()
    await loadPet()
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error?.data?.message || 'Error al guardar el tratamiento',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    loadingTreatment.value = false
  }
}

const handleDeleteTreatment = async (id: string) => {
  try {
    await deleteTreatment(id)
    
    toast.add({
      title: 'Tratamiento eliminado',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
    
    await loadPet()
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error?.data?.message || 'Error al eliminar',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
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

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-auto ">
          <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <UIcon name="i-lucide-user" class="w-5 h-5 text-vetcare-500" />
            Información del Dueño
          </h2>
          
          <div class="space-y-3 flex flex-row justify-baseline gap-6">
            <div>
              <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Nombre</label>
              <p class="  text-gray-900 dark:text-white">{{ pet.owner.name }}</p>
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

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <UIcon name="i-lucide-shield-plus" class="w-5 h-5 text-vetcare-500" />
            Vacunas
          </h2>
          <UButton
            @click="showVaccineModal = true"
            color="success"
            size="sm"
            icon="i-lucide-plus"
            class="mb-4"
          />
          </div>
          <div v-if="!pet.vaccines || pet.vaccines.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            <UIcon name="i-lucide-syringe" class="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No hay vacunas registradas</p>
          </div>

          <div v-else class="grid grid-cols-1  gap-3">
            <div
              v-for="vaccine in pet.vaccines"
              :key="vaccine.id"
              class="p-4 bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 rounded-lg border border-success-200 dark:border-success-700"
            >
              <div class="flex items-center gap-2 mb-3">
                <div class="p-2 bg-success-500 rounded-full h-8 w-8 flex items-center justify-center">
                  <UIcon name="i-lucide-syringe" class="w-4 h-4 text-white" />
                </div>
                <h4 class="text-base font-bold text-gray-900 dark:text-white">{{ vaccine.name }}</h4>
                <UButton
                  @click="() => { editingVaccine = vaccine; showVaccineModal = true }"
                  color="primary"
                  variant="ghost"
                  icon="i-lucide-pencil"
                  size="xs"
                />
                <UButton
                  @click="async () => {
                    try {
                      await deleteVaccine(vaccine.id)
                      toast.add({
                        title: 'Vacuna eliminada',
                        color: 'success',
                        icon: 'i-lucide-check-circle'
                      })
                      await loadPet()
                    } catch (error:any) {
                      toast.add({
                        title: 'Error',
                        description: error?.data?.message || 'Error al eliminar la vacuna',
                        color: 'error',
                        icon: 'i-lucide-alert-circle'
                      })
                    }
                  }"
                  color="error"
                  variant="ghost"
                  icon="i-lucide-trash-2"
                  size="xs"/>
              </div>
              
              <div class="space-y-2 text-sm">
                <div class="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                  <UIcon name="i-lucide-calendar-check" class="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span class="font-medium">Aplicada:</span>
                  <span class="ml-auto font-semibold">{{ new Date(vaccine.appliedDate).toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  }) }}</span>
                </div>
                
                <div class="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                  <UIcon name="i-lucide-calendar-clock" class="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span class="font-medium">Próxima:</span>
                  <span class="ml-auto font-semibold">{{ new Date(vaccine.nextDose).toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  }) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        
        

      </div>

      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 max-h-[60vh] overflow-y-auto">
          <div class="space-y-3 text-sm">
            <div>
              <label class="text-lg font-semibold mb-10 text-gray-900 dark:text-white">Historial de Citas</label>
              <div v-if="!pet.appointments || pet.appointments.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
                <UIcon name="i-lucide-calendar-x" class="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No hay citas registradas</p>
              </div>
              <PetsAppointmentPetDetail
                v-for="appointment in pet.appointments"
                :key="appointment.id"
                :appointment="appointment"
                :pet="pet"
                class="mb-3 mt-3"
                @edit="(id) => navigateTo(`/appointments/${id}`)"
                @cancel="(id) => console.log('Lógica de cancelar', id)"
              />
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-shield-plus" class="w-5 h-5 text-vetcare-500" />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Tratamientos</h3>
            </div>
            <UButton
              @click="handleOpenTreatmentModal()"
              color="success"
              size="sm"
              icon="i-lucide-plus"
            >
              Agregar
            </UButton>
          </div>

          <div v-if="!pet.treatments || pet.treatments.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            <UIcon name="i-lucide-syringe" class="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No hay tratamientos registrados</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="treatment in pet.treatments"
              :key="treatment.id"
              class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ treatment.description }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <UIcon name="i-lucide-calendar" class="w-3 h-3 inline" />
                    {{ new Date(treatment.start).toLocaleDateString('es-ES') }} - 
                    {{ new Date(treatment.end).toLocaleDateString('es-ES') }}
                  </p>
                </div>
                <div class="flex gap-1">
                  <UButton
                    @click="handleOpenTreatmentModal(treatment)"
                    color="primary"
                    variant="ghost"
                    icon="i-lucide-pencil"
                    size="xs"
                  />
                  <UButton
                    @click="handleDeleteTreatment(treatment.id)"
                    color="error"
                    variant="ghost"
                    icon="i-lucide-trash-2"
                    size="xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>

    <TreatmentsForm
      v-if="pet"
      :pet-id="petId"
      :open-treatment-modal="showTreatmentModal"
      :initial-data="editingTreatment"
      @close="handleCloseTreatmentModal"
      @submit="handleSubmitTreatment"
    />

    <VaccinesFormModal
     v-if="pet"
     :petId="petId"
      :openVaccineModal="showVaccineModal"
      :initial-data="editingVaccine"
      @close="showVaccineModal = false"
      @submit="async (data: VaccinePayload) => {
        try {
          if (editingVaccine) {
            await updateVaccine(editingVaccine.id, data)
            toast.add({
              title: 'Vacuna actualizada',
              description: 'Los cambios se han guardado correctamente',
              color: 'success',
              icon: 'i-lucide-check-circle'
            })
          } else {
            await createVaccine(data)
            toast.add({
              title: 'Vacuna creada',
              description: 'La vacuna se ha registrado correctamente',
              color: 'success',
              icon: 'i-lucide-check-circle'
            })
          }
          
          showVaccineModal = false
          editingVaccine = null
          await loadPet()
        } catch (error:any) {
          toast.add({
            title: 'Error',
            description: error?.data?.message || 'Error al guardar la vacuna',
            color: 'error',
            icon: 'i-lucide-alert-circle'
          })
        }
      }"
    />

    <UModal :open="showDeleteModal">
        <template #header>
          <h3 class="text-lg font-semibold">Confirmar Eliminación</h3>
        </template>
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