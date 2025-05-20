// server/api/analysis/combined.post.ts
import { prompts } from '@/utils/ai/prompts'

export default defineEventHandler(async (event) => {
  // await requireUserSession(event)

  try {
    // Ler o corpo da requisição
    const { tradingViewScreenshot, heatMap } = await readBody(event)

    if (!tradingViewScreenshot || !heatMap) {
      throw createError({
        statusCode: 400,
        message: 'As imagens em Base64 são obrigatórias.',
      })
    }

    // Buscar a chave API do usuário da sessão ou do localStorage
    let apiKey = null

    // Verificar se temos a chave na sessão (se o usuário estiver autenticado)
    const session = await getUserSession(event)
    if (session?.openaiApiKey) {
      apiKey = session.openaiApiKey
    }
    else {
      // Verificar se temos a chave no cookie (alternativa se o usuário não estiver autenticado)
      const cookies = parseCookies(event)
      if (cookies['openai_api_key']) {
        apiKey = cookies['openai_api_key']
      }
    }

    // Usar a chave de configuração como fallback
    if (!apiKey) {
      const config = useRuntimeConfig()
      apiKey = config.openaiApiKey
    }

    if (!apiKey) {
      throw createError({
        statusCode: 400,
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
        model: useRuntimeConfig().public.openaiModel,
        max_tokens: useRuntimeConfig().public.openaiMaxTokens,
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
