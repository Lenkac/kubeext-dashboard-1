export default [
  // user taskData
  {
    url: '/taskData/getAllTaskData',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        page: 1,
        count: 10,
        data: [
          { name: '任务2：（4 Core，4 Ram）', id: 2 },
          { name: '任务2：（4 Core，4 Ram）', id: 9 },
          { name: '任务3：（4 Core，4 Ram）', id: 3 }
        ]
      }
    }
  }
]
