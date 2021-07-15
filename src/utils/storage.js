import { AUTH_DATA, REDIRECT_URL } from 'config/base'

export function setItem(key, value) {
  localStorage.setItem(key, value)
}

export function getItem(key) {
  return localStorage.getItem(key)
}

export function removeItem(key) {
  localStorage.removeItem(key)
}

export function getAuthData() {
  const authData = getItem(AUTH_DATA)

  return authData ? JSON.parse(authData) : null
}

export function setAuthData(data) {
  setItem(AUTH_DATA, JSON.stringify(data))
}

export function clearAuthData() {
  removeItem(AUTH_DATA)
  removeItem(REDIRECT_URL)
}
