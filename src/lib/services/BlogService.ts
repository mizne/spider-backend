import axios from 'axios'
import * as debug from 'debug'
import { Blog } from '../models/Blog'
import { LEAN_API } from '../../../config/api'

const serviceDebug = debug('Spider:BlogService.ts')
const http = axios.create({
  baseURL: 'https://wkwmwlkk.api.lncld.net/1.1/',
  headers: {
    'X-LC-Id': LEAN_API.APP_ID,
    'X-LC-Key': LEAN_API.APP_KEY
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
      let existResults: any[]
      try {
        existResults = await this.find({
          url: { $in: urls }
        })
      } catch(e) {
        serviceDebug(`Batch find item failure; err: ${e.message};`)
        return 0
      }
      
      const needInsertItems = items.filter(
        item => !existResults.find(exist => exist.url === item.url)
      )
      if (needInsertItems.length > 0) {
        await this.batchSave(needInsertItems)
        serviceDebug(`Batch insert success; count: ${needInsertItems.length};`)
        return needInsertItems.length
      }
    } catch (e) {
      serviceDebug(`Batch insert failure; err: ${e.message};`)
    }
    return 0
  }
}
