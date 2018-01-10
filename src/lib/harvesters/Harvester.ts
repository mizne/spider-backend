import * as puppeteer from 'puppeteer'
import { Browser } from 'puppeteer'
import { Logger } from '../../utils/Logger'
import { Seeder } from '../seeders/Seeder'

/**
 * 负责下载 html TODO 任务失败处理
 * 
 * @export
 * @class Harvester
 */
export class Harvester {
  private logger: Logger
  private browser: Browser
  constructor() {
    this.logger = new Logger(Harvester.name)
  }
  async downloadHTML(seeder: Seeder): Promise<{html: string, url: string}> {
    const url = seeder.getUrl()
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
      this.logger.success(`download html success; url: ${url};`)
      seeder.success(url)
      return {
        html: bodyHTML,
        url
      }
    } catch (err) {
      // TODO 下载失败待处理
      this.logger.error(
        `download html error; url: ${url}; error: ${err.message};`
      )
      seeder.failure(url)
      return {
        html: '',
        url
      }
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
