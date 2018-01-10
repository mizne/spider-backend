import { Logger } from '../../utils/Logger'

/**
 * 负责URL管理 TODO 去重处理
 *
 * @export
 * @class Seeder
 */
export class Seeder {
  private urlsToDo: string[] = []
  private urlsDone: string[] = []
  private logger: Logger

  constructor(urls: string[]) {
    this.urlsToDo.push(...urls)
    this.logger = new Logger(Seeder.name)
  }

  public isEmpty(): boolean {
    return this.urlsToDo.length === 0
  }

  public getUrl(): string {
    const url = this.urlsToDo.shift()
    return url
  }

  public addMoreUrls(urls: string[]): void {
    const todoUrls = urls.filter(
      e => this.urlsDone.indexOf(e) === -1 && this.urlsToDo.indexOf(e) === -1
    )
    this.urlsToDo.push(...todoUrls)
  }

  public success(url: string): void {
    this.urlsDone.push(url)
    this.logger.success(
      `url done success; url: ${url}; count: ${this.urlsDone.length}`
    )
  }

  public failure(url: string): void {
    this.urlsToDo.push(url)
  }
}
