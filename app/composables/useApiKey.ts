export function useApiKey() {
  const apiKey = ref<string>('')
  const hasApiKey = useState<boolean>('has-api-key', () => false)
  const isLoading = useState<boolean>('api-key-loading', () => false)
  const toast = useToast()

  // Verificar se há uma chave válida no servidor
  const checkApiKey = async (): Promise<boolean> => {
    isLoading.value = true

    try {
      // Usando $fetch diretamente em vez de useFetch para evitar o erro
      const response = await $fetch('/api/auth/api-key', {
        method: 'GET',
      })

      hasApiKey.value = response?.hasKey || false
      return hasApiKey.value
    }
    catch (error) {
      console.error('Erro ao verificar a chave API:', error)
      hasApiKey.value = false
      return false
    }
    finally {
      isLoading.value = false
    }
  }

  // Salvar chave API via HTTP-only cookie
  const saveApiKey = async (key: string): Promise<boolean> => {
    if (!key) return false
    isLoading.value = true

    try {
      // Usando $fetch diretamente
      await $fetch('/api/auth/api-key', {
        method: 'POST',
        body: { apiKey: key },
      })

      hasApiKey.value = true

      toast.add({
        title: 'Chave de API salva com sucesso!',
        color: 'success',
      })
      return true
    }
    catch (error) {
      console.error('Erro ao salvar a chave API:', error)
      return false
    }
    finally {
      apiKey.value = '' // Limpar a chave da memória após salvá-la
      isLoading.value = false
    }
  }

  // Remover chave API
  const clearApiKey = async (): Promise<boolean> => {
    isLoading.value = true

    try {
      // Usando $fetch diretamente
      await $fetch('/api/auth/api-key', {
        method: 'DELETE',
      })

      hasApiKey.value = false
      apiKey.value = ''

      toast.add({
        title: 'Chave de API removida com sucesso!',
        color: 'success',
      })
      return true
    }
    catch (error) {
      console.error('Erro ao remover a chave API:', error)
      return false
    }
    finally {
      isLoading.value = false
    }
  }

  // Inicializar verificação
  if (import.meta.client) {
    // Este código só vai executar no cliente
    checkApiKey().catch(console.error)
  }

  return {
    apiKey,
    hasApiKey,
    isLoading,
    saveApiKey,
    clearApiKey,
    checkApiKey,
  }
}
