import { Blog } from '../models/Blog'
import axios from 'axios'
import { Logger } from '../../utils/Logger'

// class NewsService extends BaseService {}
var APP_ID = 'n2WB91RtFeJWLLDJA6KPdXSe-gzGzoHsz'
var APP_KEY = 'oIIWpUWlszGyQ8lI2sJOIThe'
var AV = require('leancloud-storage')

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
})

var http = axios.create({
  baseURL: 'https://n2wb91rt.api.lncld.net/1.1/',
  headers: {
    'X-LC-Id': APP_ID,
    'X-LC-Key': APP_KEY
  }
})

export class BlogService {
  private logger: Logger
  constructor() {
    this.logger = new Logger(BlogService.name)
  }
  async find(where: any): Promise<Blog[]> {
    const resp = await http.get('classes/Blog', {
      params: {
        where
      }
    })
    return resp.data.results
  }

  async batchSave(items: Blog[]): Promise<any> {
    const params = {
      requests: items.map(e => ({
        method: 'POST',
        path: '/1.1/classes/Blog',
        body: e
      }))
    }
    const resp = await http.post('batch', params)
    return resp.data
  }

  async batchInsertIfNotIn(items: Blog[]): Promise<any> {
    const urls = items.map(e => e.url)
    const existResults = await this.find({
      url: { $in: urls }
    })
    this.logger.info(`exist blogs length: ${existResults.length}`)
    const needInsertItems = items.filter(
      item => !existResults.find(exist => exist.url === item.url)
    )
    this.logger.info(`need insert blogs length: ${needInsertItems.length}`)
    const resp = await this.batchSave(needInsertItems)
    this.logger.success(`batch insert success`)
    return resp
  }
}
