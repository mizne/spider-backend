import * as cheerio from 'cheerio'
import * as debug from 'debug'
import { Harvester } from './harvesters/Harvester'
import { Seeder } from './seeders/Seeder'
import { BlogSite, BlogSelector } from './models/Site'
import { SpiderStatistics } from './models/Statistics'
import { debugError } from './Helper'
const debugSpider = debug('Spider:Spider.ts')

export abstract class Spider<T> {
  private seeder: Seeder
  private harvester: Harvester
  constructor(private sites: BlogSite[]) {
    this.seeder = new Seeder(this.sites)
    this.harvester = new Harvester()
  }

  public async singleRun(): Promise<any> {
    try {
      for (;;) {
        if (this.seeder.complete()) {
          break
        }
        const task = this.seeder.getTask()
        if (task) {
          // Harvester通过url 去下载html
          task.html = await this.harvester.execute(task.url)
          // parse 去解析html和搜集新url
          const { items, urls } = this.parse(
            cheerio.load(task.html),
            task.url,
            task.selector
          )
          task.addMoreUrls(urls)
          // save 解析完成的结果
          task.insertItemCount = await this.save(items)
        } else {
          // 此时 没有可重试任务 和 待生成任务的url
          // 只剩下 peddingTasks
          // 让出调用栈
          await sleep(1e2)
        }
      }
      debugSpider(`Run success;`)
    } catch (e) {
      debugError(e)
    }
  }

  public async run(
    concurrent: number = this.sites.length
  ): Promise<SpiderStatistics> {
    const startTime = Date.now()
    return Promise.all(
      Array.from({ length: concurrent }, () => this.singleRun())
    )
      .then(() => {
        const endTime = Date.now()
        const taskStatistics = this.seeder.getTaskStatistics()
        this.doDestroy()
        return {
          ...taskStatistics,
          secondCost: Math.floor((endTime - startTime) / 1e3)
        }
      })
      .catch(err => {
        this.doDestroy()
        return Promise.reject(err)
      })
  }

  private doDestroy(): void {
    this.seeder.destroy()
    this.seeder = null
    this.harvester.destroy()
    this.harvester = null
  }

  public abstract parse(
    $: CheerioStatic,
    url: string,
    selector: BlogSelector
  ): { items: T[]; urls: string[] }

  public abstract async save(items: T[]): Promise<number>
}

function sleep(ms: number) {
  return new Promise(res => {
    setTimeout(res, ms)
  })
}
