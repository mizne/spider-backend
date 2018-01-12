import { Subject } from 'rxjs'
import * as uuid from 'uuid'
import { BlogSelector } from '../models/Site'

const MAX_RETRY_COUNT = 5

export enum SiteTaskStatus {
  PEDDING = 'PEDDING',
  SUCCESS = 'SUCCESS',
  TO_RETRY = 'TO_RETRY',
  FAILURE = 'FAILURE'
}

export interface SiteTaskOptions {
  domain: string
  url: string
  html?: string
  selector: BlogSelector
  successSub: Subject<SiteTask>
  failureSub: Subject<SiteTask>
  addMoreUrlsSub: Subject<{ task: SiteTask; urls: string[] }>
}

export class SiteTask {
  private _id: string
  private _domain: string
  private _url: string
  private _html: string
  private _selector: BlogSelector
  private _successSub: Subject<SiteTask>
  private _failureSub: Subject<SiteTask>
  private _addMoreUrlsSub: Subject<{ task: SiteTask; urls: string[] }>
  private _retryCount = 0
  private _status = SiteTaskStatus.PEDDING

  constructor(options: SiteTaskOptions) {
    this._id = uuid.v4()
    this._domain = options.domain
    this._url = options.url
    this._html = options.html || ''
    this._selector = options.selector

    this._successSub = options.successSub
    this._failureSub = options.failureSub
    this._addMoreUrlsSub = options.addMoreUrlsSub
  }

  public success() {
    this._status = SiteTaskStatus.SUCCESS
    this._successSub.next(this)
  }

  public failure() {
    if (this._retryCount >= MAX_RETRY_COUNT) {
      this._status = SiteTaskStatus.FAILURE
    } else {
      this._status = SiteTaskStatus.TO_RETRY
    }
    this._failureSub.next(this)
  }

  public retry() {
    this._retryCount += 1
    this._status = SiteTaskStatus.PEDDING
  }

  public isCompleted(): boolean {
    return this.isSuccess() || this.isFailure()
  }

  public isSuccess(): boolean {
    return this._status === SiteTaskStatus.SUCCESS
  }

  public isFailure(): boolean {
    return this._status === SiteTaskStatus.FAILURE
  }

  public isPedding(): boolean {
    return this._status === SiteTaskStatus.PEDDING
  }

  public addMoreUrls(urls: string[]) {
    this._addMoreUrlsSub.next({
      task: this,
      urls
    })
  }

  public equals(anohter: SiteTask): boolean {
    return this._id === anohter._id
  }

  public needRetry(): boolean {
    return this._status === SiteTaskStatus.TO_RETRY
  }

  private toJSON() {
    return {
      id: this._id,
      url: this._url,
      domain: this._domain,
      retryCount: this._retryCount,
      html: this._html,
      status: this._status
    }
  }

  public inspect() {
    return this.toJSON()
  }

  get id(): string {
    return this._id
  }

  get domain(): string {
    return this._domain
  }
  get url(): string {
    return this._url
  }

  get html(): string {
    return this._html
  }

  set html(v: string) {
    this._html = v
    if (v) {
      this.success()
    } else {
      this.failure()
    }
  }

  get selector(): BlogSelector {
    return this._selector
  }

  get retryCount(): number {
    return this._retryCount
  }

  get status(): SiteTaskStatus {
    return this._status
  }
}
