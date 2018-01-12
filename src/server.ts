import * as koa from 'koa'
import * as Router from 'koa-router'

// import { main } from './index'
import { debugError } from './lib/Helper'

const app = new koa()
const router = new Router()

app.use(async (_, next) => {
  try {
    await next()
  } catch (e) {
    debugError(e)
  }
})

router.get('/*', async ctx => {
  // main()
  ctx.body = 'Spider beginning...'
})

app.use(router.routes())
app.listen(3000, () => {
  console.log(`Server listening on port 3000!!!`)
})
