// server/api/analysis/combined.post.ts
import { prompts } from '@/utils/ai/prompts'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  try {
    // Ler o corpo da requisição
    const { tradingViewScreenshot, heatMap } = await readBody(event)

    if (!tradingViewScreenshot || !heatMap) {
      throw createError({
        statusCode: 400,
        message: 'As imagens em Base64 são obrigatórias.',
      })
    }

    // Buscar a chave API diretamente do cookie
    const apiKey = getCookie(event, 'openai_api_key')

    if (!apiKey) {
      throw createError({
        statusCode: 401,
        message: 'Chave API OpenAI não configurada.',
      })
    }

    // Chamar o proxy para a OpenAI
    const response: any = await $fetch('/api/openai/proxy', {
      method: 'POST',
      body: {
        apiKey,
        messages: [
          {
            role: 'system',
            content: prompts.combinedAnalysis,
          },
          {
            role: 'user',
            content: 'Por favor, analise o gráfico do bitcoin no tradingview e o mapa de calor de liquidação:',
          },
        ],
        images: [tradingViewScreenshot, heatMap],
        model: runtimeConfig.public.openaiModel,
        max_tokens: runtimeConfig.public.openaiMaxTokens,
        temperature: 0.8,
      },
    })

    // Retornar a resposta da análise
    return {
      success: true,
      response: response.content,
    }
  }
  catch (error) {
    console.error('Erro ao processar a análise:', error)
  }
})
