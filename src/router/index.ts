import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import { isAuthenticated, oktaAuth } from '@/utils/okta'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  // Okta 回调路径无需拦截
  if (to.path === '/callback')
    return next()

  try {
    const authed = await isAuthenticated()
    if (authed)
      return next()

    // 未认证，重定向到 Okta 登录
    await oktaAuth.signInWithRedirect({ originalUri: to.fullPath })
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Okta] 跳转登录失败', error)
    next(false)
  }
})

export default router
