// composables/useApiKey.ts
export function useApiKey() {
  // Use useState do Nuxt para estado reativo
  const apiKey = useState<string>('openai-api-key', () => '')
  const hasApiKey = useState<boolean>('has-api-key', () => false)
  const isLoading = useState<boolean>('api-key-loading', () => false)

  onMounted(() => {
    // No lado do cliente, verifique se a chave existe no localStorage
    if (import.meta.client) {
      try {
        const localKey: string | null = localStorage.getItem('openai_api_key')
        if (localKey) {
          apiKey.value = localKey
          hasApiKey.value = true

          // Sincroniza com o backend automaticamente
          saveApiKey(localKey).catch(err =>
            console.error('Erro ao sincronizar chave API com o servidor:', err),
          )
        }
      }
      catch (e) {
        console.error('Erro ao recuperar a chave API:', e)
        clearApiKey()
      }
    }
  })

  /**
   * Salva a chave API no localStorage e no servidor
   * @param key Chave API a ser armazenada
   * @returns Promise<boolean> indicando se a operação foi bem-sucedida
   */
  const saveApiKey = async (key: string): Promise<boolean> => {
    isLoading.value = true

    try {
      // Salvar localmente
      if (import.meta.client) {
        localStorage.setItem('openai_api_key', key)
      }

      apiKey.value = key
      hasApiKey.value = true

      // Salvar no servidor
      await $fetch('/api/auth/api-key', {
        method: 'POST',
        body: { apiKey: key },
      })

      return true
    }
    catch (error) {
      console.error('Erro ao salvar a chave API:', error)
      return false
    }
    finally {
      isLoading.value = false
    }
  }

  /**
   * Remove a chave API do localStorage e do servidor
   */
  const clearApiKey = async (): Promise<void> => {
    isLoading.value = true

    try {
      // Remover localmente
      if (import.meta.client) {
        localStorage.removeItem('openai_api_key')
      }

      apiKey.value = ''
      hasApiKey.value = false

      // Remover no servidor
      await $fetch('/api/auth/api-key', {
        method: 'DELETE',
      })
    }
    catch (error) {
      console.error('Erro ao remover a chave API:', error)
    }
    finally {
      isLoading.value = false
    }
  }

  // Interface de retorno tipada implicitamente pelo TypeScript
  return {
    apiKey,
    hasApiKey,
    isLoading,
    saveApiKey,
    clearApiKey,
  }
}

// Definição explícita do tipo de retorno para referência (opcional)
export interface ApiKeyComposable {
  apiKey: Ref<string>
  hasApiKey: Ref<boolean>
  isLoading: Ref<boolean>
  saveApiKey: (key: string) => Promise<boolean>
  clearApiKey: () => Promise<void>
}
