import * as debug from 'debug'
import { BlogSpider } from '../../custom/BlogSpider'
import { sites } from '../../../config/sites'
import { SmsService } from '../../lib/services/SmsService'

const debugSpider = debug('Spider:spider.ts')

const spider = async () => {
  new BlogSpider(sites)
    .run()
    .then(statistics => {
      debugSpider(`Spider run success; statictics: `, statistics)
      new SmsService().spiderSuccess(statistics)
    })
    .catch(e => {
      debugSpider(`Spider run error; e: ${e.message};`)
      new SmsService().spiderFailure(e.message)
    })
}

export { spider }
