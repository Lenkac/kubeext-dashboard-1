export const urlPrefix = 'http://133.133.133.111:32000/kubesys/v1/'

export function getListURL() {
  return urlPrefix+'kube/query'
}

export function getCreateSthURL() {
  return urlPrefix+'kube/create'
}

export function getUpdateSthURL() {
  return urlPrefix+'kube/update'
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



