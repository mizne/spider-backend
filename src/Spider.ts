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

  public async run(): Promise<any> {
    try {
      for (;;) {
        if (this.seeder.complete()) {
          break
        }
        const task = this.seeder.getTask()
        if (task) {
          // Harvester通过url 去下载html
          await this.harvester.execute(task)
          // parse 去解析html和搜集新url
          const { items, urls } = this.parse(cheerio.load(task.html), task)
          task.addMoreUrls(urls)
          // save 解析完成的结果
          await this.save(items)
        } else {
          // 此时 没有可重试任务 和 待生成任务的url
          // 只剩下 peddingTasks
          // 让出调用栈
          await sleep(1e2)
        }
      }
    } catch(e) {
      this.logger.error(`Run failure; err: ${e.message};`)
    }
  }

  public destroy() {
    this.seeder.destroy()
    this.seeder = null
    this.harvester.destroy()
    this.harvester = null
  }

  public abstract parse(
    $: CheerioStatic,
    task: SiteTask
  ): { items: T[]; urls: string[] }

  public abstract async save(items: T[]): Promise<any>
}

function sleep(ms: number) {
  return new Promise(res => {
    setTimeout(res, ms)
  })
}
