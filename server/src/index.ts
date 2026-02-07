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

// --- 适配 Vercel 的核心逻辑 ---

// 在 Vercel 环境下，不要运行 app.listen()
// 只有在本地开发时才手动监听端口
if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`本地环境运行在: http://localhost:${port}`)
  })
}

// 关键！必须导出回调函数，Vercel 才能把请求传给 Koa
export default app.callback()
