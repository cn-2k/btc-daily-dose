import puppeteerCore from 'puppeteer-core'
import chromium from '@sparticuz/chromium-min'
// import chromium from "@sparticuz/chromium";

const DEFAULT_PAGE_TIMEOUT_MS = 60000
const CHROMIUM_PATH
  = 'https://github.com/Sparticuz/chromium/releases/download/v123.0.0/chromium-v123.0.0-pack.tar'

export const connectBrowser = async (url: string) => {
  const executablePath = await chromium.executablePath(CHROMIUM_PATH)

  const browser = await puppeteerCore.launch({
    args: [
      ...chromium.args,
      '--hide-scrollbars',
      '--disable-web-security',
      '--disable-gpu',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
    ],
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: 'shell',
    acceptInsecureCerts: true,
  })

  // const browser = await puppeteerCore.launch({
  //   browser: 'chrome',
  //   headless: true,
  //   channel: 'chrome',
  // })

  const page = await browser.newPage()

  page.setDefaultTimeout(DEFAULT_PAGE_TIMEOUT_MS)

  await page.goto(url, {
    waitUntil: ['load', 'networkidle2'],
    timeout: DEFAULT_PAGE_TIMEOUT_MS,
  })

  return {
    browser,
    page,
  }
}
