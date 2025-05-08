import { serverLog } from '../../../server/utils/logger'
import { openAIClient } from './client'
import { prompts } from './prompts'

const runtimeConfig = useRuntimeConfig()

export const analyseTradingViewChartWithOpenAI = async (screenshot: string) => {
  try {
    serverLog('Starting A.I analysis of TradingView BTC chart...')

    const chatCompletion = await openAIClient.chat.completions.create({
      model: runtimeConfig.public.openaiModel,
      max_tokens: runtimeConfig.public.openaiMaxTokens,
      n: 1,
      temperature: 0.8,
      messages: [
        {
          role: 'system',
          content: prompts.tradingViewAnalysis,
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Por favor, analise este gráfico do Bitcoin:' },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/png;base64,${screenshot}`,
              },
            },
          ],
        },
      ],
    })

    const responseContent = chatCompletion.choices[0]?.message?.content
    serverLog('A.I analysis of TradingView BTC chart completed successfully.')

    return responseContent
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
    serverLog('Starting A.I analysis of BTC Liquidity Heatmap...')

    const chatCompletion = await openAIClient.chat.completions.create({
      model: runtimeConfig.public.openaiModel,
      max_tokens: runtimeConfig.public.openaiMaxTokens,
      n: 1,
      temperature: 0.8,
      messages: [
        {
          role: 'system',
          content: prompts.heatMapAnalysis,
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Por favor, analise este gráfico do Bitcoin:' },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/png;base64,${screenshot}`,
              },
            },
          ],
        },
      ],
    })

    const responseContent = chatCompletion.choices[0]?.message?.content
    serverLog('A.I analysis of BTC Liquidity Heatmap completed successfully.')

    return responseContent
  }
  catch (error) {
    console.error('Erro durante a análise com OpenAI:', error)
    throw error
  }
}

export const analyseChartAndLiquidationWithOpenAI = async (tradingViewScreenshot: string, heatMap: string) => {
  try {
    serverLog('Starting general A.I analysis of BTC chart and heat map...')

    const chatCompletion = await openAIClient.chat.completions.create({
      model: runtimeConfig.public.openaiModel,
      max_tokens: runtimeConfig.public.openaiMaxTokens,
      n: 1,
      temperature: 0.8,
      messages: [
        {
          role: 'system',
          content: prompts.combinedAnalysis,
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Por favor, analise o gráfico do bitcoin no tradingview e o mapa de calor de liquidação:' },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/png;base64,${tradingViewScreenshot}`,
              },
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/png;base64,${heatMap}`,
              },
            },
          ],
        },
      ],
    })

    const responseContent = chatCompletion.choices[0]?.message?.content
    serverLog('A.I analysis of BTC chart and heat map completed successfully.')

    return responseContent
  }
  catch (error) {
    console.error('Erro durante a análise com OpenAI:', error)
    throw error
  }
}
