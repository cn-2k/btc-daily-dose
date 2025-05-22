import { useApiKey } from './useApiKey'
import type { Message } from '~~/types'

export function useOpenAIProxy() {
  const runtimeConfig = useRuntimeConfig()
  const { hasApiKey } = useApiKey()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Chama a API OpenAI através do proxy do servidor
   */
  const callOpenAI = async (
    messages: any[],
    images: string[] = [],
    options: {
      model?: string
      max_tokens?: number
      temperature?: number
    } = {},
  ): Promise<string> => {
    if (!hasApiKey.value) {
      throw new Error('Chave API OpenAI não configurada. Configure a chave nas configurações.')
    }

    isLoading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await useFetch('/api/openai/proxy', {
        method: 'POST',
        body: {
          messages,
          images,
          model: options.model || runtimeConfig.public.openaiModel,
          max_tokens: options.max_tokens || runtimeConfig.public.openaiMaxTokens,
          temperature: options.temperature || 0.8,
        },
      })

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'Erro ao chamar a API OpenAI')
      }

      return data.value?.content || ''
    }
    catch (err: any) {
      error.value = err.message || 'Erro desconhecido ao chamar a API OpenAI'
      console.error('Erro ao chamar o proxy OpenAI:', err)
      throw err
    }
    finally {
      isLoading.value = false
    }
  }

  /**
   * Função para tratar mensagens de chat
   * @param chatMessages Histórico de mensagens do chat
   * @param systemPrompt Prompt de sistema (opcional)
   */
  const chatWithOpenAI = async (
    chatMessages: Message[],
    systemPrompt: string = 'Você é um assistente útil e amigável.',
    options: {
      model?: string
      max_tokens?: number
      temperature?: number
    } = {},
  ): Promise<string> => {
    // Converter mensagens do formato da aplicação para o formato da OpenAI
    const openAIMessages = [
      // Adicionar o prompt do sistema
      {
        role: 'system',
        content: systemPrompt,
      },
      // Converter mensagens do chat
      ...chatMessages.map(msg => ({
        role: msg.userId === 'assistant' ? 'assistant' : 'user',
        content: msg.text,
      })),
    ]

    // Chamar a API com as mensagens formatadas
    return await callOpenAI(openAIMessages, [], options)
  }

  return {
    callOpenAI,
    chatWithOpenAI,
    isLoading,
    error,
  }
}
