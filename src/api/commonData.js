import request from '@/utils/request'
import {getScheduleURL,getGetSthURL,queryOperationURL, getListURL, getMetaDataURL,getParameterURL,getJsonDataURL,updateJsonDataURL,getCreateSthURL,getUpdateSthURL,getDeleteSthURL} from '@/utils/url-setter'
export function getListAllData(data) {
  return request({
    url: getListURL(),
    method: 'get',
    params: {
      "kind": data.viewerName,
      "name": data.name,
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


export function getVMActions(query) {
  var res = request({
    url: '/list/getVMActions',
    method: 'get',
    params: query
  })
  return res
}

export function getScheduleData(data) {
  var res = request({
    url: getScheduleURL(),
    method: 'post',
    data
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

export function updateSthFromTemplate(data) {
  var res = request({
    // url: '/list/getJsonData',
    url: getUpdateSthURL(),
    method: 'post',
    data
  })
  return res
}

export function deletSthFromTemplate(data) {
  var res = request({
    // url: '/list/getJsonData',
    url: getDeleteSthURL(),
    method: 'post',
    data
  })
  return res
}

export function getSthFromTemplate(data) {
  var res = request({
    // url: '/list/getJsonData',
    url: getGetSthURL(),
    method: 'post',
    data
  })
  return res
}

export function queryOperation(data) {
  var res = request({
    // url: '/list/getJsonData',
    url: queryOperationURL(),
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

// new version
import {create, remove, update, list, get} from '@/utils/url-setter'

export function createObj(data) {
  var res = request({
    url: create(),
    method: 'post',
    data
  })
  return res
}

export function updateObj(data) {
  var res = request({
    url: update(),
    method: 'post',
    data
  })
  return res
}

export function removeObj(data) {
  var res = request({
    url: remove(),
    method: 'post',
    data
  })
  return res
}

export function listAll(data) {
  var res = request({
    url: list(),
    method: 'get',
    params: data
  })
  return res
}

export function search(data) {
  var res = request({
    url: list(),
    method: 'post',
    data
  })
  return res
}

export function getObj(data) {
  var res = request({
    url: get(),
    method: 'get',
    params: data
  })
  return res
}

export function getMockObj(data,url) {
  var res = request({
    url: url,
    method: 'get',
    params: data
  })
  return res
}

export function validateRes(res) {
  if (res.code == 20000) {
    return 1;
  } else {
    this.$notify({
      title: "error",
      message: res.data,
      type: "warning",
      duration: 3000
    });
    return 0;
  }
}