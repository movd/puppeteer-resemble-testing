const puppeteer = require('puppeteer')

const takeScreenshot = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.setViewport({ width: 1920, height: 1080 })
  await page.goto('https://rrzk.uni-koeln.de/')
  await page.screenshot({ path: './screenshot.png', fullPage: true })
  await page.close()
  await browser.close()
}

takeScreenshot()