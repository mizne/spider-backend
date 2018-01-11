import * as cheerio from 'cheerio'
import { Harvester } from './lib/harvesters/Harvester'
import { Seeder } from './lib/seeders/Seeder'
import { BlogSite } from './lib/models/Site'
import { SiteTask } from './lib/tasks/SiteTask'
import { Logger } from './utils/Logger'

export abstract class Spider<T> {
  private seeder: Seeder
  private harvester: Harvester
  private logger: Logger
  constructor(private sites: BlogSite[]) {
    this.seeder = new Seeder(this.sites)
    this.harvester = new Harvester()
    this.logger = new Logger(Spider.name)
  }

  async run(): Promise<any> {
    for (;;) {
      if (this.seeder.isEmpty()) {
        break
      }
      const task = this.seeder.getTask()
      this.logger.info('===============TASK START=================')
      this.logger.info('=========================================')
      // Harvester通过url 去下载html
      await this.harvester.execute(task)
      // parse 去解析html和搜集新url
      const { items, urls } = this.parse(cheerio.load(task.html), task)
      task.addMoreUrls(urls)
      // save 解析完成的结果
      await this.save(items)

      this.logger.info('=========================================')
      this.logger.info('===============TASK END=================')
      this.logger.blank()
    }
  }

  destroy() {
    this.seeder.destroy()
    this.seeder = null
    this.harvester.destroy()
    this.harvester = null
    this.logger = null
  }

  abstract parse(
    $: CheerioStatic,
    task: SiteTask
  ): { items: T[]; urls: string[] }

  abstract async save(items: T[]): Promise<any>
}
