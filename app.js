const puppeteer = require('puppeteer')
const fs = require('fs')
const resemble = require('resemblejs')

let websites = []

process.argv = process.argv.slice(2) // Slice away the first two command line arguments

if (process.argv.length == 0) { 
    // If no command line arguments are given add hardcoded examples
    websites = [
        { url: 'https://rrzk.uni-koeln.de/', filename: 'homepage' },
        { url: 'https://rrzk.uni-koeln.de/aktuelles.html', filename: 'news' },
        { url: 'https://typo3.uni-koeln.de/typo3-angebote.html', filename: 'typo3-offerings' },
        { url: 'https://typo3.uni-koeln.de/typo3-links-und-downloads.html', filename: 'typo3-links-and-downloads' }
    ]
} else {
    process.argv.forEach((val, index) => {
        try { // Check if argument is a URL
            let screenshotURL = new URL(val)
            // Add URL to websites array if valid and create filename
            websites.push({ url: screenshotURL.href, filename: index + '_' + screenshotURL.host})
        } catch (err) {
            console.error('"' + val + '" Is not a valid URL!')
        }
    })
}

const screenshotsFolder = './screenshots/'

const takeScreenshot = async (url, filename) => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const page = await browser.newPage()

    await page.setViewport({ width: 1920, height: 1080 })
    await page.goto(url)
    await page.screenshot({ path: filename, fullPage: true })
    await page.close()
    await browser.close()
}

const regressionTest = async (filename, orgScreenshotPath, testScreenshotPath) => {
    console.log('Visual Regression: ' +  filename)

    const diffFolder = screenshotsFolder + 'diff/'

    resemble(orgScreenshotPath).compareTo(testScreenshotPath).onComplete(data => {
        if (data.misMatchPercentage > 0) {
            console.log('Missmatch of ' + data.misMatchPercentage + '%')

            // Create screenshots/diff folder only when needed
            if (!fs.existsSync(diffFolder)) {
                fs.mkdir(diffFolder, (err) => {
                    if (err) throw err
                })
            }

            // Set filename and folder for Diff file
            const diffScreenshotPath = diffFolder + filename + '_' + data.misMatchPercentage + '_diff.png'
            fs.writeFile(diffScreenshotPath, data.getBuffer(), (err) => {
                if (err) throw err
            })
        }
    })
}

// Immediately-invoked arrow function after launch
(async () => { 
    // Create screenshots folder if it does not exist
    if (!fs.existsSync(screenshotsFolder)) {
        fs.mkdir(screenshotsFolder, (err) => {
            if (err) throw err
        })
    }

    for (const website of websites) {
        const orgScreenshotPath = screenshotsFolder + website.filename + '.png'
        const testScreenshotPath = screenshotsFolder + website.filename + '_test.png'
        // Check if both original and testing screenshot already exist
        if (fs.existsSync(orgScreenshotPath) && fs.existsSync(testScreenshotPath)) {
            // Both exist run regressionTest()
            await regressionTest(website.filename, orgScreenshotPath, testScreenshotPath)
        } else {
            if (fs.existsSync(orgScreenshotPath)) {
                // Original exists create test screenshot
                await takeScreenshot(website.url, testScreenshotPath)
                    .then(console.log('Created test: ' + website.filename))
                await regressionTest(website.filename, orgScreenshotPath, testScreenshotPath)
            } else {
                // No Original exists, let's create a new one
                await takeScreenshot(website.url, orgScreenshotPath)
                    .then(console.log('Created original: ' + website.filename))
            }
        }
    }
})()