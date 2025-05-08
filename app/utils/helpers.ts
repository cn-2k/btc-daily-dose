import type { Page } from 'puppeteer-core'
import type * as ChatAPI from '../../node_modules/openai/src/resources/chat/chat'
import { serverLog } from '../../server/utils/logger'
import { openAIClient } from './client'

export const SCHEDULE = process.env.SCHEDULE
export const BROWSER_WS = process.env.BROWSER_WS

export const OPENAI_ENABLED
  = process.env.OPENAI_ENABLED === 'true' || process.env.OPENAI_ENABLED === '1'
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY
export const OPENAI_MODEL: ChatAPI.ChatModel
  = (process.env.OPENAI_MODEL as ChatAPI.ChatModel) ?? 'gpt-3.5-turbo'
export const OPENAI_MAX_TOKENS = Number(process.env.OPENAI_MAX_TOKENS)
export const OPENAI_INSTRUCTION = process.env.OPENAI_INSTRUCTION

export const getTradingViewScreenshot = async (page: Page) => {
  serverLog('Going to TradingView Page')

  await page.setViewport({
    width: 1920, // Largura da tela
    height: 1080, // Altura da tela
  })

  await page.waitForSelector('[data-name="details-key-stats"]', { visible: true })

  // Captura o screenshot como buffer
  const screenshotBase64 = await page.screenshot({ encoding: 'base64' })
  serverLog('TradingView screenshot captured in base64.')

  return screenshotBase64
}

export const getHeatMapScreenshot = async (page: Page) => {
  serverLog('Going to Coinglass BTC HeatMap Page')

  await page.setViewport({
    width: 1920, // Largura da tela
    height: 1080, // Altura da tela
  })

  await page.waitForSelector('.echarts-for-react', { visible: true })

  // Captura o screenshot como buffer
  const screenshotBase64 = await page.screenshot({ encoding: 'base64' })
  serverLog('BTC Liquidity Heatmap screenshot captured in base64.')

  return screenshotBase64
}

export const analyseTradingViewChartWithOpenAI = async (screenshot: string) => {
  try {
    serverLog('Starting A.I analysis of TradingView BTC chart...')

    const chatCompletion = await openAIClient.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: OPENAI_MAX_TOKENS,
      n: 1,
      temperature: 0.8,
      messages: [
        {
          role: 'system',
          content: `Você é um analista financeiro especializado em criptomoedas que está prestando consultoria para um investidor cripto iniciante que não tem muito tempo de mercado e análise gráfica. Analise o gráfico de Bitcoin do TradingView fornecendo:

1. **Tendência e padrões**: Identifique a tendência (alta, baixa, lateral) e padrões gráficos (triângulos, bandeiras, etc.).
2. **Price Action**: Destaque suportes, resistências, candles relevantes (martelo, estrela cadente, engolfo, etc).
3. **Volume**: Avalie o volume recente e a pressão compradora/vendedora.
4. **Expectativas**: Preveja próximas movimentações e sugira entradas, saídas ou gestão de risco.

Adicione as seguintes informações também para cada tópico específico: Comente sobre o volume e a pressão compradora/vendedora, Diferencie insights de curto prazo (sinais imediatos e correções) de médio prazo (tendências sustentáveis e projeções). Considere estratégias de curto prazo (por exemplo, aproveitar correções ou níveis de RSI baixo) e de médio prazo (monitorar a consolidação de tendências).
O gráfico informado é de 1 Dia, portanto,tome cuidado com isso. Exemplo de cenário: Eu não quero comprar em 80 mil pra vender em 85 mil, quero comprar em 80 pra vender em 100, esteja com isso em mente durante a resposta da análise, independente do valor do bitcoin, mas siga esse exemplo como base.

Seja claro, objetivo e útil para decisões no mercado de criptomoedas, principalmente em Bitcoin, tenha em mente que o usuário é um investidor cripto iniciante.
`,
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
      model: 'gpt-4o-mini',
      max_tokens: OPENAI_MAX_TOKENS,
      n: 1,
      temperature: 0.8,
      messages: [
        {
          role: 'system',
          content: `
Você é um analista técnico especializado em criptomoedas, especialmente Bitcoin. Sua tarefa é avaliar um mapa de calor de liquidez e oferecer insights detalhados, úteis para tomada de decisões no mercado. 

A análise deve incluir:
1. Identificação de áreas de alta e baixa liquidez no gráfico.
2. Padrões ou concentrações de liquidações significativas.
3. Pontos estratégicos para entrada ou saída de posições, considerando a liquidez e possíveis armadilhas de mercado.
4. Interpretação de como as liquidações podem impactar o preço a curto e médio prazo.
5. Recomendações práticas baseadas nos dados do gráfico, como:
   - Onde posicionar ordens de compra ou venda.
   - Potenciais movimentos de preço baseados na liquidez acumulada.
   - Sinais de comportamento de baleias ou manipulação de mercado.
6. Um resumo claro e conciso para que a análise seja compreendida mesmo por quem não tem o gráfico em mãos.

Seja técnico e estratégico, priorizando informações acionáveis. Explique suas conclusões e a lógica por trás delas.
`,
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
      model: 'gpt-4o-mini',
      max_tokens: OPENAI_MAX_TOKENS,
      n: 1,
      temperature: 0.8,
      messages: [
        {
          role: 'system',
          content: `
          Você é um analista financeiro especializado em criptomoedas que está prestando consultoria para um investidor cripto iniciante 
          que não tem muito tempo de mercado e análise gráfica. Analise as imagens enviadas, onde uma representa o gŕafico do bitcoin no tradingview 
          e outra o mapa de liquidação do bitcoin no coinglass, misture as duas análises e chegue em conclusões que possam trazer insights valiosos e 
          dicas para como se posicionar no bitcoin no momento da análise, sugestões, pontos de atenção, suportes e resistências mais importantes, 
          pontos de maior e baixa liquidez e o que acontecerá com o preço ao preço chegar nesses pontos.
          `,
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
