import { Subject, Subscription } from 'rxjs'
import * as assert from 'assert'
import { SiteTask } from '../tasks/SiteTask'
import { BlogSite } from '../models/Site'
import { TaskStatistics } from '../models/Statistics'

import * as debug from 'debug'
const seederDebug = debug('Spider:Seeder.ts')

/**
 * 负责URL管理 TODO 优先级获取
 *
 * @export
 * @class Seeder
 */
export class Seeder {
  private _urlsTodo: { [key: string]: string[] } = {}
  private _tasks: SiteTask[] = []

  private taskSuccessSub: Subject<SiteTask> = new Subject<SiteTask>()
  private taskFailureSub: Subject<SiteTask> = new Subject<SiteTask>()
  private taskAddMoreUrlsSub: Subject<{
    task: SiteTask
    urls: string[]
  }> = new Subject<{ task: SiteTask; urls: string[] }>()

  private subscriptions: Subscription[] = []

  constructor(private sites: BlogSite[]) {
    this.initUrls(sites)
    this.initSubscriber()
  }

  public complete(): boolean {
    return (
      Object.values(this._urlsTodo).every(arr => arr.length === 0) &&
      this._tasks.every(e => e.isCompleted())
    )
  }

  public getTask(): SiteTask {
    for (const domain of Object.keys(this._urlsTodo)) {
      if (this._urlsTodo[domain].length > 0) {
        const url = this._urlsTodo[domain].shift()
        seederDebug(`Get task success; domain: ${domain}; url: ${url};`)
        const task = new SiteTask({
          domain,
          url,
          selector: this.sites.find(e => e.url === domain).selector,
          successSub: this.taskSuccessSub,
          failureSub: this.taskFailureSub,
          addMoreUrlsSub: this.taskAddMoreUrlsSub
        })
        this._tasks.push(task)
        return task
      }
    }

    for (const task of this._tasks) {
      if (task.needRetry()) {
        task.retry()
        seederDebug(
          `Task retry; count: ${task.retryCount}; url: ${task.url};`
        )
        return task
      }
    }

    this.assertTasksStatus()

    return null
  }

  public destroy(): void {
    this._urlsTodo = null
    this._tasks.length = 0
    this.subscriptions.forEach(e => {
      e.unsubscribe()
    })
  }

  public getTaskStatistics(): TaskStatistics {
    return {
      siteCount: this.sites.length,
      pageCount: this.tasks.length,
      itemCount: this.tasks.reduce((accu, curr) => {
        accu += curr.insertItemCount
        return accu
      }, 0),
      retryCount: this.tasks.reduce((accu, curr) => {
        accu += curr.retryCount
        return accu
      }, 0),
    }
  }

  private toJSON() {
    return {
      tasks: this._tasks,
      urlsTodo: this._urlsTodo
    }
  }

  public inspect() {
    return this.toJSON()
  }

  get tasks(): SiteTask[] {
    return this._tasks
  }

  private initUrls(sites: BlogSite[]) {
    sites.forEach(site => {
      this._urlsTodo[site.url] = [site.url]
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
    seederDebug(
      `Task success; domain: ${task.domain}; url: ${task.url}; retry count: ${
        task.retryCount
      }; success count: ${this.computeDoneCount()}`
    )
  }

  private failure(task: SiteTask): void {
    if (task.isFailure()) {
      seederDebug(
        `Task failure; domain: ${task.domain}; url: ${task.url}; retry count: ${
          task.retryCount
        }`
      )
    }

    if (task.needRetry()) {
      seederDebug(
        `Task need retry; domain: ${task.domain}; url: ${
          task.url
        }; retry count: ${task.retryCount}`
      )
    }
  }

  private computeDoneCount(): number {
    return this._tasks.filter(e => e.isSuccess()).length
  }

  private addMoreUrls(task: SiteTask, urls: string[]): void {
    const urlsTodo = this._urlsTodo[task.domain]

    const uniqueUrls = Array.from(new Set(urls))
    const todoUrls = uniqueUrls.filter(
      e =>
        urlsTodo.indexOf(e) === -1 &&
        this._tasks.findIndex(f => f.url === e) === -1
    )
    urlsTodo.push(...todoUrls)

    this.assertUniqueUrls()
  }

  private assertUniqueUrls() {
    const allUrls = []
      .concat(...Object.values(this._urlsTodo))
      .concat(this._tasks.map(e => e.url))
    const allMustBeUnique = new Set(allUrls).size === allUrls.length
    assert(
      allMustBeUnique,
      `Urls with todoUrl and tasks has duplication when add more urls!`
    )
  }

  private assertTasksStatus() {
    const allNotNeddRetry = this._tasks.every(e => !e.needRetry())
    assert(allNotNeddRetry, 'Tasks has someone to need retry!')
  }
}
