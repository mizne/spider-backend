import * as cheerio from 'cheerio'
import { Harvester } from './lib/harvesters/Harvester'
import { Seeder } from './lib/seeders/Seeder'
import { BlogSite } from './lib/models/Site'
import { SiteTask } from './lib/tasks/SiteTask'
import { Logger } from './utils/Logger'

export abstract class Spider<T> {
  private harvester: Harvester
  private logger: Logger
  constructor(private sites: BlogSite[]) {
    this.harvester = new Harvester()
    this.logger = new Logger(Spider.name)
  }

  async run(): Promise<any> {
    const startTime = Date.now()
    // 生成 Seeder，管理url
    const seeder = new Seeder(this.sites)
    for (;;) {
      if (seeder.isEmpty()) {
        break
      }
      const task = seeder.getTask()
      this.logger.info('===============TASK START=================')
      this.logger.info('=========================================')
      // Harvester通过url 去下载html
      await this.harvester.execute(task)
      // parse 去解析html和搜集新url并添加给Seeder
      const { items, urls } = this.parse(cheerio.load(task.html), task)
      task.addMoreUrls(urls)
      // save 解析完成的结果
      await this.save(items)

      this.logger.info('=========================================')
      this.logger.info('===============TASK END=================')
      this.logger.blank()
    }
    this.harvester.destroy()
    const endTime = Date.now()
    this.logger.warn(`COST TIME: ${Math.floor((endTime - startTime) / 1e3)} seconds;`)
  }

  abstract parse($: CheerioStatic, task: SiteTask): { items: T[], urls: string[] }

  abstract async save(items: T[]): Promise<any>
}
