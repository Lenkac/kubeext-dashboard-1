import Mock from 'mockjs'
var testcase1 = [
    {
      "apiVersion": "v1",
      "kind": "Pod",
      "metadata": {
        "name": "busybox1",
        "namespace": "testcase1"
      },
      "spec": {
        "containers": [
          {
            "image": "busybox",
            "command": [
              "sleep",
              "3600"
            ],
            "imagePullPolicy": "IfNotPresent",
            "name": "busybox"
          }
        ],
        "restartPolicy": "Always"
      }
    },
    {
      "apiVersion": "v1",
      "kind": "Pod",
      "metadata": {
        "name": "busybox2",
        "namespace": "testcase1"
      },
      "spec": {
        "containers": [
          {
            "image": "busybox",
            "command": [
              "sleep",
              "3600"
            ],
            "imagePullPolicy": "IfNotPresent",
            "name": "busybox"
          }
        ],
        "restartPolicy": "Always"
      }
    },
    {
      "apiVersion": "v1",
      "kind": "Pod",
      "metadata": {
        "name": "busybox3",
        "namespace": "testcase1"
      },
      "spec": {
        "containers": [
          {
            "image": "busybox",
            "command": [
              "sleep",
              "3600"
            ],
            "imagePullPolicy": "IfNotPresent",
            "name": "busybox"
          }
        ],
        "restartPolicy": "Always"
      }
    }
  ]
