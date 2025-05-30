import { prompts } from '@/utils/ai/prompts'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  try {
    const { screenshot } = await readBody(event)

    if (!screenshot) {
      throw createError({
        statusCode: 400,
        message: 'A imagem em Base64 é obrigatória.',
      })
    }

    const apiKey = getCookie(event, 'openai_api_key')

    if (!apiKey) {
      throw createError({
        statusCode: 401,
        message: 'Chave API OpenAI não configurada.',
      })
    }

    const response: any = await $fetch('/api/openai/proxy', {
      method: 'POST',
      body: {
        apiKey,
        input: 'Por favor, analise este mapa de calor de liquidação do Bitcoin:',
        instructions: prompts.heatMapAnalysis,
        images: [screenshot],
        model: runtimeConfig.public.openaiModel,
        max_output_tokens: runtimeConfig.public.openaiMaxTokens,
        temperature: 0.8,
      },
    })

    return {
      success: true,
      response: response.content,
    }
  }
  catch (error) {
    console.error('Erro ao processar a análise:', error)
    throw error
  }
})
