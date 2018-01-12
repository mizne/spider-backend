import * as koa from 'koa'
import * as Router from 'koa-router'

// import { main } from './index'
import { debugError } from './lib/Helper'

const app = new koa()
const router = new Router()

const PORT = parseInt(
  process.env.LEANCLOUD_APP_PORT || process.env.PORT || '3000'
)

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
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!!!`)
})
