import { connectBrowser } from '@/utils/config'
import { getTradingViewScreenshot } from '@/utils/helpers'

export default defineEventHandler(async () => {
  const { page } = await connectBrowser('https://br.tradingview.com/chart/?symbol=BINANCE%3ABTCUSDT')

  try {
    const screenshotBase64 = await getTradingViewScreenshot(page)

    // Retorna o Base64 da imagem
    return {
      success: true,
      screenshotBase64: screenshotBase64,
    }
  }
  catch (error) {
    console.error('Erro ao capturar a imagem:', error)
    await page.browser().close()
    throw new Error('Erro ao capturar a imagem.')
  }
  finally {
    await page.browser().close()
  }
})
