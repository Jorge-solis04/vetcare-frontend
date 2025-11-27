<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { Pet } from "~~/types";
import type { Row } from "@tanstack/vue-table";
const toast = useToast();
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const columns: TableColumn<Pet>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => row.getValue("name"),
  },
  {
    accessorKey: "species",
    header: "Especie",
    cell: ({ row }) => {
      const color =
        {
          Perro: "secondary" as const,
          Roedor: "warning" as const,
          Gato: "info" as const,
          Ave: "primary" as const,
          Reptil: "success" as const,
          Otro: "gray" as const,
        }[row.getValue("species") as string] || ("gray" as const);

      return h(UBadge, { class: "capitalize", variant: "subtle", color }, () =>
        row.getValue("species")
      );
    },
  },
  {
    accessorKey: "breed",
    header: "Raza",
    cell: ({ row }) => row.getValue("breed"),
  },
  {
    accessorKey: "birthDate",
    header: "Fecha de Nacimiento",
    cell: ({ row }) => {
      const date = new Date(row.getValue("birthDate") as string);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
  },
  {
    accessorKey: "owner",
    header: "Dueño",
    cell: ({ row }) => {
      const owner = row.original.owner; // ✅ Acceder al objeto owner completo
      return owner?.name || "Sin dueño";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-right" },
        h(
          UDropdownMenu,
          {
            content: {
              align: "end",
            },
            items: getRowItems(row),
            "aria-label": "Actions dropdown",
          },
          () =>
            h(UButton, {
              icon: "i-lucide-ellipsis-vertical",
              color: "neutral",
              variant: "ghost",
              class: "ml-auto",
              "aria-label": "Actions dropdown",
            })
        )
      );
    },
  },
];
function getRowItems(row: Row<Pet>) {
  return [
    {
      type: "label",
      label: "Acciones",
    },
    {
      label: "Editar mascota",
      onSelect() {
        navigateTo(`/pets/${row.original.id}`);
      },
    },
    {
      label: "Eliminar mascota",
      color: "danger",
      onSelect() {
        handleDelete(row.original.id);
      },
    },
  ];
}
const { pets, pending, error, searchQuery, deletePet } = usePets();

const handleDelete = async (id: string) => {
  if (!confirm("¿Estás seguro de eliminar esta mascota?")) {
    return;
  }

  try {
    await deletePet(id);

    toast.add({
      title: "Mascota eliminada",
      description: "La mascota se ha eliminado correctamente",
      color: "success",
      icon: "i-lucide-check-circle",
    });
  } catch (error: any) {
    console.error("Error al eliminar:", error);

    // Extraer el mensaje del backend
    const errorMessage =
      error?.data?.message || error?.message || "Error al eliminar la mascota";

    toast.add({
      title: "Error al eliminar",
      description: errorMessage,
      color: "error",
      icon: "i-lucide-alert-circle",
      duration: 5000,
    });
  }
};
</script>

<template>
  <UiLayout
    title="Gestión de Pacientes"
    buttonTitle="Nuevo Paciente"
    path="/pets/create"
    description="Visualiza, registra y gestiona todos los pacientes."
    icon="dog"
  >
    <UInput
      v-model="searchQuery"
      placeholder="Buscar por nombre, especie o raza..."
      icon="i-lucide-search"
      class="mb-6 w-full max-w-md"
    />

    <div v-if="pending" class="flex justify-center py-12">
      <UIcon
        name="i-lucide-loader-2"
        class="w-8 h-8 animate-spin text-primary-500"
      />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <UIcon
        name="i-lucide-alert-circle"
        class="w-12 h-12 text-red-500 mx-auto mb-4"
      />
      <p class="text-red-600">Error al cargar las mascotas</p>
    </div>

    <UTable
      v-else
      sticky
      :data="pets || []"
      :columns="columns"
      class="flex-1 max-h-[500px]"
      :empty-state="{
        icon: 'i-lucide-inbox',
        label: 'No hay mascotas registradas',
      }"
      :ui="{
        root: 'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700',
        base: 'bg-white dark:bg-gray-800',
        thead: 'bg-gray-50 dark:bg-gray-900/50 text',
        tbody: 'bg-white dark:bg-gray-800',
        tr: {
          base: 'hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors',
          selected: 'bg-gray-100 dark:bg-gray-700',
        },
        th: 'text-gray-900 dark:text-gray-100 font-semibold text-base',
        td: 'text-gray-700 dark:text-gray-300 text-base',
      }"
    >
    </UTable>
  </UiLayout>
</template>
