import { Downloader } from './Downloader'
import { TextExtract } from './lib/text-extract/TextExtract'
import { ISeeds } from './lib/seed//SeedsList'
import { ArticleService } from './storage/services/ArticleService'
import { Logger } from './utils/Logger'

export class Spider {
  private logger: Logger
  private downloader: Downloader
  constructor() {
    this.logger = new Logger(Spider.name)
    this.downloader = new Downloader()
  }

  async run(seeds: ISeeds[]) {
    for (const seed of seeds) {
      this.downloader.url = `${seed.host}${seed.path}`
      const html = await this.downloader.downloadHTML()
      this.logger.success(`download html success; url: ${this.downloader.url}`)

      const news = new TextExtract(seed.textExtractStrategy).extract(html)
      await new ArticleService().batchInsertIfNotIn(news)
    }

    await this.downloader.destroy()
  }
}