var testcase2 = testcase1
var testcase3 = testcase1
var ptestcase1 = [
  {
    "apiVersion": "v1",
    "kind": "PriorityPod",
    "metadata": {
      "name": "busybox1",
      "namespace": "ptestcase1"
    },
    "spec": {
      "containers": [
        {
          "image": "busybox",
          "command": [
            "sleep",
            "3600"
          ],
          "imagePullPolicy": "IfNotPresent",
          "name": "busybox"
        }
      ],
      "restartPolicy": "Always"
    }
  },
  {
    "apiVersion": "v1",
    "kind": "PriorityPod",
    "metadata": {
      "name": "busybox2",
      "namespace": "ptestcase1"
    },
    "spec": {
      "containers": [
        {
          "image": "busybox",
          "command": [
            "sleep",
            "3600"
          ],
          "imagePullPolicy": "IfNotPresent",
          "name": "busybox"
        }
      ],
      "restartPolicy": "Always"
    }
  },
  {
    "apiVersion": "v1",
    "kind": "PriorityPod",
    "metadata": {
      "name": "busybox3",
      "namespace": "ptestcase1"
    },
    "spec": {
      "containers": [
        {
          "image": "busybox",
          "command": [
            "sleep",
            "3600"
          ],
          "imagePullPolicy": "IfNotPresent",
          "name": "busybox"
        }
      ],
      "restartPolicy": "Always"
    }
  }
]
var testcase2 = [
  {
    "apiVersion": "v1",
    "kind": "Pod",
    "metadata": {
      "name": "busybox1",
      "namespace": "testcase2"
    },
    "spec": {
      "containers": [
        {
          "image": "busybox",
          "command": [
            "sleep",
            "3600"
          ],
          "imagePullPolicy": "IfNotPresent",
          "name": "busybox"
        }
      ],
      "restartPolicy": "Always"
    }
  },
  {
    "apiVersion": "v1",
    "kind": "Pod",
    "metadata": {
      "name": "busybox3",
      "namespace": "testcase2"
    },
    "spec": {
      "containers": [
        {
          "image": "busybox",
          "command": [
            "sleep",
            "3600"
          ],
          "imagePullPolicy": "IfNotPresent",
          "name": "busybox"
        }
      ],
      "restartPolicy": "Always"
    }
  },
  {
    "apiVersion": "v1",
    "kind": "Pod",
    "metadata": {
      "name": "busybox2",
      "namespace": "testcase2"
    },
    "spec": {
      "containers": [
        {
          "image": "busybox",
          "command": [
            "sleep",
            "3600"
          ],
          "imagePullPolicy": "IfNotPresent",
          "name": "busybox"
        }
      ],
      "restartPolicy": "Always"
    }
  }
]
var ptestcase2 = [
  {
    "apiVersion": "v1",
    "kind": "PriorityPod",
    "metadata": {
      "name": "busybox1",
      "namespace": "ptestcase2"
    },
    "spec": {
      "containers": [
        {
          "image": "busybox",
          "command": [
            "sleep",
            "3600"
          ],
          "imagePullPolicy": "IfNotPresent",
          "name": "busybox"
        }
      ],
      "restartPolicy": "Always"
    }
  },
  {
    "apiVersion": "v1",
    "kind": "PriorityPod",
    "metadata": {
      "name": "busybox3",
      "namespace": "ptestcase2"
    },
    "spec": {
      "containers": [
        {
          "image": "busybox",
          "command": [
            "sleep",
            "3600"
          ],
          "imagePullPolicy": "IfNotPresent",
          "name": "busybox"
        }
      ],
      "restartPolicy": "Always"
    }
  },
  {
    "apiVersion": "v1",
    "kind": "PriorityPod",
    "metadata": {
      "name": "busybox2",
      "namespace": "ptestcase2"
    },
    "spec": {
      "containers": [
        {
          "image": "busybox",
          "command": [
            "sleep",
            "3600"
          ],
          "imagePullPolicy": "IfNotPresent",
          "name": "busybox"
        }
      ],
      "restartPolicy": "Always"
    }
  }
]
var testcase3 = [
  {
    "apiVersion": "v1",
    "kind": "Pod",
    "metadata": {
      "name": "busybox3",
      "namespace": "testcase3"
    },
    "spec": {
      "containers": [
        {
          "image": "busybox",
          "command": [
            "sleep",
            "3600"
          ],
          "imagePullPolicy": "IfNotPresent",
          "name": "busybox"
        }
      ],
      "restartPolicy": "Always"
    }
  },
  {
    "apiVersion": "v1",
    "kind": "Pod",
    "metadata": {
      "name": "busybox2",
      "namespace": "testcase3"
    },
    "spec": {
      "containers": [
        {
          "image": "busybox",
          "command": [
            "sleep",
            "3600"
          ],
          "imagePullPolicy": "IfNotPresent",
          "name": "busybox"
        }
      ],
      "restartPolicy": "Always"
    }
  },
  {
    "apiVersion": "v1",
    "kind": "Pod",
    "metadata": {
      "name": "busybox1",
      "namespace": "testcase3"
    },
    "spec": {
      "containers": [
        {
          "image": "busybox",
          "command": [
            "sleep",
            "3600"
          ],
          "imagePullPolicy": "IfNotPresent",
          "name": "busybox"
        }
      ],
      "restartPolicy": "Always"
    }
  }
]
var ptestcase3 = [
  {
    "apiVersion": "v1",
    "kind": "PriorityPod",
    "metadata": {
      "name": "busybox3",
      "namespace": "ptestcase3"
    },
    "spec": {
      "containers": [
        {
          "image": "busybox",
          "command": [
            "sleep",
            "3600"
          ],
          "imagePullPolicy": "IfNotPresent",
          "name": "busybox"
        }
      ],
      "restartPolicy": "Always"
    }
  },
  {
    "apiVersion": "v1",
    "kind": "PriorityPod",
    "metadata": {
      "name": "busybox2",
      "namespace": "ptestcase3"
    },
    "spec": {
      "containers": [
        {
          "image": "busybox",
          "command": [
            "sleep",
            "3600"
          ],
          "imagePullPolicy": "IfNotPresent",
          "name": "busybox"
        }
      ],
      "restartPolicy": "Always"
    }
  },
  {
    "apiVersion": "v1",
    "kind": "PriorityPod",
    "metadata": {
      "name": "busybox1",
      "namespace": "ptestcase3"
    },
    "spec": {
      "containers": [
        {
          "image": "busybox",
          "command": [
            "sleep",
            "3600"
          ],
          "imagePullPolicy": "IfNotPresent",
          "name": "busybox"
        }
      ],
      "restartPolicy": "Always"
    }
  }
]
testcase2[1].metadata.name = "busybox3"
testcase2[2].metadata.name = "busybox2"
testcase3[0].metadata.name = "busybox3"
testcase3[2].metadata.name = "busybox1"

