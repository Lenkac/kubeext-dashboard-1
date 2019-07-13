import { getAllTaskData } from '@/api/taskData'

const actions = {

  // get task info
  getAllTaskData() {
    return new Promise((resolve, reject) => {
      getAllTaskData().then(response => {
        const { data, count, page } = response
        if (!data) {
          reject('查询错误')
        }
        resolve({ data, count, page })
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  actions
}
