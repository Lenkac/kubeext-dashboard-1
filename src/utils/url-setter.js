export const urlPrefix = 'http://127.0.0.1:32000/kubesys/v1/'

export function getListURL(viewerName) {
  if(viewerName === 'nodes'){
    return urlPrefix+'query/nodeList'
  } else if(viewerName === 'pods') {
    return urlPrefix+'query/podList'
  } else if(viewerName === 'vms') {
    return urlPrefix+'query/vmList'
  }
  return ''
}

export function getMetaDataURL() {
  return urlPrefix+'query/metaData'
}

export function getParameterURL() {
  return urlPrefix+'query/parameter'
}

export function getMonitorInfoURL() {
  return urlPrefix+'query/monitorInfo'
}

export function getJsonDataURL() {
  return urlPrefix+'query/jsonTemplate'
}

export function getContainerURL() {
  return urlPrefix+'update/templateConfig'
}

export function getCreateSthURL() {
  return urlPrefix+'create/sthFromTemplate'
}

export function getDeleteSthURL() {
  return urlPrefix+'delete/sthFromTemplate'
}
