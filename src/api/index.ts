import ky from 'ky'

const api = ky.extend({
  // 即使环境变量为空，也默认走 /api，配合 vercel.json 的 rewrite
  prefixUrl: import.meta.env.VITE_API_BASE || '/api', 
})

export function reqPostData(data: { id?: string; secretId?: string; data: any }) {
  return api.post('sync', { json: data }).json()
}

export function reqGetData(id: string) {
  return api.get(`sync/${id}`).json()
}
