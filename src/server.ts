import * as koa from 'koa'
import * as Router from 'koa-router'
import * as debug from 'debug'
import { debugError } from './lib/Helper'
import { spider } from './schedules/spider/spider'
import { signIn } from './schedules/sign-in/signIn'
import './schedules'

const app = new koa()
const router = new Router()
const debugServer = debug('Spider:Server')

const PORT = 3000

app.use(async (_, next) => {
  try {
    await next()
  } catch (e) {
    debugError(e)
  }
})

router.get('/sign-in', async ctx => {
  signIn()
  ctx.body = 'SignIn beginning...'
})

router.get('/spider', async ctx => {
  spider()
  ctx.body = 'Spider beginning...'
})

app.use(router.routes())
app.listen(PORT, () => {
  debugServer(`Server listening on port ${PORT}!!!`)
})
