import request from '@/utils/request'
import {getListURL, getMetaDataURL,getParameterURL,getJsonDataURL,updateJsonDataURL,getCreateSthURL,getDeleteSthURL} from '@/utils/url-setter'

export function getIp(viewerName,userName){
  console.log(userName)
  return "133.133.135.35"
  //return "39.96.4.11"
}


export function getListAllData(data) {
  return request({
    url: getListURL(),
    method: 'get',
    params: {
      "kind": data.viewerName,
    }
  })
}

export function getColumns(viewerName) {
  var res = request({
    url: getMetaDataURL(),
    method: 'get',
    params: {
      "kind": viewerName,
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

export function getPodActions(query) {
  var res = request({
    url: '/list/getPodActions',
    method: 'get',
    params: query
  })
  return res
}

export function getVMActions(query) {
  var res = request({
    url: '/list/getVMActions',
    method: 'get',
    params: query
  })
  return res
}

export function getJsonData(query) {
  var res = request({
    // url: '/list/getJsonData',
    url: getJsonDataURL(),
    method: 'get',
    params: query
  })
  return res
}

export function updateJsonData(data) {
  var res = request({
    // url: '/list/getJsonData',
    url: updateJsonDataURL(),
    method: 'post',
    data
  })
  return res
}

export function createSthFromTemplate(data) {
  var res = request({
    // url: '/list/getJsonData',
    url: getCreateSthURL(),
    method: 'post',
    data
  })
  return res
}

export function deleteSthFromTemplate(data) {
  var res = request({
    // url: '/list/getJsonData',
    url: getDeleteSthURL(),
    method: 'post',
    data
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