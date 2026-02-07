import Router from 'koa-router'
import { Octokit } from 'octokit' // 【新增】导入 GitHub SDK
import { R, encryptId } from '../utils'

// 【新增】初始化 GitHub 客户端及环境变量
const octokit = new Octokit({ auth: process.env.GH_TOKEN })
const [owner, repo] = (process.env.GH_REPO || '').split('/')
const branch = process.env.GH_BRANCH || 'main'

const ID_REG = /^\w{5,64}$/

export const router = new Router()

// --- 接口 1: 同步/保存配置 ---
router.post('/sync', async (ctx) => {
  let { id, data, secretId } = ctx.request.body

  if (secretId && (secretId as string).length !== 64)
    throw new Error('illegal secretId')

  if (!ID_REG.test(id))
    throw new Error(`illegal id: ${id}`)

  if (!data.data || !data.settings)
    throw new Error('illegal data')

  id = secretId || encryptId(id)

  // 【修改开始】由原来的 fs.writeFile 改为 GitHub API 操作
  const filePath = `public/data/${id}.json` 
  const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64') // Git 要求 base64

  try {
    // 1. Git 修改必须带上旧文件的 sha 校验值，所以先尝试获取
    let sha
    try {
      const { data: existingFile }: any = await octokit.rest.repos.getContent({
        owner, repo, path: filePath, ref: branch,
      })
      sha = existingFile.sha
    } catch (e) {
      // 文件不存在则不传 sha，视为新建
    }

    // 2. 提交更新到 GitHub 仓库
    await octokit.rest.repos.createOrUpdateFileContents({
      owner, repo, path: filePath, branch,
      message: `sync: update config for ${id}`,
      content,
      sha, // 如果是更新，必须传这个“指针”
    })

    ctx.body = R.ok({ id })
  } catch (error: any) {
    throw new Error(`GitHub Sync Failed: ${error.message}`)
  }
  // 【修改结束】
})

// --- 接口 2: 读取配置 ---
router.get('/sync/:id', async (ctx) => {
  let { id } = ctx.params
  if (!ID_REG.test(id))
    throw new Error(`illegal id: ${id}`)

  if (id.length < 64)
    id = encryptId(id)

  // 【修改开始】由原来的 fs.readFile 改为从 GitHub 获取内容
  const filePath = `public/data/${id}.json`

  try {
    const { data: fileData }: any = await octokit.rest.repos.getContent({
      owner, repo, path: filePath, ref: branch,
    })

    // GitHub 返回的是 Base64 编码的字符串，需要转回文本并解析 JSON
    const jsonStr = Buffer.from(fileData.content, 'base64').toString('utf-8')
    const data = JSON.parse(jsonStr)

    ctx.body = R.ok({ data, id })
  } catch (error: any) {
    // 如果找不到文件，GitHub 会报 404
    throw new Error(`Config not found on GitHub: ${ctx.params.id}`)
  }
  // 【修改结束】
})
