import request from '@/utils/request'

import { getUrlPrefix } from '@/utils/url-setter'

export function getAllTaskData(listQuery) {
  var res = request({
    url: getUrlPrefix()+'/list/getList',
    method: 'get',
    params: listQuery
  })
  return res
}

export function getListAllData(listQuery) {
  var res = request({
    url: getUrlPrefix()+'/list/getList',
    method: 'get',
    params: listQuery
  })
  return res
}

export function getColumns(query) {
  var res = request({
    url: getUrlPrefix()+'/list/getColumns',
    method: 'get',
    params: query
  })
  return res
}

export function getActions(query) {
  var res = request({
    url: getUrlPrefix()+'/list/getActions',
    method: 'get',
    params: query
  })
  return res
}

export function getFilterForm(query) {
  var res = request({
    url: getUrlPrefix()+'/list/getFilterForm',
    method: 'get',
    params: query
  })
  return res
}

export function getLittleDataSource(query) {
  var res = request({
    url: getUrlPrefix()+'/list/getLittleDataSource',
    method: 'get',
    params: query
  })
  return res
}

export function getListQuery(query) {
  var res = request({
    url: getUrlPrefix()+'/list/getQueryParameter',
    method: 'get',
    params: query
  })
  return res
}

export function getRules(query) {
  var res = request({
    url: getUrlPrefix()+'/list/getRules',
    method: 'get',
    params: query
  })
  return res
}

export function getTemp(query) {
  var res = request({
    url: getUrlPrefix()+'/list/getTemp',
    method: 'get',
    params: query
  })
  return res
}