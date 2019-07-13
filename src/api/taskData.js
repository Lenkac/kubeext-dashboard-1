import request from '@/utils/request'

export function getAllTaskData() {
  var res = request({
    url: '/taskData/getAllTaskData',
    method: 'get'
  })
  console.log('user info:', res)
  return res
}
