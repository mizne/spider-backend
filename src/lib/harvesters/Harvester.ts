import * as puppeteer from 'puppeteer'
import { Browser } from 'puppeteer'
import * as debug from 'debug'

const debugHarvester = debug('Spider:Harvester')

/**
 * 负责下载 html
 * TODO 如何处理 通过滚动到页底来加载更多内容
 * @export
 * @class Harvester
 */
export class Harvester {
  private browser: Browser
  constructor() {
  }
  public async execute(url: string): Promise<string> {
    try {
      return await this.downloadHtml(url)
    } catch (err) {
      debugHarvester(`Download html failure; url: ${url}; err: ${err.message};`)
      return ''
    }
  }

  public async downloadHtml(url: string): Promise<string> {
    debugHarvester(`Download html beginning; url: ${url};`)
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
    debugHarvester(`Download html success; url: ${url};`)
    return bodyHTML
  }

  public async destroy() {
    if (this.browser) {
      this.browser.close()
    }
  }
}
