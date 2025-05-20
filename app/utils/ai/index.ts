import { serverLog } from '../../../server/utils/logger'

export const analyseTradingViewChartWithOpenAI = async (screenshot: string) => {
  try {
    serverLog('Starting A.I analysis of TradingView BTC chart.')

    const response: any = await $fetch('/api/analysis/tradingview', {
      method: 'POST',
      body: {
        screenshot,
      },
    })

    serverLog('A.I analysis of TradingView BTC chart completed successfully.')

    return response.response
  }
  catch (error) {
    console.error('Erro durante a análise com OpenAI:', error)
    throw error
  }
}

export const analyseHeatMapChartWithOpenAI = async (
  screenshot: string,
) => {
  try {
    serverLog('Starting A.I analysis of BTC Liquidity Heatmap.')

    const response: any = await $fetch('/api/analysis/heatmap', {
      method: 'POST',
      body: {
        screenshot,
      },
    })
    serverLog('A.I analysis of BTC Liquidity Heatmap completed successfully.')

    return response.response
  }
  catch (error) {
    console.error('Erro durante a análise com OpenAI:', error)
    throw error
  }
}

export const analyseChartAndLiquidationWithOpenAI = async (tradingViewScreenshot: string, heatMap: string) => {
  try {
    serverLog('Starting general A.I analysis of BTC chart and liquidity map.')

    const response: any = await $fetch('/api/analysis/general', {
      method: 'POST',
      body: {
        tradingViewScreenshot,
        heatMap,
      },
    })
    serverLog('A.I analysis of BTC chart and heat map completed successfully.')

    return response.response
  }
  catch (error) {
    console.error('Erro durante a análise com OpenAI:', error)
    throw error
  }
}
