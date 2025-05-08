import { analyseTradingViewChartWithOpenAI } from '@/utils/ai'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  try {
    // Leia o corpo da requisição
    const { screenshot } = await readBody(event)

    if (!screenshot) {
      throw createError({
        statusCode: 400,
        message: 'A imagem em Base64 é obrigatória.',
      })
    }

    // Use a função de análise diretamente
    const response = await analyseTradingViewChartWithOpenAI(screenshot)

    // Retorna a resposta da análise
    return {
      success: true,
      response,
    }
  }
  catch (error) {
    console.error('Erro ao processar a análise:', error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao processar a análise.',
    })
  }
})
