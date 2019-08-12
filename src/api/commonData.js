import request from '@/utils/request'
import {getListURL, getMetaDataURL,getParameterURL} from '@/utils/url-setter'

export function getIp(viewerName,userName){
  console.log(userName)
  return "39.96.4.11"
}

// export function getAllTaskData(listQuery) {
//   var res = request({
//     url: '/list/getList',
//     method: 'get',
//     params: listQuery
//   })
//   return res
// }

export function getListQuery(viewerName,ip) {
  var res = request({
    url: getParameterURL(),
    method: 'get',
    params:{
      "viewerName": viewerName,
      "ip": ip
    }
  })
  return res
}

export function getListAllData(data) {
  return request({
    url: getListURL(data.viewerName),
    method: 'post',
    data
  })
}

export function getColumns(viewerName,objectName) {
  var res = request({
    url: getMetaDataURL(),
    method: 'get',
    params: {
      "viewerName": viewerName,
      "objectName": objectName
    }
  })
  return res
}

export function getActions(query) {
  var res = request({
    url: '/list/getActions',
    method: 'get',
    params: query
  })
  return res
}

export function getFilterForm(query) {
  var res = request({
    url: '/list/getFilterForm',
    method: 'get',
    params: query
  })
  return res
}

export function getLittleDataSource(query) {
  var res = request({
    url: '/list/getLittleDataSource',
    method: 'get',
    params: query
  })
  return res
}

export function getRules(query) {
  var res = request({
    url: '/list/getRules',
    method: 'get',
    params: query
  })
  return res
}

export function getTemp(query) {
  var res = request({
    url: '/list/getTemp',
    method: 'get',
    params: query
  })
  return res
}