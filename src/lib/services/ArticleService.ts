import { Article } from '../models/Article'
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

export class ArticleService {
  private logger: Logger
  constructor() {
    this.logger = new Logger(ArticleService.name)
  }
  async find(where: any): Promise<Article[]> {
    const resp = await http.get('classes/Article', {
      params: {
        where
      }
    })
    return resp.data.results
  }

  async batchSave(items: Article[]): Promise<any> {
    const params = {
      requests: items.map(e => ({
        method: 'POST',
        path: '/1.1/classes/Article',
        body: e
      }))
    }
    const resp = await http.post('batch', params)
    return resp.data
  }

  async batchInsertIfNotIn(items: Article[]): Promise<any> {
    const urls = items.map(e => e.url)
    const existResults = await this.find({
      url: { $in: urls }
    })
    this.logger.info(`exist news length: ${existResults.length}`)
    const needInsertItems = items.filter(
      item => !existResults.find(exist => exist.url === item.url)
    )
    this.logger.info(`need insert items length: ${needInsertItems.length}`)
    const resp = await this.batchSave(needInsertItems)
    this.logger.success(`batch insert success`)
    return resp
  }
}