const taskList = []
const schedule = {symbol:[],links:[],tipData:[],failure:[]}
const scheduleA = {symbol:[],links:[],tipData:[],failure:[]}
var tipData = ['@integer(0,100)',0,0,1,0]
var tipDataS = []
var tipDataA = ['@integer(0,100)',0,0,1,0]
var tipDataSA = []
const fail = {
  id:1,
  name:'T'+'@integer(0,10000)'
}
const symbolKind = [
  {
    name: 'G'+'@integer(1,4000)',
    x: '@integer(750,800)',
    y: '@integer(200,800)',
    itemStyle: {
      color: 'MediumTurquoise'
    }
  },
  {
    name: 'M'+'@integer(1,4000)',
    x: '@integer(900,950)',
    y: '@integer(200,800)',
    itemStyle: {
      color: '#0399d3'
    }
  },
  {
    name: 'T'+'@integer(1,10000)',
    x: '@integer(450,500)',
    y: '@integer(200,800)',
    itemStyle: {
      color: '#67b55b'
    }
  },
  {
    name: 'A'+'@integer(1,4000)',
    x: '@integer(600,650)',
    y: '@integer(200,800)',
    itemStyle: {
      color: 'SandyBrown'
    }
  }
  
]

const symbolKindA = [
  {
    name: 'G'+'@integer(1,4000)',
    x: '@integer(700,750)',
    y: '@integer(200,800)',
    itemStyle: {
      color: 'MediumTurquoise'
    }
  },
  {
    name: 'M'+'@integer(1,4000)',
    x: '@integer(900,950)',
    y: '@integer(200,800)',
    itemStyle: {
      color: '#0399d3'
    }
  },
  {
    name: 'T'+'@integer(1,10000)',
    x: '@integer(450,500)',
    y: '@integer(200,800)',
    itemStyle: {
      color: '#67b55b'
    }
  }
]


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
var maxms = -1
var minms = 1000
var totalms = 0
for (let i = 0; i < 30; i++) {
  var task = []
  var application = []
  var group = []
  var machine = []
  var arr = []
  for (let j = 0; j < 50; j++) {
    if(i == 29) {
      var k = Math.floor(Math.random()*2)
    }else {
      var k = Math.floor(Math.random()*4)
    }
    arr.push(Mock.mock(symbolKind[k]))
    //console.log(arr)
    if(arr[j].name.charAt(0) == 'T') {
      task.push(arr[j].name)
    } else if(arr[j].name.charAt(0) == 'A') {
      application.push(arr[j].name)
    } else if(arr[j].name.charAt(0) == 'G') {
      group.push(arr[j].name)
    } else if(arr[j].name.charAt(0) == 'M') {
      machine.push(arr[j].name)
    }
  }
  arr.push({
    name: 'S',
    x: 300,
    y: 400,
    itemStyle: {
      color: '#ff9999'
    }
  })
  arr.push({
    name: 'E',
    x: 1050,
    y: 400,
    itemStyle: {
      color: '#ff9999'
    }
  })
  const linkKind = [
    {
      'source|1': 'S',
      target: '',
      lineStyle: {
        normal: {
            width: 3,
            'color|1': ['#aaa']
        },    
      }
    },
    {
      'source|1': task,
      'target|1': application,
      lineStyle: {
        normal: {
            width: 3,
            'color|1': ['#aaa']
        },    
      }
    },
    {
      source: '',
      target: '',
      lineStyle: {
        normal: {
            width: 3,
            'color|1': ['#aaa'] 
        },    
      }
    },
    {
      'source|1': group,
      'target|1': machine,
      lineStyle: {
        normal: {
            width: 3,
            'color|1': ['#aaa']
        },    
      }
    },
    {
      source: '',
      'target|1': 'E',
      lineStyle: {
        normal: {
            width: 3,
            'color|1': ['#aaa']
        },    
      }
    }
  ]
  var arrl = []
  if(i == 29) {
    for (let x = 0; x < group.length; x++) {
      linkKind[0].target = group[x]
      arrl.push(Mock.mock(linkKind[0]))
    }
  }else {
    for (let x = 0; x < task.length; x++) {
      linkKind[0].target = task[x]
      arrl.push(Mock.mock(linkKind[0]))
      arrl.push(Mock.mock(linkKind[1]))
    }
  }
  
  for (let x = 0; x < application.length; x++) {
    for(let y = 0; y < group.length; y++ ) {
      linkKind[2].source = application[x]
      linkKind[2].target = group[y]
      arrl.push(Mock.mock(linkKind[2]))
    }
  }
  for (let x = 0; x < machine.length; x++) {
    linkKind[4].source = machine[x]
    arrl.push(Mock.mock(linkKind[3]))
    arrl.push(Mock.mock(linkKind[4]))
  }
  tipDataS = Mock.mock(tipData)
  tipDataS[1] = tipDataS[0]
  tipDataS[2] = tipDataS[0]
  totalms += tipDataS[0]
  tipDataS[0] = (totalms/(i+1)).toFixed(2)
  if(maxms < tipDataS[1]) {
    maxms = tipDataS[1]
  }
  if(minms > tipDataS[2]) {
    minms = tipDataS[2]
  }
  tipDataS[1] = maxms
  tipDataS[2] = minms
  if(i == 29) {
    tipDataS[3] = 10000
  }else {
    tipDataS[3] = tipData[3] + Math.floor(Math.random()*580)
    tipData[3] = tipDataS[3]
  }
    schedule.tipData.push(tipDataS)
    schedule.symbol.push(Mock.mock(arr))
    schedule.links.push(Mock.mock(arrl))
  //console.log(schedule)
  
  
}

