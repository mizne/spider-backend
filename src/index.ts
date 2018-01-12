import * as debug from 'debug'
import { BlogSpider } from './custom/BlogSpider'
import { sites } from './config/sites'
import { SmsService } from './lib/services/SmsService'

const debugIndex = debug('Spider:index.ts')

const main = async () => {
  new BlogSpider(sites)
    .run()
    .then(statistics => {
      debugIndex(`run success; statictics: `, statistics)
      new SmsService().sendSuccessSms(statistics)
    })
    .catch(e => {
      debugIndex(`run error; e: ${e.message};`)
      new SmsService().sendFailureSms(e.message)
    })
}

export { main }
