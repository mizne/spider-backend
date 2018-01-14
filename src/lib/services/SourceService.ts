import axios from 'axios'
import * as debug from 'debug'
import { Blog } from '../models/Blog'
import { LEAN_API } from '../../../config/api'

const serviceDebug = debug('Spider:SourceService.ts')
const http = axios.create({
  baseURL: `https://${LEAN_API.APP_ID.slice(0, 8)}.api.lncld.net/1.1/`,
  headers: {
    'X-LC-Id': LEAN_API.APP_ID,
    'X-LC-Key': LEAN_API.APP_KEY
  }
})

export class SourceService {
  constructor() {}
  public async find(where: any): Promise<Blog[]> {
    const resp = await http.get('classes/Source', {
      params: {
        where
      }
    })
    return resp.data.results
  }

  public async insert(source: string): Promise<any> {
    const resp = await http.post('classes/Source', {
      source
    })
    return resp.data.results
  }

  public async insertIfNotIn(source: string): Promise<any> {
    try {
      const existResults = await this.find({
        source
      })
      if (existResults.length > 0) {
        return false
      }
      await this.insert(source)
      serviceDebug(`Insert if not in success; source: ${source};`)
      return true
    } catch (e) {
      serviceDebug(`Insert if not in failure; err: ${e.message};`)
    }
    return false
  }
}
