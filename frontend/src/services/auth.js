// Centralized logout helpers for both roles

export async function logoutUser() {
  try {
    await fetch('http://localhost:3000/api/auth/user/logout', {
      method: 'GET',
      credentials: 'include',
    })
  } catch (_) {
    // ignore
  }
}

export async function logoutFoodPartner() {
  try {
    await fetch('http://localhost:3000/api/auth/food-partner/logout', {
      method: 'GET',
      credentials: 'include',
    })
  } catch (_) {
    // ignore
  }
}

export async function logoutAll() {
  // Try both; whichever applies will clear the cookie
  await Promise.allSettled([
    fetch('http://localhost:3000/api/auth/user/logout', {
      method: 'GET',
      credentials: 'include',
    }),
    fetch('http://localhost:3000/api/auth/food-partner/logout', {
      method: 'GET',
      credentials: 'include',
    })
  ])
}

export function redirectAfterLogout(pathname) {
  // Route-aware redirect
  const isFP = pathname.startsWith('/food-partner')
  const target = isFP ? '/food-partner/login' : '/user/login'
  window.location.replace(target)
}
