import { spider } from './spider/spider'
import { signIn } from './sign-in/signIn'

import * as debug from 'debug'
import * as schedule from 'node-schedule'

const debugSchedule = debug('Spider:Schedule')

// https://github.com/node-schedule/node-schedule
// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)
debugSchedule(`schedule loaded;`)
schedule.scheduleJob('11 58 12 * * *', async function() {
  debugSchedule(`schedule task beginning...`)
  await signIn()
  await spider()
})
