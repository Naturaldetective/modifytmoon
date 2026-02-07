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
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../.env.production') })
}

const app = new Koa()

app.use(exceptionInterceptor())
   .use(koaBody())
   .use(faviconInterceptor())
   .use(router.routes())
   .use(koaStatic(path.resolve(__dirname, '../public')))

// --- 核心修改部分 ---

// 1. 只有在非 Vercel 环境下才手动启动服务器
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

// 2. 必须导出 app.callback()，这是给 Vercel 调用的句柄
export default app.callback()
