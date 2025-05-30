import { useApiKey } from './useApiKey'
import type { Message, OpenAIInputMessage } from '~~/types'

export function useOpenAIProxy() {
  const runtimeConfig = useRuntimeConfig()
  const { hasApiKey } = useApiKey()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Chama a API OpenAI através do proxy do servidor usando Responses API
   */
  const callOpenAI = async (
    input: string | OpenAIInputMessage[],
    images: string[] = [],
    options: {
      model?: string
      max_output_tokens?: number
      temperature?: number
      instructions?: string
      tools?: { type: string }[] // Adicionar tools aqui
    } = {},
  ): Promise<string> => {
    if (!hasApiKey.value) {
      throw new Error('Chave API OpenAI não configurada. Configure a chave nas configurações.')
    }

    isLoading.value = true
    error.value = null

    try {
      const data = await $fetch('/api/openai/proxy', {
        method: 'POST',
        body: {
          input,
          images,
          instructions: options.instructions,
          model: options.model || runtimeConfig.public.openaiModel,
          max_output_tokens: options.max_output_tokens || runtimeConfig.public.openaiMaxTokens,
          temperature: options.temperature || 0.8,
          tools: options.tools || [], // Passar tools para o servidor
        },
      })

      return data.content || ''
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
   * Função para tratar mensagens de chat usando Responses API
   * @param chatMessages Histórico de mensagens do chat
   * @param systemPrompt Prompt de sistema (será usado como instructions)
   */
  const chatWithOpenAI = async (
    chatMessages: Message[],
    systemPrompt: string = 'Você é um assistente útil e amigável.',
    options: {
      model?: string
      max_output_tokens?: number
      temperature?: number
      tools?: { type: string }[]
      enableWebSearch?: boolean // Nova opção para facilitar o uso
    } = {},
  ): Promise<string> => {
    // Converter mensagens do formato da aplicação para o formato da Responses API
    const inputMessages: OpenAIInputMessage[] = chatMessages.map(msg => ({
      role: msg.userId === 'assistant' ? 'assistant' : 'user',
      content: msg.text,
    }))

    // Se enableWebSearch for true, adicionar automaticamente
    let tools = options.tools || []
    if (options.enableWebSearch && !tools.some(tool => tool.type === 'web_search_preview')) {
      tools = [...tools, { type: 'web_search_preview' }]
    }

    // Chamar a API com as mensagens formatadas e instructions
    return await callOpenAI(inputMessages, [], {
      ...options,
      instructions: systemPrompt,
      tools,
    })
  }

  return {
    callOpenAI,
    chatWithOpenAI,
    isLoading,
    error,
  }
}
