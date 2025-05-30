// /server/api/analysis/tradingview.post.ts
import { prompts } from '~/utils/ai/prompts'

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

    const response = await $fetch('/api/openai/proxy', {
      method: 'POST',
      body: {
        apiKey,
        input: 'Por favor, analise este gráfico do Bitcoin em detalhes. Descreva o que você vê na imagem.',
        instructions: prompts.tradingViewAnalysis,
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
  catch (error: any) {
    console.error(error)

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao processar a análise',
    })
  }
})
