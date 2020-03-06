export default [
    {
        url: '/SimpleLayout/user',
        type: 'get',
        response: config => {
          //console.log(config.query)
          return {
            code: 20000,
            data: {
                metadata: {
                    generation: 1,
                    uid: "5584143a-a5ec-44f8-890d-6c5dc0ed42da",
                    resourceVersion: "993486",
                    creationTimestamp: "2020-03-04T13:18:13Z",
                    name: "table-node",
                    namespace: "default",
                    annotations: {
                        "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"cloudplus.io/v1alpha3\",\"kind\":\"Frontend\",\"metadata\":{\"additionalProperties\":{},\"annotations\":{},\"finalizers\":[],\"managedFields\":[],\"name\":\"table-node\",\"namespace\":\"default\",\"ownerReferences\":[]},\"spec\":{\"data\":[{\"key\":1,\"kind\":\"a\",\"label\":\"主机名\",\"link\":\"/profile/taskProfile\",\"row\":\"metadata.name\",\"style\":\"width:150px;\",\"type\":\"input\",\"width\":\"120\"},{\"dataSource\":\"type's\",\"key\":2,\"label\":\"uuid\",\"row\":\"metadata.uid\",\"style\":\"width:250px;\",\"type\":\"select\",\"width\":\"150\"},{\"key\":4,\"label\":\"IP地址\",\"row\":\"status.addresses[0].address\",\"width\":\"150\"},{\"key\":9,\"label\":\"CPU\",\"row\":\"status.capacity.cpu.amount\",\"width\":\"120\"},{\"key\":5,\"label\":\"内存\",\"row\":\"status.capacity.memory.amount\",\"width\":\"120\"},{\"key\":6,\"label\":\"最大实例数\",\"row\":\"status.capacity.pods.amount\",\"width\":\"120\"},{\"key\":7,\"label\":\"操作系统\",\"row\":\"status.nodeInfo.osImage\",\"width\":\"220\"},{\"key\":8,\"label\":\"创建时间\",\"row\":\"status.conditions[0].lastHeartbeatTime\",\"width\":\"220\"},{\"key\":10,\"kind\":\"action\",\"label\":\"Actions\",\"row\":\"\",\"width\":\"130\"}],\"type\":\"table\"}}\n"
                    },
                    selfLink: "/apis/cloudplus.io/v1alpha3/namespaces/default/frontends/table-node"
                },
                apiVersion: "cloudplus.io/v1alpha3",
                kind: "Frontend",
                spec: {
                    left: {
                        formName: 'registerformID',
                        title: '编辑用户',
                        rules: {
                            "user*Name":[{ required: true, message: '必须要填写用户名', trigger: 'change' }, { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }],
                            userEmail:[{ type: 'email', required: true, message: '必须是合法邮箱地址', trigger: 'change' }],
                            userPhone:[],
                            gender:[],
                            type:[{ message: '必须要选择用户类型', trigger: 'change' }],
                            roles:[{ required: true, message: '必须要选择用户角色', trigger: 'change' }]
                        },
                        model:{
                            "user*Name":'tttt',
                            userEmail:'',
                            userPhone:'',
                            gender:'',
                            type:'',
                            roles:'',
                            roles:'',

                        },
                        formStyle: '',
                        items:[
                            { type: 'input', key: 100, label: '用户名', ph: '请输入...', prop: "user*Name"},
                            { type: 'input', key: 99, label: '邮箱', ph: '...@...', prop: 'userEmail'},
                            { type: 'input', key: 98, label: '手机号', ph: '请输入...', prop: 'userPhone'},
                            { type: 'radio', key: 97, label: '性别', prop: 'gender'},
                            { type: 'select', key: 96, label: '用户类型', ph: '选择类型', prop: 'type' },
                            { type: 'checkbox', key: 95, label: '用户角色', ph: '输入任务', prop: 'roles' }
                        ],
                        dataSources:{
                            gender: [],
                            type: [],
                            roles:[]
                        },
                        submitButton: '提交用户信息',
                        resetButton: '重置信息'
                    },
                    type: "SimpleLayout",

                }
            }
        }
        }
    },
    {
        url: '/ds/gender',
        type: 'get',
        response: config => {
          return {
            code: 20000,
            data: {
                metadata: {
                    generation: 1,
                    uid: "5584143a-a5ec-44f8-890d-6c5dc0ed42da",
                    resourceVersion: "993486",
                    creationTimestamp: "2020-03-04T13:18:13Z",
                    name: "table-node",
                    namespace: "default",
                    annotations: {
                        "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"cloudplus.io/v1alpha3\",\"kind\":\"Frontend\",\"metadata\":{\"additionalProperties\":{},\"annotations\":{},\"finalizers\":[],\"managedFields\":[],\"name\":\"table-node\",\"namespace\":\"default\",\"ownerReferences\":[]},\"spec\":{\"data\":[{\"key\":1,\"kind\":\"a\",\"label\":\"主机名\",\"link\":\"/profile/taskProfile\",\"row\":\"metadata.name\",\"style\":\"width:150px;\",\"type\":\"input\",\"width\":\"120\"},{\"dataSource\":\"type's\",\"key\":2,\"label\":\"uuid\",\"row\":\"metadata.uid\",\"style\":\"width:250px;\",\"type\":\"select\",\"width\":\"150\"},{\"key\":4,\"label\":\"IP地址\",\"row\":\"status.addresses[0].address\",\"width\":\"150\"},{\"key\":9,\"label\":\"CPU\",\"row\":\"status.capacity.cpu.amount\",\"width\":\"120\"},{\"key\":5,\"label\":\"内存\",\"row\":\"status.capacity.memory.amount\",\"width\":\"120\"},{\"key\":6,\"label\":\"最大实例数\",\"row\":\"status.capacity.pods.amount\",\"width\":\"120\"},{\"key\":7,\"label\":\"操作系统\",\"row\":\"status.nodeInfo.osImage\",\"width\":\"220\"},{\"key\":8,\"label\":\"创建时间\",\"row\":\"status.conditions[0].lastHeartbeatTime\",\"width\":\"220\"},{\"key\":10,\"kind\":\"action\",\"label\":\"Actions\",\"row\":\"\",\"width\":\"130\"}],\"type\":\"table\"}}\n"
                    },
                    selfLink: "/apis/cloudplus.io/v1alpha3/namespaces/default/frontends/table-node"
                },
                apiVersion: "cloudplus.io/v1alpha3",
                kind: "Frontend",
                spec: {
                    data:[
                        {key:94,label:"男"},
                        {key:93,label:"女"}
                    ]
                }
            }
        }
        }
    },
    {
        url: '/ds/type',
        type: 'get',
        response: config => {
          return {
            code: 20000,
            data: {
                metadata: {
                    generation: 1,
                    uid: "5584143a-a5ec-44f8-890d-6c5dc0ed42da",
                    resourceVersion: "993486",
                    creationTimestamp: "2020-03-04T13:18:13Z",
                    name: "table-node",
                    namespace: "default",
                    annotations: {
                        "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"cloudplus.io/v1alpha3\",\"kind\":\"Frontend\",\"metadata\":{\"additionalProperties\":{},\"annotations\":{},\"finalizers\":[],\"managedFields\":[],\"name\":\"table-node\",\"namespace\":\"default\",\"ownerReferences\":[]},\"spec\":{\"data\":[{\"key\":1,\"kind\":\"a\",\"label\":\"主机名\",\"link\":\"/profile/taskProfile\",\"row\":\"metadata.name\",\"style\":\"width:150px;\",\"type\":\"input\",\"width\":\"120\"},{\"dataSource\":\"type's\",\"key\":2,\"label\":\"uuid\",\"row\":\"metadata.uid\",\"style\":\"width:250px;\",\"type\":\"select\",\"width\":\"150\"},{\"key\":4,\"label\":\"IP地址\",\"row\":\"status.addresses[0].address\",\"width\":\"150\"},{\"key\":9,\"label\":\"CPU\",\"row\":\"status.capacity.cpu.amount\",\"width\":\"120\"},{\"key\":5,\"label\":\"内存\",\"row\":\"status.capacity.memory.amount\",\"width\":\"120\"},{\"key\":6,\"label\":\"最大实例数\",\"row\":\"status.capacity.pods.amount\",\"width\":\"120\"},{\"key\":7,\"label\":\"操作系统\",\"row\":\"status.nodeInfo.osImage\",\"width\":\"220\"},{\"key\":8,\"label\":\"创建时间\",\"row\":\"status.conditions[0].lastHeartbeatTime\",\"width\":\"220\"},{\"key\":10,\"kind\":\"action\",\"label\":\"Actions\",\"row\":\"\",\"width\":\"130\"}],\"type\":\"table\"}}\n"
                    },
                    selfLink: "/apis/cloudplus.io/v1alpha3/namespaces/default/frontends/table-node"
                },
                apiVersion: "cloudplus.io/v1alpha3",
                kind: "Frontend",
                spec: {
                    data:[
                        {key:92,label:"开发用户"},
                        {key:91,label:"运维用户"},
                        {key:90,label:"自定义用户"}
                    ]
                }
            }
        }
        }
    },
    {
        url: '/ds/roles',
        type: 'get',
        response: config => {
          return {
            code: 20000,
            data: {
                metadata: {
                    generation: 1,
                    uid: "5584143a-a5ec-44f8-890d-6c5dc0ed42da",
                    resourceVersion: "993486",
                    creationTimestamp: "2020-03-04T13:18:13Z",
                    name: "table-node",
                    namespace: "default",
                    annotations: {
                        "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"cloudplus.io/v1alpha3\",\"kind\":\"Frontend\",\"metadata\":{\"additionalProperties\":{},\"annotations\":{},\"finalizers\":[],\"managedFields\":[],\"name\":\"table-node\",\"namespace\":\"default\",\"ownerReferences\":[]},\"spec\":{\"data\":[{\"key\":1,\"kind\":\"a\",\"label\":\"主机名\",\"link\":\"/profile/taskProfile\",\"row\":\"metadata.name\",\"style\":\"width:150px;\",\"type\":\"input\",\"width\":\"120\"},{\"dataSource\":\"type's\",\"key\":2,\"label\":\"uuid\",\"row\":\"metadata.uid\",\"style\":\"width:250px;\",\"type\":\"select\",\"width\":\"150\"},{\"key\":4,\"label\":\"IP地址\",\"row\":\"status.addresses[0].address\",\"width\":\"150\"},{\"key\":9,\"label\":\"CPU\",\"row\":\"status.capacity.cpu.amount\",\"width\":\"120\"},{\"key\":5,\"label\":\"内存\",\"row\":\"status.capacity.memory.amount\",\"width\":\"120\"},{\"key\":6,\"label\":\"最大实例数\",\"row\":\"status.capacity.pods.amount\",\"width\":\"120\"},{\"key\":7,\"label\":\"操作系统\",\"row\":\"status.nodeInfo.osImage\",\"width\":\"220\"},{\"key\":8,\"label\":\"创建时间\",\"row\":\"status.conditions[0].lastHeartbeatTime\",\"width\":\"220\"},{\"key\":10,\"kind\":\"action\",\"label\":\"Actions\",\"row\":\"\",\"width\":\"130\"}],\"type\":\"table\"}}\n"
                    },
                    selfLink: "/apis/cloudplus.io/v1alpha3/namespaces/default/frontends/table-node"
                },
                apiVersion: "cloudplus.io/v1alpha3",
                kind: "Frontend",
                spec: {
                    data:[
                        {key:89,label:"Super-Administrator-User",value:'Super-Administrator-User'},
                        {key:88,label:"System-Administrator-User",value:'System-Administrator-User'},
                        {key:87,label:"Administrator-Tenant",value:'Administrator-Tenant'},
                        {key:86,label:"Basic-ReadOnly",value:'Basic-ReadOnly'}
                    ]
                }
            }
        }
        }
    }
]