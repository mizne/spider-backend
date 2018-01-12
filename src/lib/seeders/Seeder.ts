import { Subject, Subscription } from 'rxjs'
import * as assert from 'assert'
import { SiteTask } from '../tasks/SiteTask'
import { BlogSite } from '../models/Site'

import * as debug from 'debug'
const seederDebug = debug('Spider:Seeder.ts')

/**
 * 负责URL管理 TODO 优先级获取
 *
 * @export
 * @class Seeder
 */
export class Seeder {
  private urlsTodo: { [key: string]: string[] } = {}
  private tasks: SiteTask[] = []

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
      Object.values(this.urlsTodo).every(arr => arr.length === 0) &&
      this.tasks.every(e => e.isCompleted())
    )
  }

  public getTask(): SiteTask {
    for (const domain of Object.keys(this.urlsTodo)) {
      if (this.urlsTodo[domain].length > 0) {
        const url = this.urlsTodo[domain].shift()
        seederDebug(`Get task success; domain: ${domain}; url: ${url};`)
        const task = new SiteTask({
          domain,
          url,
          selector: this.sites.find(e => e.url === domain).selector,
          successSub: this.taskSuccessSub,
          failureSub: this.taskFailureSub,
          addMoreUrlsSub: this.taskAddMoreUrlsSub
        })
        this.tasks.push(task)
        return task
      }
    }

    for (const task of this.tasks) {
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
    this.urlsTodo = null
    this.tasks.length = 0
    this.subscriptions.forEach(e => {
      e.unsubscribe()
    })
  }

  private toJSON() {
    return {
      tasks: this.tasks,
      urlsTodo: this.urlsTodo
    }
  }

  public inspect() {
    return this.toJSON()
  }

  private initUrls(sites: BlogSite[]) {
    sites.forEach(site => {
      this.urlsTodo[site.url] = [site.url]
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
    return this.tasks.filter(e => e.isSuccess()).length
  }

  private addMoreUrls(task: SiteTask, urls: string[]): void {
    const urlsTodo = this.urlsTodo[task.domain]

    const uniqueUrls = Array.from(new Set(urls))
    const todoUrls = uniqueUrls.filter(
      e =>
        urlsTodo.indexOf(e) === -1 &&
        this.tasks.findIndex(f => f.url === e) === -1
    )
    urlsTodo.push(...todoUrls)

    this.assertUniqueUrls()
  }

  private assertUniqueUrls() {
    const allUrls = []
      .concat(...Object.values(this.urlsTodo))
      .concat(this.tasks.map(e => e.url))
    const allMustBeUnique = new Set(allUrls).size === allUrls.length
    assert(
      allMustBeUnique,
      `Urls with todoUrl and tasks has duplication when add more urls!`
    )
  }

  private assertTasksStatus() {
    const allNotNeddRetry = this.tasks.every(e => !e.needRetry())
    assert(allNotNeddRetry, 'Tasks has someone to need retry!')
  }
}
