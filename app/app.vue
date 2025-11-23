<template>
  <UApp :toaster="toaster" >
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>


<script setup lang="ts">
import { useAuthStore } from './store/auth'
const toaster = useAppConfig().toaster

const authStore = useAuthStore()


</script>
