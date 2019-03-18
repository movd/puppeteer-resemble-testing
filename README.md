# puppeteer-resemble-testing
Repository for my intro blog posts to visual regression testing with Puppeteer and Resemble.js

Part 1: [Creating screenshots in batches with Puppeteer](https://blog.uni-koeln.de/rrzk-knowhow/2019/03/13/visuelle-tests-puppeteer-screenshots/) (published in german language)

## Run

1. Clone this repository
2. `npm install`
3. `node app.js`

## How it works

During the first run original screenshots get created with [puppeteer](https://github.com/GoogleChrome/puppeteer). When reruning the script another round of screenshots get created and are compared with [Resemble.js](https://rsmbl.github.io/Resemble.js/).

You can pass your own URL(s) like so `node app.js http://example.com https://www.gnu.org/`

## Run with Docker

This script can also be run in a containerized environment. This gives the guarantee that screenshots are created in consistent way with a stable Chrome Browser.

Using this [docker-puppeteer](https://github.com/zenato/docker-puppeteer) Base environment image like so:

* `docker-compose build`
* `docker run --rm -v "${PWD}/screenshots:/app/screenshots"  puppeteer-resemble-testing_puppeteer:latest http://example.com`