// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@vueuse/nuxt',
    'nuxt-auth-utils',
  ],

  ssr: false,
  devtools: { enabled: true },

  css: ['@/assets/css/base.css'],

  colorMode: {
    preference: 'dark',
  },

  ui: {
    theme: {
      colors: [
        'amber',
        'primary',
        'secondary',
        'info',
        'success',
        'warning',
        'error',
      ],
    },
  },

  runtimeConfig: {
    openaiApiKey: '',
  },

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2024-11-01',

  nitro: {
    vercel: {
      functions: {
        maxDuration: 60,
      },
    },
    experimental: {
      websocket: true,
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },
})
