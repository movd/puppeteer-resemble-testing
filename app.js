const puppeteer = require('puppeteer')
const fs = require('fs')
const resemble = require('resemblejs')

const websites = [
  { url: 'https://rrzk.uni-koeln.de/', filename: 'homepage' },
  { url: 'https://rrzk.uni-koeln.de/aktuelles.html', filename: 'news' },
  { url: 'https://typo3.uni-koeln.de/typo3-angebote.html', filename: 'typo3-offerings'},
  { url: 'https://typo3.uni-koeln.de/typo3-links-und-downloads.html', filename: 'typo3-links-and-downloads'}
]

const screenshotsFolder = './screenshots/'

const takeScreenshot = async (url, filename) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.setViewport({ width: 1920, height: 1080 })
  await page.goto(url)
  await page.screenshot({ path: filename, fullPage: true })
  await page.close()
  await browser.close()
}

// Immediately-invoked arrow function after launch
(async () => { 
  for (const website of websites) {
    const orgScreenshotPath = screenshotsFolder + website.filename + '.png'
    const testScreenshotPath = screenshotsFolder + website.filename + '_test.png'
    // Check if both original and testing screenshot already exist
    if (fs.existsSync(orgScreenshotPath) && fs.existsSync(testScreenshotPath)) {
      // Both exist run regressionTest()
    } else {
      if (fs.existsSync(orgScreenshotPath)) {
        await takeScreenshot(website.url, testScreenshotPath)
        .then(console.log('Created test: ' + website.filename))
      } else {
        await takeScreenshot(website.url, orgScreenshotPath)
        .then(console.log('Created original: ' + website.filename))
      }
    }
  }
})()