//scheduleA
var maxmsA = -1
var minmsA = 1000
var totalmsA = 0
for (let i = 0; i < 30; i++) {
  var taskA = []
  var groupA = []
  var machineA = []
  var arrA = []
  for (let j = 0; j < 50; j++) {
    var k = Math.floor(Math.random()*3)
    arrA.push(Mock.mock(symbolKindA[k]))
    //console.log(arr)
    if(arrA[j].name.charAt(0) == 'T') {
      taskA.push(arrA[j].name)
    } else if(arrA[j].name.charAt(0) == 'G') {
      groupA.push(arrA[j].name)
    } else if(arrA[j].name.charAt(0) == 'M') {
      machineA.push(arrA[j].name)
    }
  }
  arrA.push({
    name: 'S',
    x: 300,
    y: 400,
    itemStyle: {
      color: '#ff9999'
    }
  })
  arrA.push({
    name: 'E',
    x: 1050,
    y: 400,
    itemStyle: {
      color: '#ff9999'
    }
  })
  const linkKindA = [
    {
      'source|1': 'S',
      target: '',
      lineStyle: {
        normal: {
            width: 3,
            'color|1': ['#aaa']
        },    
      }
    },
    {
      'source|1': taskA,
      'target|1': groupA,
      lineStyle: {
        normal: {
            width: 3,
            'color|1': ['#aaa'] 
        },    
      }
    },
    {
      'source|1': groupA,
      'target|1': machineA,
      lineStyle: {
        normal: {
            width: 3,
            'color|1': ['#aaa']
        },    
      }
    },
    {
      source: '',
      'target|1': 'E',
      lineStyle: {
        normal: {
            width: 3,
            'color|1': ['#aaa']
        },    
      }
    }
  ]
  var arrlA = []
  for (let x = 0; x < taskA.length; x++) {
    linkKindA[0].target = taskA[x]
    arrlA.push(Mock.mock(linkKindA[0]))
    arrlA.push(Mock.mock(linkKindA[1]))
  }
  for (let x = 0; x < machineA.length; x++) {
    linkKindA[3].source = machineA[x]
    arrlA.push(Mock.mock(linkKindA[2]))
    arrlA.push(Mock.mock(linkKindA[3]))
  }
  tipDataSA = Mock.mock(tipDataA)
  tipDataSA[1] = tipDataSA[0]
  tipDataSA[2] = tipDataSA[0]
  totalmsA += tipDataSA[0]
  tipDataS[0] = (totalmsA/(i+1)).toFixed(2)
  if(maxmsA < tipDataSA[1]) {
    maxmsA = tipDataSA[1]
  }
  if(minmsA > tipDataSA[2]) {
    minmsA = tipDataSA[2]
  }
  tipDataSA[1] = maxmsA
  tipDataSA[2] = minmsA
  if(i == 29) {
    tipDataSA[3] = 8917
    tipDataSA[4] = 1083
  }else {
    tipDataSA[3] = tipDataA[3] + Math.floor(Math.random()*520)
    tipDataSA[4] = tipDataA[4] + Math.floor(Math.random()*70)
    tipDataA[3] = tipDataSA[3]
    tipDataA[4] = tipDataSA[4]
  }
  
  scheduleA.tipData.push(tipDataSA)
  scheduleA.symbol.push(Mock.mock(arrA))
  scheduleA.links.push(Mock.mock(arrlA))
  //console.log(scheduleA)
  for(var p = 0; p<30;p++) {
    scheduleA.failure.push(Mock.mock({
      id:1+p,
      name:'T'+'@integer(0,10000)'
    }))
  }
}

