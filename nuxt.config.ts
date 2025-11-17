// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  ssr: false,

  // Módulos
  modules: [
    '@nuxt/ui', 
    '@pinia/nuxt',
  ],

  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:4000/api',
    },
  },
})
