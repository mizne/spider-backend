import * as cheerio from 'cheerio'
import { Harvester } from './lib/harvesters/Harvester'
import { Seeder } from './lib/seeders/Seeder'

export abstract class Spider<T> {
  private harvester: Harvester
  constructor(public urls: string[], public selectors: any[]) {
    this.harvester = new Harvester()
  }

  async run(): Promise<any> {
    // 生成 Seeder，从中获取url
    const seeder = new Seeder(this.urls)
    for (;;) {
      if (seeder.isEmpty()) {
        break
      }
      // Harvester通过url 去下载html
      const { html, url } = await this.harvester.downloadHTML(seeder)
      // parse 去解析html和搜集新url并添加给Seeder
      const { items, urls } = this.parse(cheerio.load(html), url)
      seeder.addMoreUrls(urls)

      // save 解析完成的结果
      this.save(items)
    }
    this.harvester.destroy()
  }

  abstract parse($: CheerioStatic, url: string): { items: T[]; urls: string[] }

  abstract async save(items: T[]): Promise<any>
}
