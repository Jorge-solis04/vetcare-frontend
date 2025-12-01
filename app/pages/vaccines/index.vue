<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { h, resolveComponent } from "vue";
import type { Row } from "@tanstack/vue-table";
const toast = useToast();
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");
import type { Vaccine, VaccinePayload } from "~~/types";

const { vaccines, allVaccines, pending, error, searchQuery, deleteVaccine } = useVaccines();

const formatLocalDate = (dateString: string) => {
  const date = new Date(dateString);
  // Ajustar por la diferencia de zona horaria
  const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return localDate.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const columns: TableColumn<Vaccine>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      const color =
        {
          Moquillo: "secondary" as const,
          Parvovirus: "warning" as const,
          Rabia: "error" as const,
          Rinotraqueítis: "primary" as const,
          LeucemiaFelina: "success" as const,
          FiebreAftosa: "neutral" as const,
        }[row.getValue("name") as string] || ("neutral" as const);

      return h(UBadge, { class: "capitalize", variant: "subtle", color }, () =>
        row.getValue("name")
      );
    },
  },
  {
    accessorKey: "appliedDate",
    header: "Fecha de Aplicación",
    cell: ({ row }) => {
      return formatLocalDate(row.getValue("appliedDate") as string);
    },
  },
  {
    accessorKey: "nextDose",
    header: "Próxima Dosis",
    cell: ({ row }) => {
      return formatLocalDate(row.getValue("nextDose") as string);
    },
  },
  {
    accessorKey: "pet",
    header: "Nombre de la Mascota",
    cell: ({ row }) => {
      const pet = row.original.pet;
      return pet?.name || "Sin mascota";
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

function getRowItems(row: Row<Vaccine>) {
  return [
    {
      type: "label",
      label: "Acciones",
    },
    {
      label: "Ver detalles",
      icon: "i-lucide-eye",
      onSelect() {
        navigateTo(`/vaccines/${row.original.id}`);
      },
    },
    {
      label: "Editar vacuna",
      icon: "i-lucide-edit-2",
      onSelect() {
        navigateTo(`/vaccines/${row.original.id}/edit`);
      },
    },
    {
      label: "Eliminar vacuna",
      icon: "i-lucide-trash",
      color: "error",
      onSelect() {
        handleDelete(row.original.id);
      },
    },
  ];
}

const handleDelete = async (id: string) => {
  if (!confirm("¿Estás seguro de eliminar esta vacuna?")) {
    return;
  }

  try {
    await deleteVaccine(id);

    toast.add({
      title: "Vacuna eliminada",
      description: "La vacuna se ha eliminado correctamente",
      color: "success",
      icon: "i-lucide-check-circle",
    });
  } catch (error: any) {
    console.error("Error al eliminar:", error);

    const errorMessage =
      error?.data?.message || error?.message || "Error al eliminar la vacuna";

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
    title="Gestión de Vacunas"
    buttonTitle="Nueva Dosis"
    path="/vaccines/create"
    description="Visualiza, registra y gestiona todas las vacunas aplicadas."
    icon="syringe"
  >
    <UInput
      v-model="searchQuery"
      placeholder="Buscar por vacuna o nombre del paciente..."
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
      <p class="text-red-600">Error al cargar las vacunas</p>
    </div>

    <UTable
      v-else
      sticky
      :data="vaccines || []"
      :columns="columns"
      class="flex-1 max-h-[500px]"
      :empty-state="{
        icon: 'i-lucide-inbox',
        label: 'No hay vacunas registradas',
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