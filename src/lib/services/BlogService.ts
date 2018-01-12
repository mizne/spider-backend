import axios from 'axios'
import * as debug from 'debug'
import { debugError } from '../Helper'
import { Blog } from '../models/Blog'
const serviceDebug = debug('Spider:BlogService.ts')

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
  constructor() {}
  public async find(where: any): Promise<Blog[]> {
    const resp = await http.get('classes/Blog', {
      params: {
        where
      }
    })
    return resp.data.results
  }

  public async batchSave(items: Blog[]): Promise<any> {
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

  public async batchInsertIfNotIn(items: Blog[]): Promise<number> {
    try {
      const urls = items.map(e => e.url)
      const existResults = await this.find({
        url: { $in: urls }
      })
      .catch((e) => {
        serviceDebug(`Batch find item failure; err: ${e.message};`)
        return [] as Blog[]
      })
      const needInsertItems = items.filter(
        item => !existResults.find(exist => exist.url === item.url)
      )
      if (needInsertItems.length > 0) {
        await this.batchSave(needInsertItems)
        serviceDebug(`Batch insert success; count: ${needInsertItems.length};`)
        return needInsertItems.length
      }
    } catch (e) {
      serviceDebug(`Batch insert failure; err: ${e};`)
    }
    return 0
  }
}
