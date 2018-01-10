import * as puppeteer from 'puppeteer'
import { Logger } from './utils/Logger'
import { Browser } from 'puppeteer'

export class Downloader {
  private logger: Logger
  private browser: Browser
  constructor() {
    this.logger = new Logger(Downloader.name)
  }
  async downloadHTML(url: string): Promise<string> {
    this.logger.start(`download html start; url: ${url}`)
    try {
      if (!this.browser) {
        this.browser = await puppeteer.launch({ headless: true })
      }
      const page = await this.browser.newPage()
      await page.goto(url)
      const bodyHandle = await page.$('body')
      const bodyHTML = await page.evaluate(
        (body: HTMLBodyElement) => body.innerHTML,
        bodyHandle
      )
      await page.close()
      this.logger.success(`download html success; url: ${url}`)
      return bodyHTML
    } catch (err) {
      this.logger.error(
        `download html error; url: ${url}; error: ${err.message}`
      )
      return ''
    }
  }

  async destroy() {
    if (this.browser) {
      this.browser.close()
    }
  }
}

export enum DownloaderMode {
  DEFAULT
}
