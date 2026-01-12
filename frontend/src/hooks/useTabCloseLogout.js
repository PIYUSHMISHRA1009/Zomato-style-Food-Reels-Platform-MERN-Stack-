import { useEffect } from 'react'

/**
 * Logout on tab/window close using keepalive requests.
 * role: 'user' | 'foodPartner'
 */
export default function useTabCloseLogout(role, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const url = role === 'foodPartner'
      ? 'http://localhost:3000/api/auth/food-partner/logout'
      : 'http://localhost:3000/api/auth/user/logout'

    const send = () => {
      try {
        // Use fetch with keepalive so the request is sent even during unload
        fetch(url, { method: 'GET', credentials: 'include', keepalive: true })
      } catch (_) {}
    }

    // pagehide is recommended over beforeunload for reliability
    const onPageHide = (e) => {
      // Avoid BFCache restores; only act on non-persisted hides
      if (e.persisted) return
      send()
    }

    // In case some browsers skip pagehide, use visibilitychange fallback
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        send()
      }
    }

    window.addEventListener('pagehide', onPageHide)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      window.removeEventListener('pagehide', onPageHide)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [role, enabled])
}
