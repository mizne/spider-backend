import * as cheerio from 'cheerio'
import { Downloader } from './Downloader'

export abstract class Spider<T> {
  private downloader: Downloader
  constructor(public urls: string[], public selectors: any[]) {
    this.downloader = new Downloader()
  }

  async run(): Promise<T[]> {
    const results: T[] = []
    for (let i = 0; i < this.urls.length; i += 1) {
      this.downloader.url = `${this.urls[i]}`
      const html = await this.downloader.downloadHTML()
      results.push(...this.parse(cheerio.load(html), this.urls[i], this.selectors[i]))
    }
    this.downloader.destroy()
    return results
  }

  abstract parse($: CheerioStatic, url: string, selector: any): T[]
}
