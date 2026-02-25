<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { oktaAuth } from '@/utils/okta'

const router = useRouter()

onMounted(async () => {
  try {
    const { tokens } = await oktaAuth.token.parseFromUrl()
    oktaAuth.tokenManager.setTokens(tokens)

    const originalUri = oktaAuth.getOriginalUri()
    if (originalUri) {
      oktaAuth.removeOriginalUri()
      router.replace(originalUri)
    }
    else {
      router.replace('/')
    }
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Okta] 回调处理失败', error)
    router.replace('/')
  }
})
</script>

<template>
  <div flex items-center justify-center h-screen>
    <span>正在完成登录，请稍候...</span>
  </div>
</template>

<route lang="yaml">
path: /callback
</route>

