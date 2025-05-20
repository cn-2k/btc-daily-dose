export function useApiKey() {
  // Use useState do Nuxt para estado reativo
  const apiKey = useState<string>('openai-api-key', () => '')
  const hasApiKey = useState<boolean>('has-api-key', () => false)

  onMounted(() => {
    // No lado do cliente, verifique se a chave existe no localStorage
    if (import.meta.client) {
      try {
        const localKey: string | null = localStorage.getItem('openai_api_key')
        if (localKey) {
          apiKey.value = localKey
          hasApiKey.value = true
        }
      }
      catch (e) {
        console.error('Erro ao recuperar a chave API:', e)
        clearApiKey()
      }
    }
  })

  /**
   * Salva a chave API no localStorage e no estado reativo
   * @param key Chave API a ser armazenada
   * @returns Promise<boolean> indicando se a operação foi bem-sucedida
   */
  const saveApiKey = async (key: string): Promise<boolean> => {
    if (import.meta.client) {
      localStorage.setItem('openai_api_key', key)
      apiKey.value = key
      hasApiKey.value = true
      return true
    }

    return false
  }

  /**
   * Remove a chave API do localStorage e do estado reativo
   */
  const clearApiKey = (): void => {
    if (import.meta.client) {
      localStorage.removeItem('openai_api_key')
    }
    apiKey.value = ''
    hasApiKey.value = false
  }

  // Interface de retorno tipada implicitamente pelo TypeScript
  return {
    apiKey,
    hasApiKey,
    saveApiKey,
    clearApiKey,
  }
}

// Definição explícita do tipo de retorno para referência (opcional)
export interface ApiKeyComposable {
  apiKey: Ref<string>
  hasApiKey: Ref<boolean>
  saveApiKey: (key: string) => Promise<boolean>
  clearApiKey: () => void
}
