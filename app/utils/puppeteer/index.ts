import type { Page } from 'puppeteer-core'

export const getTradingViewScreenshot = async (page: Page) => {
  serverLog('Acessando a página do TradingView')

  await page.setViewport({
    width: 1920, // Largura da tela
    height: 1080, // Altura da tela
  })

  await page.waitForSelector('.widgetbar-widgetbody', { visible: true })

  // Captura o screenshot como buffer
  const screenshotBase64 = await page.screenshot({ encoding: 'base64' })
  serverLog('Imagem do TradingView capturada em base64.')

  return screenshotBase64
}

export const getHeatMapScreenshot = async (page: Page) => {
  serverLog('Acessando a página do mapa de liquição do BTC no Coinglass')

  await page.setViewport({
    width: 1920, // Largura da tela
    height: 1080, // Altura da tela
  })

  await page.waitForSelector('.echarts-for-react', { visible: true })

  // Captura o screenshot como buffer
  const screenshotBase64 = await page.screenshot({ encoding: 'base64' })
  serverLog('Imagem do mapa de liquidação do BTC no Coinglass capturada em base64.')

  return screenshotBase64
}
