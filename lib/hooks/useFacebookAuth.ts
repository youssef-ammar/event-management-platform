'use client'

import { useCallback } from 'react'

declare global {
  interface Window {
    FB?: {
      init: (params: { appId: string; cookie?: boolean; xfbml?: boolean; version: string }) => void
      login: (
        callback: (response: { authResponse?: { accessToken: string } }) => void,
        options?: { scope: string }
      ) => void
    }
    fbAsyncInit?: () => void
  }
}

const FB_SDK_URL = 'https://connect.facebook.net/fr_FR/sdk.js'
const FB_SDK_VERSION = 'v19.0'
const FB_SDK_SCRIPT_ID = 'facebook-jssdk'

function loadFacebookSdk(appId: string): Promise<void> {
  return new Promise((resolve) => {
    if (window.FB) {
      resolve()
      return
    }

    window.fbAsyncInit = () => {
      window.FB?.init({ appId, cookie: true, xfbml: false, version: FB_SDK_VERSION })
      resolve()
    }

    if (document.getElementById(FB_SDK_SCRIPT_ID)) return

    const script = document.createElement('script')
    script.id = FB_SDK_SCRIPT_ID
    script.src = FB_SDK_URL
    script.async = true
    script.defer = true
    document.body.appendChild(script)
  })
}

/**
 * Triggers the Facebook Login popup via the Facebook JS SDK and resolves
 * with a user access token, which can be exchanged for an app session via
 * POST /api/auth/facebook.
 */
export function useFacebookAuth() {
  const loginWithFacebook = useCallback(async (): Promise<string> => {
    const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID
    if (!appId) {
      throw new Error('La connexion Facebook n\'est pas configurée')
    }

    await loadFacebookSdk(appId)

    return new Promise<string>((resolve, reject) => {
      window.FB?.login(
        (response) => {
          if (response.authResponse?.accessToken) {
            resolve(response.authResponse.accessToken)
          } else {
            reject(new Error('Connexion Facebook annulée'))
          }
        },
        { scope: 'public_profile,email' }
      )
    })
  }, [])

  return { loginWithFacebook }
}
