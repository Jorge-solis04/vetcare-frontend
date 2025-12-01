<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn} from "@nuxt/ui"
import type { Row } from "@tanstack/vue-table";
import type { Vet } from '../../../types'

const { allVets, pending, searchQuery, deleteVet } = useVets()
const toast = useToast()

const handleDelete = async (id: number) => {
  if (!confirm(`¿Estás seguro de eliminar este veterinario?`)) return
  try {
    await deleteVet(id.toString()) // Asumiendo que tu composable espera string
    toast.add({ title: 'Veterinario eliminado', color: 'success' })
  } catch (e: any) {
    const errorMessage =
      e?.data?.message || e?.message || "No se puede eliminar el veterinario porque está vinculado a otros registros.";
    toast.add({ title: 'Error al eliminar', description: errorMessage, color: 'error' })
  }
}

// 3. Resolver componentes para las Render Functions
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

// 4. Definición del menú de acciones (Dropdown)
function getRowItems(row: Row<Vet>) {
  return [
    {
      type: "label",
      label: "Acciones",
    },
    {
      label: "Ver / Editar",
      icon: "i-lucide-edit",
      onSelect() {
        navigateTo(`/vets/${row.original.id}`)
      },
    },
    {
      label: "Eliminar",
      icon: "i-lucide-trash-2",
      color: "danger",
      onSelect() {
        handleDelete(row.original.id)
      },
    },
  ]
}

// 5. Definición de Columnas "Senior Style"
const columns: TableColumn<Vet>[] = [
  // Columna Nombre
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => h('span', { class: 'font-medium text-gray-900 dark:text-white' }, row.getValue("name")),
  },
  // Columna Contacto (Combinada: Email + Teléfono)
  {
        accessorKey: "specialty", // Usamos speacility como llave principal
        header: "Especialidad",
        cell: ({ row }) => h('span', { class: 'text-gray-700 dark:text-gray-300' }, row.getValue("specialty")),
  },
  
  {
        accessorKey: "isActive",
        header: "Activo",
        cell: ({ row }) => h('span', { class: 'text-gray-700 dark:text-gray-300' }, row.getValue("isActive") ? 'Sí' : 'No'),
  },


  // Columna Acciones
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-right" },
        h(
          UDropdownMenu,
          {
            content: { align: "end" },
            items: getRowItems(row),
          },
          () =>
            h(UButton, {
              icon: "i-lucide-ellipsis-vertical",
              color: "gray",
              variant: "ghost",
              class: "ml-auto",
            })
        )
      )
    },
  },
]
</script>

<template>
  <UiLayout
    title="Gestión de Veterinarios"
    description="Administra la información de los veterinarios de la clinica"
    buttonTitle="Nuevo Veterinario"
    path="/vets/create"
    icon="stethoscope"
  >
    <UInput 
      v-model="searchQuery" 
      placeholder="Buscar por nombre, especialidad o estado" 
      icon="i-lucide-search" 
      class="mb-6 w-full max-w-md"
      :ui="{ icon: { trailing: { pointer: '' } } }"
    >
      <template #trailing>
        <UButton
          v-show="searchQuery !== ''"
          color="gray"
          variant="link"
          icon="i-lucide-x"
          :padded="false"
          @click="searchQuery = ''"
        />
      </template>
    </UInput>

    <div v-if="pending" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <div v-else-if="error" class="text-center py-12 bg-red-50 dark:bg-red-900/10 rounded-lg">
      <UIcon name="i-lucide-alert-circle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-red-700 dark:text-red-400">Error al cargar datos</h3>
      <p class="text-red-600 dark:text-red-500 text-sm">Por favor, intenta recargar la página.</p>
    </div>

    <UTable 
      v-else 
      sticky
      :data="allVets || []" 
      :columns="columns" 
      class="flex-1 max-h-[600px]"
      :empty-state="{ 
        icon: 'i-lucide-users', 
        label: 'No hay veterinarios registrados',
        description: 'Comienza creando un nuevo registro.'
      }"
      :ui="{
        root: 'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden',
        base: 'min-w-full table-fixed',
        thead: 'bg-gray-50 dark:bg-gray-900/50',
        tbody: 'divide-y divide-gray-200 dark:divide-gray-700',
        tr: {
          base: 'hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150',
          selected: 'bg-gray-100 dark:bg-gray-700',
        },
        th: 'py-3.5 px-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100',
        td: 'py-4 px-4 text-sm text-gray-700 dark:text-gray-300',
      }"
    />
  </UiLayout>
</template>