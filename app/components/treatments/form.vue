<script setup lang="ts">
import type { TreatmentPayload } from "~~/types";
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const props = defineProps<{
  petId: string;
  openTreatmentModal: boolean;
  initialData?: Partial<TreatmentPayload>;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submit", data: TreatmentPayload): void;
}>();

const schema = z
  .object({
    description: z
      .string()
      .min(3, "La descripción debe tener al menos 3 caracteres"),
    start: z.string().min(1, "La fecha de inicio es obligatoria"),
    end: z.string().min(1, "La fecha de fin es obligatoria"),
    petId: z.string(),
  })
  .refine(
    (data) => {
      const start = new Date(data.start);
      const end = new Date(data.end);
      return end >= start;
    },
    {
      message:
        "La fecha de fin debe ser posterior o igual a la fecha de inicio",
      path: ["end"],
    }
  );

type Schema = z.output<typeof schema>;

const state = reactive<TreatmentPayload>({
  description: props.initialData?.description || "",
  start: props.initialData?.start || "",
  end: props.initialData?.end || "",
  petId: props.petId,
});

const startDateOnly = ref("");
const endDateOnly = ref("");

watch([startDateOnly], ([start]) => {
  if (start) {
    const localDate = new Date(`${start}T00:00:00`);
    state.start = localDate.toISOString();
  }
});

watch([endDateOnly], ([end]) => {
  if (end) {
    const localDate = new Date(`${end}T00:00:00`);
    state.end = localDate.toISOString();
  }
});

onMounted(() => {
  if (props.initialData?.start) {
    const startDate = new Date(props.initialData.start);
    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, "0");
    const day = String(startDate.getDate()).padStart(2, "0");
    startDateOnly.value = `${year}-${month}-${day}`;
  }

  if (props.initialData?.end) {
    const endDate = new Date(props.initialData.end);
    const year = endDate.getFullYear();
    const month = String(endDate.getMonth() + 1).padStart(2, "0");
    const day = String(endDate.getDate()).padStart(2, "0");
    endDateOnly.value = `${year}-${month}-${day}`;
  }
});

const handleSubmit = (event: FormSubmitEvent<Schema>) => {
  console.log("Submitting treatment form with data:", event.data);
  emit("submit", event.data)
};

const handleClose = () => {
  emit("close");
};

</script>

<template>
  <UModal :open="openTreatmentModal" :title="`${props.initialData ? 'Editar Tratamiento' : `Agregar Tratamiento `}`" :close="{
      variant: 'ghost',
      onClick: handleClose
    }" >
   


    <template #body>
      <UForm :schema="schema" :state="state" @submit="handleSubmit" >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormField label="Fecha de Inicio" name="start" required>
            <UInput
              v-model="startDateOnly"
              type="date"
              size="lg"
              icon="i-lucide-calendar"
            />
          </UFormField>

          <UFormField label="Fecha de Fin" name="end" required>
            <UInput
              v-model="endDateOnly"
              type="date"
              size="lg"
              icon="i-lucide-calendar"
            />
          </UFormField>
        </div>
        <UFormField
          label="Descripción del Tratamiento"
          name="description"
          class="mt-6 w-full"
          required
        >
          <UTextarea
            v-model="state.description"
            placeholder="Ej: Tratamiento antibiótico por infección"
            class="w-full"
            :rows="4"
            size="lg"
          />
        </UFormField>

        <div class="flex justify-end gap-3 border-t border-gray-300 dark:border-gray-700 mt-6 pt-4">
            <UButton @click="handleClose" color="neutral" variant="ghost" size="lg">
                Cancelar
            </UButton>
            <UButton type="submit" color="success" size="lg" icon="i-lucide-save" >
                {{ initialData ? "Actualizar" : "Guardar" }}
            </UButton>
        </div>

      </UForm>
    </template>

    
  </UModal>
</template>
