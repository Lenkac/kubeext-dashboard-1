import request from '@/utils/request'
import {getListURL, getMetaDataURL} from '@/utils/url-setter'

export function getIp(viewerName,userName){
  console.log(userName)
  return "39.96.4.11"
}

export function getListAllData(listQuery) {
  var res = request({
    url: getListURL(listQuery.viewerName),
    method: 'POST',
    params: listQuery
  })
  return res
}

export function getColumns(query) {
  var res = request({
    url: getMetaDataURL(),
    method: 'get',
    params: query
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

export function getListQuery(query) {
  var res = request({
    url: '/list/getQueryParameter',
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

export function getGrafanaLink(query) {
  var res = request({
    url: '/getGrafanaLink',
    method: 'get',
    params: query
  })
  return res
}

export function getMonitorInfo(query) {
  var res = request({
    url: 'http://localhost:32000/kubesys/v1/monitor/getMonitorInfo',
    method: 'get',
    params: query
  })
  return res
}

export function getAllTaskData(listQuery) {
  var res = request({
    url: '/list/getList',
    method: 'get',
    params: listQuery
  })
  return res
}