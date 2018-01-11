import * as puppeteer from 'puppeteer'
import { Browser } from 'puppeteer'
import { Logger } from '../../utils/Logger'
import { SiteTask } from '../tasks/SiteTask'

/**
 * 负责下载 html
 * TODO 任务失败处理
 * TODO 如何处理 通过滚动到页底来加载更多内容
 * @export
 * @class Harvester
 */
export class Harvester {
  private logger: Logger
  private browser: Browser
  constructor() {
    this.logger = new Logger(Harvester.name)
  }
  async execute(task: SiteTask): Promise<any> {
    this.logger.start(`download html start; url: ${task.url}`)
    try {
      task.html = await this.downloadHtml(task.url)
      task.success()
      this.logger.success(`download html success; url: ${task.url};`)
    } catch (err) {
      task.html = ''
      task.failure()
      this.logger.error(
        `download html error; url: ${task.url}; error: ${err.message};`
      )
    }
  }

  async downloadHtml(url: string): Promise<string> {
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
    return bodyHTML
  }

  async destroy() {
    if (this.browser) {
      this.browser.close()
    }
  }
}