export default [
  //模拟返回所有任务list
  {
    url: '/list/getList',
    type: 'get',
    response: config => {
      //console.log(config.query)
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
          { key: 1, width: '259', label: '名称', row: 'metaData.name', style: 'width:150px;', type: 'input', kind: 'a', link: '/resourceInfo/nodeInfo'},
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
            { key: 1, label: 'node1', value: 'node11' },
            { key: 2, label: 'node2', value: 'node2' }
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
    url: '/list/getVMActions',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        page: 1,
        count: 10,
        total: 100,
        data: [
          { key: 1, label: '更新VM操作系统', value: 'updateVmOs'},
          { key: 2, label: '创建switch', value: 'createSwitch'},
          { key: 3, label: 'startPool', value: 'startPool'},
          { key: 4, label: '删除switch', value: 'deleteSwitch'},
          { key: 5, label: 'deleteSwPort', value: 'deleteSwPort'},
          { key: 6, label: '删除VM', value: 'deleteVM'},
          { key: 7, label: 'createSwPort', value: 'createSwPort'},
          { key: 8, label: '创建快照', value: 'createSnapshot'},
          { key: 9, label: '停止虚拟机', value: 'stopVM'},
          { key: 10, label: '拔网卡', value: 'unplugNIC'},
          { key: 11, label: '显示所有存储池', value: 'listAllStoragePool'},
          { key: 12, label: '插磁盘', value: 'plugDisk'},
          { key: 13, label: '重启虚拟机', value: 'resumeVM'},
          { key: 14, label: 'convertImageToVm', value: 'convertImageToVm'},
          { key: 15, label: '创建虚拟机', value: 'createAndStartVMFromISO'},
          { key: 16, label: '停止pool', value: 'stopPool'},
          { key: 17, label: '删除pool', value: 'deletePool'},
          { key: 18, label: '创建pool', value: 'createPool'},
          { key: 19, label: '拔磁盘', value: 'unplugDisk'},
          { key: 20, label: '克隆磁盘', value: 'cloneDisk'},
          { key: 21, label: '删除快照', value: 'deleteSnapshot'},
          { key: 22, label: 'convertVmToImage', value: 'convertVmToImage'},
          { key: 23, label: '从镜像启动虚拟机', value: 'createAndStartVMFromImage'},
          { key: 24, label: '创建磁盘', value: 'createDisk'},
          { key: 25, label: '创建镜像', value: 'createImage'},
          { key: 26, label: '强制停止虚拟机', value: 'stopVMForce'},
          { key: 27, label: '删除磁盘', value: 'deleteDisk'},
          { key: 28, label: '开启虚拟机', value: 'startVM'},
          { key: 29, label: '插网卡', value: 'plugNIC'},
          { key: 30, label: '显示所有phyPool', value: 'listAllPhyPool'},
          { key: 31, label: '暂停虚拟机', value: 'suspendVM'},
          { key: 32, label: '显示存储池', value: 'listStoragePool'},
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
        data: 'http://133.133.135.35:31000/d/JABGX_-mz/cluster-monitoring-for-kubernetes?orgId=1&from=1572593814683&to='+new Date().getTime()
      }
    }
  },
  {
    url: '/getEchartsData',
      type: 'get',
      response: config => {
        return {
          code: 20000,
          data: {
            "name": "flare",
            "children": [
             {
              "name": "analytics",
              "children": [
               {
                "name": "cluster",
                "children": [
                 {"name": "AgglomerativeCluster", "value": 3938},
                 {"name": "CommunityStructure", "value": 3812},
                 {"name": "HierarchicalCluster", "value": 6714},
                 {"name": "MergeEdge", "value": 743}
                ]
               },
               {
                "name": "graph",
                "children": [
                 {"name": "BetweennessCentrality", "value": 3534},
                 {"name": "LinkDistance", "value": 5731},
                 {"name": "MaxFlowMinCut", "value": 7840},
                 {"name": "ShortestPaths", "value": 5914},
                 {"name": "SpanningTree", "value": 3416}
                ]
               },
               {
                "name": "optimization",
                "children": [
                 {"name": "AspectRatioBanker", "value": 7074}
                ]
               }
              ]
             },
             {
              "name": "animate",
              "children": [
               {"name": "Easing", "value": 17010},
               {"name": "FunctionSequence", "value": 5842},
               {
                "name": "interpolate",
                "children": [
                 {"name": "ArrayInterpolator", "value": 1983},
                 {"name": "ColorInterpolator", "value": 2047},
                 {"name": "DateInterpolator", "value": 1375},
                 {"name": "Interpolator", "value": 8746},
                 {"name": "MatrixInterpolator", "value": 2202},
                 {"name": "NumberInterpolator", "value": 1382},
                 {"name": "ObjectInterpolator", "value": 1629},
                 {"name": "PointInterpolator", "value": 1675},
                 {"name": "RectangleInterpolator", "value": 2042}
                ]
               },
               {"name": "ISchedulable", "value": 1041},
               {"name": "Parallel", "value": 5176},
               {"name": "Pause", "value": 449},
               {"name": "Scheduler", "value": 5593},
               {"name": "Sequence", "value": 5534},
               {"name": "Transition", "value": 9201},
               {"name": "Transitioner", "value": 19975},
               {"name": "TransitionEvent", "value": 1116},
               {"name": "Tween", "value": 6006}
              ]
             },
             {
              "name": "data",
              "children": [
               {
                "name": "converters",
                "children": [
                 {"name": "Converters", "value": 721},
                 {"name": "DelimitedTextConverter", "value": 4294},
                 {"name": "GraphMLConverter", "value": 9800},
                 {"name": "IDataConverter", "value": 1314},
                 {"name": "JSONConverter", "value": 2220}
                ]
               },
               {"name": "DataField", "value": 1759},
               {"name": "DataSchema", "value": 2165},
               {"name": "DataSet", "value": 586},
               {"name": "DataSource", "value": 3331},
               {"name": "DataTable", "value": 772},
               {"name": "DataUtil", "value": 3322}
              ]
             },
             {
              "name": "display",
              "children": [
               {"name": "DirtySprite", "value": 8833},
               {"name": "LineSprite", "value": 1732},
               {"name": "RectSprite", "value": 3623},
               {"name": "TextSprite", "value": 10066}
              ]
             },
             {
              "name": "flex",
              "children": [
               {"name": "FlareVis", "value": 4116}
              ]
             },
             {
              "name": "physics",
              "children": [
               {"name": "DragForce", "value": 1082},
               {"name": "GravityForce", "value": 1336},
               {"name": "IForce", "value": 319},
               {"name": "NBodyForce", "value": 10498},
               {"name": "Particle", "value": 2822},
               {"name": "Simulation", "value": 9983},
               {"name": "Spring", "value": 2213},
               {"name": "SpringForce", "value": 1681}
              ]
             },
             {
              "name": "query",
              "children": [
               {"name": "AggregateExpression", "value": 1616},
               {"name": "And", "value": 1027},
               {"name": "Arithmetic", "value": 3891},
               {"name": "Average", "value": 891},
               {"name": "BinaryExpression", "value": 2893},
               {"name": "Comparison", "value": 5103},
               {"name": "CompositeExpression", "value": 3677},
               {"name": "Count", "value": 781},
               {"name": "DateUtil", "value": 4141},
               {"name": "Distinct", "value": 933},
               {"name": "Expression", "value": 5130},
               {"name": "ExpressionIterator", "value": 3617},
               {"name": "Fn", "value": 3240},
               {"name": "If", "value": 2732},
               {"name": "IsA", "value": 2039},
               {"name": "Literal", "value": 1214},
               {"name": "Match", "value": 3748},
               {"name": "Maximum", "value": 843},
               {
                "name": "methods",
                "children": [
                 {"name": "add", "value": 593},
                 {"name": "and", "value": 330},
                 {"name": "average", "value": 287},
                 {"name": "count", "value": 277},
                 {"name": "distinct", "value": 292},
                 {"name": "div", "value": 595},
                 {"name": "eq", "value": 594},
                 {"name": "fn", "value": 460},
                 {"name": "gt", "value": 603},
                 {"name": "gte", "value": 625},
                 {"name": "iff", "value": 748},
                 {"name": "isa", "value": 461},
                 {"name": "lt", "value": 597},
                 {"name": "lte", "value": 619},
                 {"name": "max", "value": 283},
                 {"name": "min", "value": 283},
                 {"name": "mod", "value": 591},
                 {"name": "mul", "value": 603},
                 {"name": "neq", "value": 599},
                 {"name": "not", "value": 386},
                 {"name": "or", "value": 323},
                 {"name": "orderby", "value": 307},
                 {"name": "range", "value": 772},
                 {"name": "select", "value": 296},
                 {"name": "stddev", "value": 363},
                 {"name": "sub", "value": 600},
                 {"name": "sum", "value": 280},
                 {"name": "update", "value": 307},
                 {"name": "variance", "value": 335},
                 {"name": "where", "value": 299},
                 {"name": "xor", "value": 354},
                 {"name": "-", "value": 264}
                ]
               },
               {"name": "Minimum", "value": 843},
               {"name": "Not", "value": 1554},
               {"name": "Or", "value": 970},
               {"name": "Query", "value": 13896},
               {"name": "Range", "value": 1594},
               {"name": "StringUtil", "value": 4130},
               {"name": "Sum", "value": 791},
               {"name": "Variable", "value": 1124},
               {"name": "Variance", "value": 1876},
               {"name": "Xor", "value": 1101}
              ]
             },
             {
              "name": "scale",
              "children": [
               {"name": "IScaleMap", "value": 2105},
               {"name": "LinearScale", "value": 1316},
               {"name": "LogScale", "value": 3151},
               {"name": "OrdinalScale", "value": 3770},
               {"name": "QuantileScale", "value": 2435},
               {"name": "QuantitativeScale", "value": 4839},
               {"name": "RootScale", "value": 1756},
               {"name": "Scale", "value": 4268},
               {"name": "ScaleType", "value": 1821},
               {"name": "TimeScale", "value": 5833}
              ]
             },
             {
              "name": "util",
              "children": [
               {"name": "Arrays", "value": 8258},
               {"name": "Colors", "value": 10001},
               {"name": "Dates", "value": 8217},
               {"name": "Displays", "value": 12555},
               {"name": "Filter", "value": 2324},
               {"name": "Geometry", "value": 10993},
               {
                "name": "heap",
                "children": [
                 {"name": "FibonacciHeap", "value": 9354},
                 {"name": "HeapNode", "value": 1233}
                ]
               },
               {"name": "IEvaluable", "value": 335},
               {"name": "IPredicate", "value": 383},
               {"name": "IValueProxy", "value": 874},
               {
                "name": "math",
                "children": [
                 {"name": "DenseMatrix", "value": 3165},
                 {"name": "IMatrix", "value": 2815},
                 {"name": "SparseMatrix", "value": 3366}
                ]
               },
               {"name": "Maths", "value": 17705},
               {"name": "Orientation", "value": 1486},
               {
                "name": "palette",
                "children": [
                 {"name": "ColorPalette", "value": 6367},
                 {"name": "Palette", "value": 1229},
                 {"name": "ShapePalette", "value": 2059},
                 {"name": "SizePalette", "value": 2291}
                ]
               },
               {"name": "Property", "value": 5559},
               {"name": "Shapes", "value": 19118},
               {"name": "Sort", "value": 6887},
               {"name": "Stats", "value": 6557},
               {"name": "Strings", "value": 22026}
              ]
             },
             {
              "name": "vis",
              "children": [
               {
                "name": "axis",
                "children": [
                 {"name": "Axes", "value": 1302},
                 {"name": "Axis", "value": 24593},
                 {"name": "AxisGridLine", "value": 652},
                 {"name": "AxisLabel", "value": 636},
                 {"name": "CartesianAxes", "value": 6703}
                ]
               },
               {
                "name": "controls",
                "children": [
                 {"name": "AnchorControl", "value": 2138},
                 {"name": "ClickControl", "value": 3824},
                 {"name": "Control", "value": 1353},
                 {"name": "ControlList", "value": 4665},
                 {"name": "DragControl", "value": 2649},
                 {"name": "ExpandControl", "value": 2832},
                 {"name": "HoverControl", "value": 4896},
                 {"name": "IControl", "value": 763},
                 {"name": "PanZoomControl", "value": 5222},
                 {"name": "SelectionControl", "value": 7862},
                 {"name": "TooltipControl", "value": 8435}
                ]
               },
               {
                "name": "data",
                "children": [
                 {"name": "Data", "value": 20544},
                 {"name": "DataList", "value": 19788},
                 {"name": "DataSprite", "value": 10349},
                 {"name": "EdgeSprite", "value": 3301},
                 {"name": "NodeSprite", "value": 19382},
                 {
                  "name": "render",
                  "children": [
                   {"name": "ArrowType", "value": 698},
                   {"name": "EdgeRenderer", "value": 5569},
                   {"name": "IRenderer", "value": 353},
                   {"name": "ShapeRenderer", "value": 2247}
                  ]
                 },
                 {"name": "ScaleBinding", "value": 11275},
                 {"name": "Tree", "value": 7147},
                 {"name": "TreeBuilder", "value": 9930}
                ]
               },
               {
                "name": "events",
                "children": [
                 {"name": "DataEvent", "value": 2313},
                 {"name": "SelectionEvent", "value": 1880},
                 {"name": "TooltipEvent", "value": 1701},
                 {"name": "VisualizationEvent", "value": 1117}
                ]
               },
               {
                "name": "legend",
                "children": [
                 {"name": "Legend", "value": 20859},
                 {"name": "LegendItem", "value": 4614},
                 {"name": "LegendRange", "value": 10530}
                ]
               },
               {
                "name": "operator",
                "children": [
                 {
                  "name": "distortion",
                  "children": [
                   {"name": "BifocalDistortion", "value": 4461},
                   {"name": "Distortion", "value": 6314},
                   {"name": "FisheyeDistortion", "value": 3444}
                  ]
                 },
                 {
                  "name": "encoder",
                  "children": [
                   {"name": "ColorEncoder", "value": 3179},
                   {"name": "Encoder", "value": 4060},
                   {"name": "PropertyEncoder", "value": 4138},
                   {"name": "ShapeEncoder", "value": 1690},
                   {"name": "SizeEncoder", "value": 1830}
                  ]
                 },
                 {
                  "name": "filter",
                  "children": [
                   {"name": "FisheyeTreeFilter", "value": 5219},
                   {"name": "GraphDistanceFilter", "value": 3165},
                   {"name": "VisibilityFilter", "value": 3509}
                  ]
                 },
                 {"name": "IOperator", "value": 1286},
                 {
                  "name": "label",
                  "children": [
                   {"name": "Labeler", "value": 9956},
                   {"name": "RadialLabeler", "value": 3899},
                   {"name": "StackedAreaLabeler", "value": 3202}
                  ]
                 },
                 {
                  "name": "layout",
                  "children": [
                   {"name": "AxisLayout", "value": 6725},
                   {"name": "BundledEdgeRouter", "value": 3727},
                   {"name": "CircleLayout", "value": 9317},
                   {"name": "CirclePackingLayout", "value": 12003},
                   {"name": "DendrogramLayout", "value": 4853},
                   {"name": "ForceDirectedLayout", "value": 8411},
                   {"name": "IcicleTreeLayout", "value": 4864},
                   {"name": "IndentedTreeLayout", "value": 3174},
                   {"name": "Layout", "value": 7881},
                   {"name": "NodeLinkTreeLayout", "value": 12870},
                   {"name": "PieLayout", "value": 2728},
                   {"name": "RadialTreeLayout", "value": 12348},
                   {"name": "RandomLayout", "value": 870},
                   {"name": "StackedAreaLayout", "value": 9121},
                   {"name": "TreeMapLayout", "value": 9191}
                  ]
                 },
                 {"name": "Operator", "value": 2490},
                 {"name": "OperatorList", "value": 5248},
                 {"name": "OperatorSequence", "value": 4190},
                 {"name": "OperatorSwitch", "value": 2581},
                 {"name": "SortOperator", "value": 2023}
                ]
               },
               {"name": "Visualization", "value": 16540}
              ]
             }
            ]
           }
        }
      }
    },
    {
      url: '/getScheduleData',
        type: 'get',
        response: config => {
          return {
            code: 20000,
            data: schedule
      }
    }
  },
  {
    url: '/AgetScheduleData',
      type: 'get',
      response: config => {
        return {
          code: 20000,
          data: scheduleA
    }
  }
},
{
  url: '/getSingleMonitorInfo',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: scheduleA
  }
}
},
{
  url: '/getPriorityData',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: [{
          title:'测试用例1',
          json: testcase1         
        },
        {
          title:'测试用例2',
          json: testcase2        
        },
        {
          title:'测试用例3',
          json: testcase3
        },
        {
          title:'测试用例1',
          json: ptestcase1         
        },
        {
          title:'测试用例2',
          json: ptestcase2        
        },
        {
          title:'测试用例3',
          json: ptestcase3
        }
      ]
    }
  }
}
]
