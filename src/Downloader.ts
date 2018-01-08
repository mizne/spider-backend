import * as puppeteer from 'puppeteer'
import { Logger } from './utils/Logger'
import { Browser } from 'puppeteer'

export class Downloader {
  private _url: string
  private downloaderMode: DownloaderMode
  private logger: Logger
  private browser: Browser
  constructor() {
    this.downloaderMode = DownloaderMode.DEFAULT
    this.logger = new Logger(Downloader.name)
  }
  downloadHTML(): Promise<string> {
    if (this.downloaderMode === DownloaderMode.DEFAULT) {
      return this.puppeteerDownloadHTML()
    }
  }

  set url(v: string) {
    this._url = v
  }

  get url(): string {
    return this._url
  }

  async puppeteerDownloadHTML(): Promise<string> {
    try {
      if (!this.browser) {
        this.browser = await puppeteer.launch({ headless: true })
      }
      const page = await this.browser.newPage()
      await page.goto(this._url)
      const bodyHandle = await page.$('body')
      const bodyHTML = await page.evaluate(
        (body: HTMLBodyElement) => body.innerHTML,
        bodyHandle
      )
      await page.close()
      return bodyHTML
    } catch (err) {
      this.logger.error(
        `download html; url: ${this._url}; error: ${err.message}`
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
