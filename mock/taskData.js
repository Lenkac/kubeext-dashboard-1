import Mock from 'mockjs'

const taskList = []

//生成模拟的任务数据
for (let i = 0; i < 3; i++) {
  taskList.push(Mock.mock({
    id: '@increment',
    // timestamp: +Mock.Random.date('T'),
    // author: '@first',
    // reviewer: '@first',
    metaData:{
      name: 'pod'+'@title(5, 10)',
      kind: 'node'
    },
    
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
  //模拟返回所有任务list
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
    //返回任务所有的表头
    url: '/list/getColumns',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        page: 1,
        count: 10,
        data: [
          //key：自增整数 width：每列初始宽度 label：表头 row：key值 style：表单样式 type：表单控件类型 
          { key: 1, width: '259', label: '名称', row: 'metaData.name', style: 'width:150px;', type: 'input', kind: 'a', link: '/profile/taskProfile'},
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
    //组件的数据源
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
    //表单组件的查询参数
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
          name: 'name',
          viewer: 'tasks',
          host: 'host',
          nest:{
            bb: 'nest.bb'
          },
          listdata:[
            {key1: 'value1',key2: 'value2'},
            {key1: 'value3',key2: 'value4'}
          ]
        }
      }
    }
  },

  {
    //更新或插入记录时的校验规则，与columns中的row属性对应
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
    //更新或插入记录时的对象，key值与cols的row对应
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
    //每列最后的操作按钮，一般是删除和编辑
    url: '/list/getActions',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        page: 1,
        count: 10,
        total: 100,
        data: [
          { key: 1, name: '编辑主机', event: 'update', type: 'primary' }
        ]
      }
    }
  },
  {
    //每列最后的操作按钮，一般是删除和编辑
    url: '/list/getPodActions',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        page: 1,
        count: 10,
        total: 100,
        data: [
          { key: 1, name: '编辑pod', event: 'update', type: 'primary' }
        ]
      }
    }
  },
  {
    //每列最后的操作按钮，一般是删除和编辑
    url: '/list/getVMActions',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        page: 1,
        count: 10,
        total: 100,
        data: [
          { key: 1, name: '重启', event: 'update', type: 'primary' },
          { key: 2, name: '关机', event: 'update', type: 'primary' },
          { key: 3, name: '磁盘', event: 'update', type: 'primary' }
        ]
      }
    }
  },
  {
    //
    url: '/list/getJsonData',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        page: 1,
        count: 10,
        total: 100,
        data: [
          { apiVersion: 'v1',
            kind: 'Pod',
            metadata: 
            { name: '{{name}}',
              namespace: 'default',
              labels: { app: 'myapp', tier: 'frontend' } },
            spec: 
            { containers: 
                [ { name: 'myapp', image: '{{image}}' },
                  { name: 'busybox',
                    image: 'busybox:latest',
                    command: [ '/bin/sh', '-c', 'sleep 3600' ] 
                  } 
                ] 
            } 
          }]}
    }
  },
  
  {
    //每个表格上部的查询框，更新时（自动更新listquery参数）触发查询操作
    url: '/list/getFilterForm',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        page: 1,
        count: 10,
        total: 100,
        data: [
          { type: 'select', key: 1, label: '选择主机', dataSource: 'hosts', ph: '选择主机', prop: 'host', style: 'width:200px;margin-left:10px;margin-right:20px;height:35px' },
          { type: 'input', key: 2, label: '任务名称', ph: '输入任务', prop: 'name', style: 'width:200px;margin-left:20px;margin-right:20px;' },
          { type: 'input', key: 3, label: '测试字段', ph: '输入测试', prop: 'sdf', style: 'width:200px;margin-left:20px;margin-right:20px;' }
        ]
      }
    }
  },
  {
  url: '/getGrafanaLink',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: 'http://39.96.4.11:31000/d/JABGX_-mz/cluster-monitoring-for-kubernetes?orgId=1&from=1565660614683&to='+new Date().getTime()
      }
    }
  },
    {
      url: '/getMonitorinfo',
        type: 'get',
        response: config => {
          return {
            code: 20000,
            data: {"node":1,"memory":{"total":"http://39.96.4.11:31496/d-solo/JABGX_-mz/cluster-monitoring-for-kubernetes?orgId=1&var-interval=%24__auto_interval_interval&var-datasource=default&var-Node=ali1&from=1565155428085&to=1565156328085&panelId=10","rate":"http://39.96.4.11:31496/d-solo/JABGX_-mz/cluster-monitoring-for-kubernetes?orgId=1&var-interval=%24__auto_interval_interval&var-datasource=default&var-Node=ali1&from=1565155428085&to=1565156328085&panelId=4","used":"http://39.96.4.11:31496/d-solo/JABGX_-mz/cluster-monitoring-for-kubernetes?orgId=1&var-interval=%24__auto_interval_interval&var-datasource=default&var-Node=ali1&from=1565155428085&to=1565156328085&panelId=9"},"cpu":{"total":"http://39.96.4.11:31000/d-solo/JABGX_-mz/cluster-monitoring-for-kubernetes?orgId=1&var-interval=%24__auto_interval_interval&var-datasource=default&var-Node=ali1&from=1565155428085&to=1565156328085&panelId=12","rate":"http://39.96.4.11:31000/d-solo/JABGX_-mz/cluster-monitoring-for-kubernetes?orgId=1&var-interval=%24__auto_interval_interval&var-datasource=default&var-Node=ali1&from=1565155428085&to=1565156328085&panelId=6","used":"http://39.96.4.11:31000/d-solo/JABGX_-mz/cluster-monitoring-for-kubernetes?orgId=1&var-interval=%24__auto_interval_interval&var-datasource=default&var-Node=ali1&from=1565155428085&to=1565156328085&panelId=11"},"fs":{"total":"http://39.96.4.11:31496/d-solo/JABGX_-mz/cluster-monitoring-for-kubernetes?orgId=1&var-interval=%24__auto_interval_interval&var-datasource=default&var-Node=ali1&from=1565155428085&to=1565156328085&panelId=14","rate":"http://39.96.4.11:31496/d-solo/JABGX_-mz/cluster-monitoring-for-kubernetes?orgId=1&var-interval=%24__auto_interval_interval&var-datasource=default&var-Node=ali1&from=1565155428085&to=1565156328085&panelId=7","used":"http://39.96.4.11:31496/d-solo/JABGX_-mz/cluster-monitoring-for-kubernetes?orgId=1&var-interval=%24__auto_interval_interval&var-datasource=default&var-Node=ali1&from=1565155428085&to=1565156328085&panelId=13"},"network":"http://39.96.4.11:31496/d-solo/JABGX_-mz/cluster-monitoring-for-kubernetes?orgId=1&var-interval=%24__auto_interval_interval&var-datasource=default&var-Node=ali1&from=1565155428085&to=1565156328085&panelId=32"}
          }
        }
      },



]
