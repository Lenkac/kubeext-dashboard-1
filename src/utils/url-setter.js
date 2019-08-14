export const urlPrefix = 'http://127.0.0.1:32000/kubesys/v1/'

export function getListURL(viewerName) {
  if(viewerName === 'nodes'){
    return urlPrefix+'query/nodeList'
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
