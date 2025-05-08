import { analyseChartAndLiquidationWithOpenAI } from '@/utils/ai'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  try {
    // Leia o corpo da requisição
    const { screenshot1, screenshot2 } = await readBody(event)

    // Use a função de análise diretamente
    const response = await analyseChartAndLiquidationWithOpenAI(screenshot1, screenshot2)

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
