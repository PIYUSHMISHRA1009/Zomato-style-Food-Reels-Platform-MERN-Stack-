import axios from 'axios'
import { logoutAll, redirectAfterLogout } from './auth'

// Always include cookies
axios.defaults.withCredentials = true

// Response interceptor to auto-logout on 401/403
axios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status
    if (status === 401 || status === 403) {
      try {
        await logoutAll()
      } finally {
        redirectAfterLogout(window.location.pathname)
      }
    }
    return Promise.reject(error)
  }
)

export default axios
