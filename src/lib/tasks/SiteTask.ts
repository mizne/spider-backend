import { Subject } from 'rxjs'
import * as uuid from 'uuid'
import { BlogSelector } from '../models/site.model'

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

  success() {
    this._successSub.next(this)
  }

  failure() {
    this._failureSub.next(this)
  }

  addMoreUrls(urls: string[]) {
    this._addMoreUrlsSub.next({
      task: this,
      urls
    })

    this.destroy()
  }

  private destroy() {
    this._id = null
    this._domain = null
    this._url = null
    this._html = null
    this._selector = null
    this._successSub = null
    this._failureSub = null
    this._addMoreUrlsSub = null
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
  }

  get selector(): BlogSelector {
    return this._selector
  }
}
