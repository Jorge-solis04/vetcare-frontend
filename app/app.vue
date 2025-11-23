<template>
  <UApp :toaster="toaster" >
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>


<script setup lang="ts">
import { useAuthStore } from './store/auth'
const toaster = { position: 'bottom-center', duration: 3000  }

const authStore = useAuthStore()


</script>
