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
          { name: '逗比，这是从后台拿到的数据', id: 2 },
          { name: '逗比，这是从后台拿到的数据', id: 9 },
          { name: '逗比，这是从后台拿到的数据', id: 3 }
        ]
      }
    }
  }
]
