import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  var res = request({
    url: '/user/info',
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
