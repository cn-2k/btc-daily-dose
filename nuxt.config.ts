// https://nuxt.com/docs/api/configuration/nuxt-config
import type * as ChatAPI from './node_modules/openai/src/resources/chat/chat'

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@vueuse/nuxt'],

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

    public: {
      openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini' as ChatAPI.ChatModel,
      openaiMaxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4000'),
    },
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
