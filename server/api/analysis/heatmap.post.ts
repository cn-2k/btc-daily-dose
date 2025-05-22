// server/api/analysis/heatmap.post.ts
import { prompts } from '@/utils/ai/prompts'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  try {
    // Ler o corpo da requisição
    const { screenshot } = await readBody(event)

    if (!screenshot) {
      throw createError({
        statusCode: 400,
        message: 'A imagem em Base64 é obrigatória.',
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
            content: prompts.heatMapAnalysis,
          },
          {
            role: 'user',
            content: 'Por favor, analise este gráfico do Bitcoin:',
          },
        ],
        images: [screenshot],
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
