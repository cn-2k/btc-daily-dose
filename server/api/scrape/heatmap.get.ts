import { connectBrowser } from '@/utils/config'
import { getHeatMapScreenshot } from '@/utils/puppeteer'

export default defineEventHandler(async () => {
  const { page } = await connectBrowser('https://www.coinglass.com/pt/pro/futures/LiquidationHeatMap')

  try {
    const screenshotBase64 = await getHeatMapScreenshot(page)

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
