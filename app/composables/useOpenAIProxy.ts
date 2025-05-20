// composables/useOpenAIProxy.ts
import { useApiKey } from './useApiKey'

export function useOpenAIProxy() {
  const runtimeConfig = useRuntimeConfig()
  const { apiKey, hasApiKey } = useApiKey()

  /**
   * Chama a API OpenAI através do proxy do servidor
   * @param messages Array de mensagens para enviar à OpenAI
   * @param images Array opcional de imagens em base64
   * @param options Opções adicionais como modelo, temperatura, etc.
   * @returns Promise com o conteúdo da resposta
   */
  const callOpenAI = async (
    messages: any[],
    images: string[] = [],
    options: {
      model?: string
      max_tokens?: number
      temperature?: number
    } = {},
  ) => {
    // Verificar se temos uma chave API configurada
    if (!hasApiKey.value && !runtimeConfig.openaiApiKey) {
      throw new Error('Chave API OpenAI não configurada. Configure a chave nas configurações.')
    }

    try {
      // Usar a chave do usuário se disponível, senão usar a chave do ambiente
      const key = hasApiKey.value ? apiKey.value : runtimeConfig.openaiApiKey

      // Chamar o endpoint do proxy
      const response = await useFetch('/api/openai/proxy', {
        method: 'POST',
        body: {
          apiKey: key,
          messages,
          images,
          model: options.model || runtimeConfig.public.openaiModel,
          max_tokens: options.max_tokens || runtimeConfig.public.openaiMaxTokens,
          temperature: options.temperature || 0.8,
        },
      })

      // Verificar se a resposta foi bem-sucedida
      if (response.error.value) {
        throw new Error(response.error.value?.message || 'Erro ao chamar a API OpenAI')
      }

      // Retornar o conteúdo da resposta
      return response.data.value?.content || ''
    }
    catch (error) {
      console.error('Erro ao chamar o proxy OpenAI:', error)
      throw error
    }
  }

  return {
    callOpenAI,
  }
}
