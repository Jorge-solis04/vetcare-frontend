<script setup lang="ts">
import { string } from 'zod';

const props = defineProps({
  title: String,
  description: String,
  buttonTitle: String,
  path: String,
  icon: String
});
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center gap-4 ">
        <div class="bg-vetcare-400 p-1 rounded-xl text-white w-12 h-12 flex items-center justify-center">
        <UIcon :name="`i-lucide-${props.icon}`" class="w-8 h-8"/>
        </div>
      <h1 class="text-3xl font-bold">{{ props.title }}</h1>
      </div>
        <UButton 
        @click="navigateTo(props.path)" 
        icon="i-lucide-plus"
        class="bg-vetcare-500 hover:bg-vetcare-600 text-white cursor-pointer dark:bg-vetcare-500 dark:hover:bg-vetcare-500 dark:text-white"
      >
        {{ props.buttonTitle }}
      </UButton>
    </div>
    <p class="text-gray-500 dark:text-gray-400 mb-6">{{ props.description }}</p>
    <slot />
  </div>
</template>
