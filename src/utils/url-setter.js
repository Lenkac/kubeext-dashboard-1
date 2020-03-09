export const urlPrefix = process.env.VUE_APP_BACKEND

export function getListURL() {
  return urlPrefix+'kube/query'
}

export function getCreateSthURL() {
  return urlPrefix+'kube/create'
}

export function getUpdateSthURL() {
  return urlPrefix+'kube/update'
}

export function getGetSthURL() {
  return urlPrefix+'kube/get'
}

export function getDeleteSthURL() {
  return urlPrefix+'kube/delete'
}

export function getMetaDataURL() {
  return urlPrefix+'meta/query'
}

export function updateMetaDataURL() {
  return urlPrefix+'meta/update'
}

export function deleteMetaDataURL() {
  return urlPrefix+'meta/delete'
}

export function createMetaDataURL() {
  return urlPrefix+'meta/create'
}

export function getJsonDataURL() {
  return urlPrefix+'res/query'
}

export function updateJsonDataURL() {
  return urlPrefix+'res/update'
}

export function deleteJsonDataURL() {
  return urlPrefix+'res/delete'
}

export function createJsonDataURL() {
  return urlPrefix+'res/create'
}

export function queryOperationURL() {
  return urlPrefix+'exec/query'
}

export function getScheduleURL() {
  return urlPrefix+'networkFlow/solveBase'
}

export function create() {
  return urlPrefix + 'kubernetes/create'
}

export function update() {
  return urlPrefix + 'kubernetes/update'
}

export function remove() {
  return urlPrefix + 'kubernetes/delete'
}

export function get() {
  return urlPrefix + 'kubernetes/get'
}

export function list() {
  return urlPrefix + 'kubernetes/query'
}

export function metaURL() {
  return urlPrefix + 'kubernetes/getMeta'
}

export function sysInfoURL() {
  return urlPrefix + 'kubernetes/getSysInfo'
}




