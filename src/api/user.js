import request from '@/utils/request'
import { getUrlPerfix } from '@/utils/url-setter'

export function login(data) {
  return request({
    url: getUrlPerfix() + 'user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  var res = request({
    url: getUrlPerfix() + 'user/info',
    method: 'get',
    params: { token }
  })
  console.log('user info:', res)
  return res
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
