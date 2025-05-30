import { prompts } from '@/utils/ai/prompts'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  try {
    const { tradingViewScreenshot, heatMapScreenshot } = await readBody(event)

    if (!tradingViewScreenshot || !heatMapScreenshot) {
      throw createError({
        statusCode: 400,
        message: 'As imagens em Base64 são obrigatórias.',
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
        input: 'Por favor, analise o gráfico do bitcoin no tradingview e o mapa de calor de liquidação:',
        instructions: prompts.combinedAnalysis,
        images: [tradingViewScreenshot, heatMapScreenshot],
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
