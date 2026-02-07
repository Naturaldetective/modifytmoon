import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Koa from 'koa'
import { koaBody } from 'koa-body'
import koaStatic from 'koa-static'
import dotenv from 'dotenv'
import { router } from './router'
import { exceptionInterceptor, faviconInterceptor } from './middleware'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app = new Koa()

// 中间件保持不变
app.use(exceptionInterceptor())
   .use(koaBody())
   .use(faviconInterceptor())
   .use(router.routes())
   .use(koaStatic(path.resolve(__dirname, '../public')))


if (!process.env.VERCEL) {
  app.listen(3000, () => console.log('Running locally...'))
}

// 增加一个简单的日志中间件，用来在 Vercel Logs 里排查路径
app.use(async (ctx, next) => {
  console.log(`[DEBUG] Request Path: ${ctx.path}, Method: ${ctx.method}`);
  await next();
});

export default app.callback()
