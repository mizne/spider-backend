import { Logger } from '../../utils/Logger'
import { SiteTask } from '../tasks/SiteTask'
import { BlogSite } from '../models/Site'

import { Subject } from 'rxjs'

/**
 * 负责URL管理 TODO 优先级获取 同类网站获取分页 从小到大
 *
 * @export
 * @class Seeder
 */
export class Seeder {
  private urlsTodo: { [key: string]: string[] } = {}
  private urlsDone: { [key: string]: string[] } = {}
  private logger: Logger
  private taskSuccessSub: Subject<SiteTask> = new Subject<SiteTask>()
  private taskFailureSub: Subject<SiteTask> = new Subject<SiteTask>()
  private taskAddMoreUrlsSub: Subject<{
    task: SiteTask
    urls: string[]
  }> = new Subject<{ task: SiteTask; urls: string[] }>()

  constructor(private sites: BlogSite[]) {
    this.logger = new Logger(Seeder.name)
    this.initUrls(sites)
    this.initSubscriber()
  }

  public isEmpty(): boolean {
    return Object.values(this.urlsTodo).every(arr => arr.length === 0)
  }

  public getTask(): SiteTask {
    for (const domain of Object.keys(this.urlsTodo)) {
      if (this.urlsTodo[domain].length > 0) {
        const url = this.urlsTodo[domain].shift()
        this.logger.info(`Get task success; domain: ${domain}; url: ${url};`)
        return new SiteTask({
          domain,
          url,
          selector: this.sites.find(e => e.url === domain).selector,
          successSub: this.taskSuccessSub,
          failureSub: this.taskFailureSub,
          addMoreUrlsSub: this.taskAddMoreUrlsSub
        })
      }
    }

    this.logger.error(`There is no task to get;`)
  }

  private initUrls(sites: BlogSite[]) {
    sites.forEach(site => {
      this.urlsTodo[site.url] = [site.url]
      this.urlsDone[site.url] = []
    })
  }

  private initSubscriber() {
    this.taskSuccessSub.asObservable().subscribe(task => {
      this.success(task)
    })

    this.taskFailureSub.asObservable().subscribe(task => {
      this.failure(task)
    })

    this.taskAddMoreUrlsSub.asObservable().subscribe(({ task, urls }) => {
      this.addMoreUrls(task, urls)
    })
  }

  private success(task: SiteTask): void {
    const urlsDone = this.urlsDone[task.domain]
    urlsDone.push(task.url)
    this.logger.success(
      `url done success; domain: ${task.domain}; url: ${task.url}; count: ${
        urlsDone.length
      }`
    )
  }

  private failure(task: SiteTask): void {
    const urlsTodo = this.urlsTodo[task.domain]
    urlsTodo.push(task.url)
    this.logger.warn(
      `url done failure; domain: ${task.domain}; url: ${task.url}; count: ${
        urlsTodo.length
      }`
    )
  }

  private addMoreUrls(task: SiteTask, urls: string[]): void {
    const urlsDone = this.urlsDone[task.domain]
    const urlsTodo = this.urlsTodo[task.domain]

    const todoUrls = urls.filter(
      e => urlsDone.indexOf(e) === -1 && urlsTodo.indexOf(e) === -1
    )
    urlsTodo.push(...todoUrls)
  }
}
