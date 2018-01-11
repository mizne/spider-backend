import { Logger } from '../../utils/Logger'
import { SiteTask } from '../tasks/SiteTask'
import { BlogSite } from '../models/Site'

import { Subject, Subscription } from 'rxjs'

/**
 * 负责URL管理 TODO 优先级获取
 *
 * @export
 * @class Seeder
 */
export class Seeder {
  private urlsTodo: { [key: string]: string[] } = {}
  private urlsDone: { [key: string]: string[] } = {}
  private pendingTasks: SiteTask[] = []
  private retryTasks: SiteTask[] = []
  private logger: Logger
  private taskSuccessSub: Subject<SiteTask> = new Subject<SiteTask>()
  private taskFailureSub: Subject<SiteTask> = new Subject<SiteTask>()
  private taskAddMoreUrlsSub: Subject<{
    task: SiteTask
    urls: string[]
  }> = new Subject<{ task: SiteTask; urls: string[] }>()

  private subscriptions: Subscription[] = []

  constructor(private sites: BlogSite[]) {
    this.initLogger()
    this.initUrls(sites)
    this.initSubscriber()
  }

  public isEmpty(): boolean {
    return (
      Object.values(this.urlsTodo).every(arr => arr.length === 0) && 
      this.retryTasks.filter(e => e.canRetry()).length === 0
    )
  }

  public getTask(): SiteTask {
    for (const domain of Object.keys(this.urlsTodo)) {
      if (this.urlsTodo[domain].length > 0) {
        const url = this.urlsTodo[domain].shift()
        this.logger.info(`Get task success; domain: ${domain}; url: ${url};`)
        const task = new SiteTask({
          domain,
          url,
          selector: this.sites.find(e => e.url === domain).selector,
          successSub: this.taskSuccessSub,
          failureSub: this.taskFailureSub,
          addMoreUrlsSub: this.taskAddMoreUrlsSub
        })
        this.pendingTasks.push(task)
        return task
      }
    }

    if (this.retryTasks.length > 0) {
      for (let i = 0; i < this.retryTasks.length; i += 1) {
        let task = this.retryTasks[i]
        if (task.canRetry()) {
          this.retryTasks.splice(i, 1)
          this.logger.info(
            `Task retry; count: ${task.retryCount}; url: ${task.url};`
          )
          return task
        } else {
          this.retryTasks.splice(i, 1)
          i -= 1
          this.logger.error(
            `Task discard because of retry count max: ${
              task.retryCount
            }; url: ${task.url}`
          )
        }
      }
    }

    this.logger.error(`There is no task to get;`)
  }

  public destroy(): void {
    this.urlsDone = null
    this.urlsTodo = null
    this.pendingTasks.length = 0
    this.retryTasks.length = 0
    this.logger = null
    this.subscriptions.forEach(e => {
      e.unsubscribe()
    })
  }

  private initLogger() {
    this.logger = new Logger(Seeder.name)
  }

  private initUrls(sites: BlogSite[]) {
    sites.forEach(site => {
      this.urlsTodo[site.url] = [site.url]
      this.urlsDone[site.url] = []
    })
  }

  private initSubscriber() {
    const sub1 = this.taskSuccessSub.asObservable().subscribe(task => {
      this.success(task)
    })
    const sub2 = this.taskFailureSub.asObservable().subscribe(task => {
      this.failure(task)
    })
    const sub3 = this.taskAddMoreUrlsSub
      .asObservable()
      .subscribe(({ task, urls }) => {
        this.addMoreUrls(task, urls)
      })

    this.subscriptions.push(sub1, sub2, sub3)
  }

  private success(task: SiteTask): void {
    const urlsDone = this.urlsDone[task.domain]
    urlsDone.push(task.url)
    this.removePendingTask(task)

    this.logger.success(
      `task success; domain: ${task.domain}; url: ${
        task.url
      }; success count: ${this.computeDoneCount()}`
    )
  }

  private failure(task: SiteTask): void {
    this.removePendingTask(task)
    this.retryTasks.push(task)

    this.logger.warn(
      `task failure; domain: ${task.domain}; url: ${task.url}; retry count: ${
        task.retryCount
      }`
    )
  }

  private removePendingTask(task: SiteTask) {
    const index = this.pendingTasks.findIndex(e => e.equals(task))
    this.pendingTasks.splice(index, 1)
  }

  private computeDoneCount(): number {
    return Object.values(this.urlsDone).reduce((accu, curr) => {
      return accu + curr.length
    }, 0)
  }

  private addMoreUrls(task: SiteTask, urls: string[]): void {
    const urlsDone = this.urlsDone[task.domain]
    const urlsTodo = this.urlsTodo[task.domain]
    const uniqueUrls = Array.from(new Set(urls))
    // 不仅仅要排除掉 urlsDone和urlsTodo 还要排除掉 正在执行未结束的任务
    const todoUrls = uniqueUrls.filter(
      e =>
        urlsDone.indexOf(e) === -1 &&
        urlsTodo.indexOf(e) === -1 &&
        this.pendingTasks.findIndex(f => f.url === e) === -1
    )
    urlsTodo.push(...todoUrls)
  }
}
