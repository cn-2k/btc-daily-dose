import { serverLog } from '../../../server/utils/logger'

export const analyseTradingViewChartWithOpenAI = async (screenshot: string) => {
  try {
    serverLog('Iniciando análise de IA do gráfico BTC do TradingView.')

    const response: any = await $fetch('/api/analysis/tradingview', {
      method: 'POST',
      body: {
        screenshot,
      },
    })

    serverLog('Análise de IA do gráfico BTC do TradingView concluída com sucesso.')

    return response.response
  }
  catch (error) {
    console.error('Erro durante a análise:', error)
    throw error
  }
}

export const analyseHeatMapChartWithOpenAI = async (
  screenshot: string,
) => {
  try {
    serverLog('Iniciando análise de IA do Mapa de Calor de Liquidez do BTC.')

    const response: any = await $fetch('/api/analysis/heatmap', {
      method: 'POST',
      body: {
        screenshot,
      },
    })
    serverLog('Análise de IA do Mapa de Calor de Liquidez do BTC concluída com sucesso.')

    return response.response
  }
  catch (error) {
    console.error('Erro durante a análise:', error)
    throw error
  }
}

export const analyseChartAndLiquidationWithOpenAI = async (tradingViewScreenshot: string, heatMap: string) => {
  try {
    serverLog('Iniciando análise de IA geral do gráfico e mapa de liquidação do BTC.')

    const response: any = await $fetch('/api/analysis/general', {
      method: 'POST',
      body: {
        tradingViewScreenshot,
        heatMap,
      },
    })
    serverLog('Análise de IA do gráfico e mapa de calor do BTC concluída com sucesso.')

    return response.response
  }
  catch (error) {
    console.error('Erro durante a análise:', error)
    throw error
  }
}
