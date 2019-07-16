import request from '@/utils/request'
import { getUrlPrefix } from '@/utils/url-setter'

export function login(data) {
  return request({
    url: getUrlPrefix() + 'user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  var res = request({
    url: getUrlPrefix() + 'user/info',
    method: 'get',
    params: { token }
  })
  console.log('user info:', res)
  return res
}

export function logout(token) {
  return request({
    url: '/user/logout',
    method: 'post',
    params: { token }
  })
}
