import type { Page } from 'puppeteer-core'

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
