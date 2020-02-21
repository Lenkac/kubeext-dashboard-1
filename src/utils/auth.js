import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setKV(key, value) {
  return Cookies.set(key, value)
}

export function getKV(key) {
  return Cookies.get(key)
}

export function removeKV(key) {
  return Cookies.remove(key)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
