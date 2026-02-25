import { OktaAuth } from '@okta/okta-auth-js'

const issuer = import.meta.env.VITE_OKTA_ISSUER
const clientId = import.meta.env.VITE_OKTA_CLIENT_ID

if (!issuer || !clientId) {
  // eslint-disable-next-line no-console
  console.warn('[Okta] VITE_OKTA_ISSUER 或 VITE_OKTA_CLIENT_ID 未配置，将无法完成登录')
}

export const oktaAuth = new OktaAuth({
  issuer,
  clientId,
  redirectUri: `${window.location.origin}/callback`,
  scopes: ['openid', 'profile', 'email'],
  pkce: true,
})

export async function isAuthenticated(): Promise<boolean> {
  const tokens = await oktaAuth.tokenManager.getTokens()
  const hasIdToken = Boolean((tokens as any).idToken)
  const hasAccessToken = Boolean((tokens as any).accessToken)
  return hasIdToken || hasAccessToken
}

export async function getAccessToken(): Promise<string | undefined> {
  const tokens = await oktaAuth.tokenManager.getTokens()
  return (tokens as any).accessToken?.accessToken
}

