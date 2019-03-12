const puppeteer = require('puppeteer')

const websites = [
  { url: 'https://rrzk.uni-koeln.de/', filename: 'homepage' },
  { url: 'https://rrzk.uni-koeln.de/aktuelles.html', filename: 'news' },
  { url: 'https://typo3.uni-koeln.de/typo3-angebote.html', filename: 'typo3-offerings'},
  { url: 'https://typo3.uni-koeln.de/typo3-links-und-downloads.html', filename: 'typo3-links-and-downlods'}
]

const takeScreenshot = async (url, filename) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.setViewport({ width: 1920, height: 1080 })
  await page.goto(url)
  await page.screenshot({ path: './screenshots/' + filename + '.png', fullPage: true }).then(
    console.log('Screenshot: ' + filename)
  )
  await page.close()
  await browser.close()
}

for (const website of websites) {
  // console.log(website.url)
  // console.log(website.filename)
  takeScreenshot(website.url, website.filename)
}
