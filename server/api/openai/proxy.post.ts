// /server/api/openai/proxy.post.ts
import type { OpenAIResponse, OpenAIInputMessage } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const {
      apiKey: providedApiKey = null,
      input,
      instructions,
      images = [],
      model,
      max_output_tokens,
      temperature,
      tools = [],
    } = body

    // Se não foi fornecida uma chave (chamada do cliente), busca do cookie
    let apiKey = providedApiKey

    if (!apiKey) {
      apiKey = getCookie(event, 'openai_api_key')

      if (!apiKey) {
        throw createError({
          statusCode: 401,
          message: 'Chave API OpenAI não configurada.',
        })
      }
    }

    // Preparar o input para a Responses API
    let finalInput: string | OpenAIInputMessage[]

    if (typeof input === 'string') {
      // Se tem imagens, precisa converter para formato de mensagem
      if (images.length > 0) {
        finalInput = [
          {
            role: 'user',
            content: [
              { type: 'input_text', text: input },
              ...images.map((image: string) => ({
                type: 'input_image',
                image_url: `data:image/jpeg;base64,${image}`,
              })),
            ],
          },
        ]
      }
      else {
        finalInput = input
      }
    }
    else if (Array.isArray(input)) {
      // Array de mensagens - converter para formato da Responses API
      finalInput = input.map((msg: any, index: number) => {
        // Para a primeira mensagem do usuário, anexar as imagens se existirem
        if (msg.role === 'user' && index === input.length - 1 && images.length > 0) {
          return {
            role: msg.role,
            content: [
              { type: 'input_text', text: msg.content },
              ...images.map((image: string) => ({
                type: 'input_image',
                image_url: `data:image/jpeg;base64,${image}`,
              })),
            ],
          }
        }

        // Mensagem regular
        return {
          role: msg.role === 'system' ? 'developer' : msg.role,
          content: typeof msg.content === 'string' ? msg.content : msg.content,
        }
      })
    }
    else {
      throw createError({
        statusCode: 400,
        message: 'Input deve ser string ou array de mensagens',
      })
    }

    // Configurar a solicitação para a OpenAI Responses API
    const runtimeConfig = useRuntimeConfig()
    const openaiUrl = 'https://api.openai.com/v1/responses'

    const requestBody = {
      model: model || runtimeConfig.public.openaiModel,
      input: finalInput,
      ...(instructions && { instructions }),
      max_output_tokens: max_output_tokens || runtimeConfig.public.openaiMaxTokens,
      temperature: temperature || 0.8,
      ...(tools.length > 0 && { tools }),
    }

    console.log('Request body para OpenAI:', JSON.stringify(requestBody, null, 2))

    // Fazer a solicitação para a API da OpenAI
    const openaiResponse: OpenAIResponse = await $fetch(openaiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    // Extrair o conteúdo da resposta
    let content = ''

    // Verificar se há output e processar
    if (openaiResponse.output && Array.isArray(openaiResponse.output)) {
      // Filtrar mensagens do tipo 'message' e extrair texto
      const messageOutputs = openaiResponse.output
        .filter(item => item.type === 'message')
        .flatMap(msg => msg.content || [])
        .filter(content => content.type === 'output_text')
        .map(content => content.text)

      content = messageOutputs.join('\n')
    }

    return {
      success: true,
      content,
      usage: openaiResponse.usage,
      tools_used: tools.length > 0 ? tools : null,
      raw_response: openaiResponse, // Para debug - remover em produção
    }
  }
  catch (error: any) {
    console.error('Erro ao chamar a API OpenAI:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao chamar a API OpenAI',
    })
  }
})
