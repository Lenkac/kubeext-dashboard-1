import Mock from 'mockjs'

const taskList = []

for (let i = 0; i < 3; i++) {
  taskList.push(Mock.mock({
    id: '@increment',
    // timestamp: +Mock.Random.date('T'),
    // author: '@first',
    // reviewer: '@first',
    name: 'pod'+'@title(5, 10)',
    // content_short: 'mock data',
    // content: baseContent,
    // forecast: '@float(0, 100, 2, 2)',
    restartCounts: '@integer(1, 100)',
    runningLength: '@integer(10, 100)'+'day ago',
    ip: '@integer(1, 255)'+'.'+'@integer(1, 255)'+'.'+'@integer(1, 255)'+'.'+'@integer(1, 255)',
    'type|1': ['deployment', "replicationController", 'replicationSet', 'daemonSet'],
    host: 'node'+'@integer(1, 20)',
    cpuMem: '@integer(1, 32)'+'Core '+'@integer(1, 256)'+'GB',
    'status|1': ['Running', 'Terminating', 'init-0'],
    'ready|1': ['3/2', '1/1', '5/8']
    // display_time: '@datetime',
    // comment_disabled: true,
    // pageviews: '@integer(300, 5000)',
    // image_uri,
    // platforms: ['a-platform']
  }))
}

export default [
  // user taskData
  {
    url: '/list/getList',
    type: 'get',
    response: config => {
      console.log(config.query)
      return {
        code: 20000,
        page: 1,
        count: 10,
        total: 100,
        data: taskList
      }
    }
  },

  {
    url: '/list/getColumns',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        page: 1,
        count: 10,
        data: [
          { key: 1, width: '259', label: '名称', row: 'name', style: 'width:150px;', type: 'input' },
          { key: 2, width: '130', label: '类型', row: 'type', style: 'width:250px;', type: 'select', dataSource: 'types' },
          { key: 3, width: '120', label: 'Ready数量', row: 'ready' },
          { key: 4, width: '110', label: '运行状态', row: 'status' },
          { key: 9, width: '110', label: '重启次数', row: 'restartCounts' },
          { key: 5, width: '120', label: '创建时长', row: 'runningLength' },
          { key: 6, width: '120', label: 'IP', row: 'ip', itemStyle: 'display:none;' },
          { key: 7, width: '120', label: '所在主机', row: 'host', style: 'width:150px;', type: 'input', dataSource: 'host' },
          { key: 8, width: '120', label: 'CPU/内存', row: 'cpuMem' }
        ]
      }
    }
  },

  {
    url: '/list/getLittleDataSource',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        page: 1,
        count: 10,
        data: {
          hosts: [
            { key: 1, label: 'node1', value: 'node1' },
            { key: 2, label: 'node2', value: 'node2' }
          ],
          types: [
            { key: 1, label: 'Deployment', value: 'Deployment' },
            { key: 2, label: 'ReplicationController', value: 'ReplicationController' },
            { key: 3, label: 'ReplicationSet', value: 'ReplicationSet' },
            { key: 4, label: 'DaemonSet', value: 'DaemonSet' },
            { key: 5, label: 'StatefulSet', value: 'StatefulSet' }
          ]
        }
      }
    }
  },

  {
    url: '/list/getQueryParameter',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        page: 1,
        count: 10,
        total: 100,
        data: {
          page: 1,
          limit: 20,
          name: '',
          viewer: 'tasks'
        }
      }
    }
  },

  {
    url: '/list/getRules',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        page: 1,
        count: 10,
        total: 100,
        data: {
          name: [{ required: true, message: '必须要填写任务名称', trigger: 'change' }, { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        }
      }
    }
  },

  {
    url: '/list/getTemp',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        page: 1,
        count: 10,
        total: 100,
        data: {
          viewer: 'tasks',
          name: '',
          type: '',
          ready: '',
          status: '',
          cpuMem: '',
          runningLength: '',
          ip: '',
          host: '',
          restartCounts: 0
        }
      }
    }
  },

  {
    url: '/list/getActions',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        page: 1,
        count: 10,
        total: 100,
        data: [
          { key: 1, name: '编辑任务', event: 'update', type: 'primary' },
          { key: 2, name: '删除任务', event: 'delete', type: 'danger' }
        ]
      }
    }
  },
  
  {
    url: '/list/getFilterForm',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        page: 1,
        count: 10,
        total: 100,
        data: [
          { type: 'select', key: 1, label: '选择主机', dataSource: 'hosts', ph: '选择主机', width: 200, prop: 'host' },
          { type: 'input', key: 2, label: '任务名称', ph: '输入任务', width: 200, prop: 'name', style: 'width:200px;margin-left:20px;margin-right:20px;' }
        ]
      }
    }
  },


]
