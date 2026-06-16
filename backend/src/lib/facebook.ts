import crypto from 'crypto'
import { env } from '../config/env'
import { AppError } from '../middleware/errorHandler'

const GRAPH_API_VERSION = 'v19.0'

export interface FacebookProfile {
  id: string
  name: string
  email?: string
}

/**
 * Verifies a Facebook user access token and returns the associated profile.
 * Uses appsecret_proof (when FACEBOOK_APP_SECRET is set) so the Graph API
 * also confirms the token was issued for our app.
 */
export async function fetchFacebookProfile(accessToken: string): Promise<FacebookProfile> {
  const params = new URLSearchParams({
    fields: 'id,name,email',
    access_token: accessToken,
  })

  if (env.facebookAppSecret) {
    params.set(
      'appsecret_proof',
      crypto.createHmac('sha256', env.facebookAppSecret).update(accessToken).digest('hex')
    )
  }

  const response = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/me?${params.toString()}`)
  const data = (await response.json()) as { id?: string; name?: string; email?: string; error?: unknown }

  if (!response.ok || data.error || !data.id || !data.name) {
    throw new AppError('Invalid Facebook access token', 401)
  }

  return { id: data.id, name: data.name, email: data.email }
}
