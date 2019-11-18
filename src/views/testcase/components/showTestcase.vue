<template>
  <div class="container">
    <div class="components-container">
      <el-row :gutter="20" style="margin:30px;">
        <el-col
          :span="7"
          v-for="(item,index) in value.slice(0,3)"
          :key="item.title"
          style="margin-bottom:30px"
        >
          <el-card class="box-card" style="height:130px">
            <div slot="header" class="clearfix" style="height:10px;padding:0px">
              <span>
                <p style="display:inline;font-size:12px;">
                  <strong>{{ value[index].title }}</strong>
                </p>
              </span>
            </div>
            <p style="font-size:10px; margin:2px">此处配置项用于操作{{item.title}}</p>
            <el-button
              type="primary"
              size="mini"
              style="float:right;margin:2px;"
              @click.native="clickA(index)"
            >编辑配置</el-button>
          </el-card>
        </el-col>
      </el-row>

      <el-dialog
        v-el-drag-dialog
        :visible.sync="dialogTableVisible"
        :title="json.kind"
        @dragDialog="handleDrag"
      >
        <el-select
          ref="select"
          v-model="modelType"
          style="margin-top:0px;margin-bottom:20px;"
          placeholder="请选择调度策略"
          @change="refreshData"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button
          type="primary"
          style="float:right;margin-top:0px;height:5%;display:inline;margin-right:20px;margin-bottom:20px;"
          @click.native="clickB"
        >确认配置</el-button>
        <el-table border fit highlight-current-row :data="taskList" style="width: 670px;">
          <el-table-column label="任务名" prop="id" align="center" width="150px">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" width="120px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.type }}</span>
            </template>
          </el-table-column>
          <el-table-column label="主机节点" width="150px" align="center">
            <template slot-scope>
              <span>null</span>
            </template>
          </el-table-column>
          <el-table-column label="优先级" width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.priority }}</span>
            </template>
          </el-table-column>
          <el-table-column label="顺序" width="100px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.order }}</span>
            </template>
          </el-table-column>
        </el-table>
        <br />
        <div class="card-editor-container">
          <!-- <json-editor ref="EditableJson" v-model="value" /> -->
          <EditableJson v-model="json" />
        </div>
      </el-dialog>
    </div>
    <div class="filter-container" style="margin-left:40px">
      <div style="width:1000px;">
        请选择调度策略：
        <el-select v-model="modelType" style="margin-right:20px;" @change="getVal">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>超分比例：
        <el-input v-model="rate" :placeholder="1" style="width:50px;margin-right:20px;"></el-input>
        <el-button class="filter-item" type="primary" style="margin-top:9px;" @click="fetchData">执行</el-button>
        <el-button class="filter-item" type="primary" style="margin-top:9px;" @click="fetchStatus">刷新</el-button>
      </div>
      <div style="width:550px;float:left">
        <el-table :data="list" style="width: 500px;padding-top: 15px;">
          <el-table-column label="用例名称" width="100px">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column label="调度策略" width="100px">
            <template slot-scope="scope">{{ scope.row.strategy }}</template>
          </el-table-column>
          <el-table-column  label="任务" width="100px" align="center">
            <template slot-scope="{row}">
              <el-tag style="margin-bottom:5px" v-for="item in row.task" :key="item.name">{{ item.name }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column  label="状态" width="100px" align="center">
            <template slot-scope="{row}">
              <el-tag style="width:70px; margin-bottom:5px" v-for="item in row.task" :key="item.name" :type="item.status | statusFilter">{{ item.status }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div id="myChart1" :style="{width: '200px', height: '250px',float:'left'}"></div>
      <div id="myChart2" :style="{width: '200px', height: '250px',float:'left',}"></div>
      <div id="myChart3" :style="{width: '200px', height: '250px',float:'left'}"></div>
    </div>
  </div>
</template>

<script>
import { getEchartsData, getPriorityData } from "@/api/taskData";
import {
  getListAllData,
  getColumns,
  getFilterForm,
  getLittleDataSource,
  getRules,
  getTemp,
  getJsonData,
  saveContianerConfig,
  createSthFromTemplate
} from "@/api/commonData";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { mapGetters } from "vuex";
import { transactionList } from "@/api/remote-search";
import elDragDialog from "@/directive/el-drag-dialog"; // base on element-ui
import EditableJson from "@/components/EditableJson";

const defaultData = [
  [
    { name: "busybox1", type: "pod", ip: "null", priority: "null", order: 1 },
    { name: "busybox2", type: "pod", ip: "null", priority: "null", order: 2 },
    { name: "busybox3", type: "pod", ip: "null", priority: "null", order: 3 }
  ],
  [
    { name: "busybox1", type: "pod", ip: "null", priority: "null", order: 1 },
    { name: "busybox2", type: "pod", ip: "null", priority: "null", order: 3 },
    { name: "busybox3", type: "pod", ip: "null", priority: "null", order: 2 }
  ],
  [
    { name: "busybox1", type: "pod", ip: "null", priority: "null", order: 3 },
    { name: "busybox2", type: "pod", ip: "null", priority: "null", order: 2 },
    { name: "busybox3", type: "pod", ip: "null", priority: "null", order: 1 }
  ]
];

const priorityData = [
  [
    { name: "busybox1", type: "pod", ip: "null", priority: "1", order: 1 },
    { name: "busybox2", type: "pod", ip: "null", priority: "2", order: 2 },
    { name: "busybox3", type: "pod", ip: "null", priority: "3", order: 3 }
  ],
  [
    { name: "busybox1", type: "pod", ip: "null", priority: "1", order: 1 },
    { name: "busybox2", type: "pod", ip: "null", priority: "2", order: 3 },
    { name: "busybox3", type: "pod", ip: "null", priority: "3", order: 2 }
  ],
  [
    { name: "busybox1", type: "pod", ip: "null", priority: "1", order: 3 },
    { name: "busybox2", type: "pod", ip: "null", priority: "2", order: 2 },
    { name: "busybox3", type: "pod", ip: "null", priority: "3", order: 1 }
  ]
];
let echarts = require("echarts");
var children = [
  {
    name: "busybox1",
    itemStyle: {
      color: "#33cc33",
    }
  },
  {
    name: "busybox2",
    itemStyle: {
      color: "#33cc33",
    }
  },
  {
    name: "busybox3",
    itemStyle: {
      color: "#ff3300",
    }
  }
];

var children1 = [
  {
    name: "busybox1",
    collapsed: true,
    itemStyle: {
      color: "#33cc33",
      borderWidth: 0
    }
  },
  {
    name: "busybox2",
    collapsed: true,
    itemStyle: {
      color: "#ff3300",
      borderWidth: 0
    }
  },
  {
    name: "busybox3",
    collapsed: true,
    itemStyle: {
      color: "#33cc33",
      borderWidth: 0
    }
  }
];

var children2 = [
  {
    name: "busybox1",
    collapsed: true,
    itemStyle: {
      color: "#ff3300",
      borderWidth: 0
    }
  },
  {
    name: "busybox2",
    collapsed: true,
    itemStyle: {
      color: "#33cc33",
      borderWidth: 0
    }
  },
  {
    name: "busybox3",
    collapsed: true,
    itemStyle: {
      color: "#33cc33",
      borderWidth: 0
    }
  }
];

var children3 = [
  {
    name: "busybox1",
    collapsed: true,
    itemStyle: {
      color: "#33cc33",
      borderWidth: 0
    }
  },
  {
    name: "busybox2",
    collapsed: true,
    itemStyle: {
      color: "#33cc33",
      borderWidth: 0
    }
  },
  {
    name: "busybox3",
    collapsed: true,
    itemStyle: {
      color: "#33cc33",
      borderWidth: 0
    }
  }
];

export default {
  name: "testcase",
  directives: { elDragDialog },
  components: {
    EditableJson
  },
  computed: {
    ...mapGetters(["name", "avatar", "roles"])
  },
  props: {
    tabName: {
      type: String,
      default: "VirtualMachine"
    },
    successCreate: {
      type: String,
      default: ""
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: "success",
        fail: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
    orderNoFilter(str) {
      return str.substring(0, 30);
    }
  },
  data() {
    return {
      list1: [],
      echartsData: {},
      createPodJson: [],
      testData1: {
        name: "testcase1",
        children: children
      },
      testData2: {
        name: "testcase2",
        children: children
      },
      testData3: {
        name: "testcase3",
        children: children
      },
      list: [],
      listLoading: true,
      importanceOptions: [1, 2, 3],
      statusOptions: ["published", "draft", "deleted"],
      total: 0,
      rules: {},
      temp: {},
      textMap: {
        update: "更新数据",
        create: "创建新记录"
      },
      viewer: "pods",
      value: "",
      json: [],
      dialogTableVisible: false,
      modelType: "",
      options: [
        { value: "default", label: "默认" },
        { value: "priority", label: "优先级" },
        { value: "affinity", label: "亲和性" },
        { value: "anti-affinity", label: "反亲和性" }
      ],
      kind: "",
      strategy: "",
      rate: 1,
      activeName: "",
      index: 0,
      taskList: [
        { name: "busybox1", type: "pod", ip: "133.133.135.35", priority: 2 }
      ]
    };
  },
  mounted() {
    getEchartsData().then(response => {
      this.echartsData = response.data;
      console.log(response.data);
    });
  },
  created() {
    getPriorityData().then(response => {
      this.createPodJson = response.data;
    });

    getPriorityData().then(response => {
      this.value = response.data;
    });
    this.taskList = [
      { name: "busybox1", type: "pod", ip: "null", priority: "null", order: 1 },
      { name: "busybox2", type: "pod", ip: "null", priority: "null", order: 2 },
      { name: "busybox3", type: "pod", ip: "null", priority: "null", order: 3 }
    ];
  },
  methods: {
    handleDrag() {
      this.$refs.select.blur()
    },
    refreshData(val) {
      console.log(val)
      if(val == 'priority'){
        this.json = this.value[this.index+3]
        this.taskList = priorityData[this.index]       
      }else if(val == 'default') {
        this.json = this.value[this.index]
        this.taskList = defaultData[this.index]
      }
    },
    clickA(index) {
      this.dialogTableVisible = true
      this.json = this.value[index]
      this.kind = this.value[index].title
      this.modelType = 'default'
      this.index = index
      this.taskList = defaultData[this.index]
    },
    clickB() {
      this.dialogTableVisible = false
      this.schedulingType = this.modelType
      var res = this.toRawJson(this.json);
      updateJsonData({operator:"update",json: JSON.parse(res), kind:this.kind}).then(response => {
      console.log(response.code)
      })
    },
    toRawJson(val) {
      var str = JSON.stringify(val);
      str = str.replace(/ +/g, "");
      str = str.replace(/\\n/g, "");
      if (str[0] == '"') {
        str = str.substring(1, str.length - 1);
      }
      str = str.replace(/\\/g, "");
      return str;
    },
    getVal(val) {
      this.strategy = val;//调度策略
    },

    fetchStatus() {
      createSthFromTemplate({operator:"update",json: JSON.parse(res), kind:this.kind}).then(response => {
        console.log(response.code)
      })
    },

    fetchData() {
      this.$message({
        message: "开始测试！",
        type: "success"
      });
      if (this.strategy == "priority" && this.rate == 1) {
            this.list = [
              {
                name: "testcase1",
                strategy: "priority",
                task: [
                {
                    name: "busybox1",
                    status: "success",
                },
                {
                    name: "busybox2",
                    status: "success",
                },
                {
                    name: "busybox3",
                    status: "fail",
                },
            ]
              },
              {
                name: "testcase2",
                strategy: "priority",
                task: [
                {
                    name: "busybox1",
                    status: "success",
                },
                {
                    name: "busybox2",
                    status: "success",
                },
                {
                    name: "busybox3",
                    status: "fail",
                }]
              },
              {
                name: "testcase3",
                strategy: "priority",
                task: [
                {
                    name: "busybox1",
                    status: "success",
                },
                {
                    name: "busybox2",
                    status: "success",
                },
                {
                    name: "busybox3",
                    status: "fail",
                }]
              }
            ]

        setTimeout(
          function() {
            this.testData1.children = children;
            this.drawLine1();
          }.bind(this),
          3000
        );

        setTimeout(
          function() {
            this.$message({
              message: "卸载环境！",
              type: "success"
            });
          }.bind(this),
          3500
        );

        setTimeout(
          function() {
            this.testData2.children = children;
            //this.describe2()
            let myChart2 = this.$echarts.init(
              document.getElementById("myChart2")
            );
            myChart2.setOption({
              tooltip: {
                trigger: "item",
                triggerOn: "mousemove"
              },
              series: [
                {
                  type: "tree",

                  data: [this.testData2],

                  left: "2%",
                  right: "2%",
                  top: "25%",
                  bottom: "30%",

                  symbol: "circle",
                  symbolSize: 15,
                  itemStyle: {
                    color: "black",
                    borderWidth: 0
                  },

                  orient: "vertical",

                  expandAndCollapse: true,

                  label: {
                    normal: {
                      position: "top",
                      verticalAlign: "middle",
                      align: "right",
                      fontSize: 14
                    }
                  },

                  leaves: {
                    label: {
                      normal: {
                        position: "bottom",
                        verticalAlign: "right",
                        align: "right",
                        rotate: -90
                      }
                    }
                  },

                  animationDurationUpdate: 750
                }
              ]
            });
          }.bind(this),
          6000
        );
        setTimeout(
          function() {
            this.testData3.children = children;
            //this.drawLine3()
            let myChart3 = this.$echarts.init(
              document.getElementById("myChart3")
            );
            myChart3.setOption({
              tooltip: {
                trigger: "item",
                triggerOn: "mousemove"
              },
              series: [
                {
                  type: "tree",

                  data: [this.testData3],

                  left: "2%",
                  right: "2%",
                  top: "25%",
                  bottom: "30%",

                  symbol: "circle",
                  symbolSize: 15,
                  itemStyle: {
                    color: "black",
                    borderWidth: 0
                  },

                  orient: "vertical",

                  expandAndCollapse: true,

                  label: {
                    normal: {
                      position: "top",
                      verticalAlign: "middle",
                      align: "right",
                      fontSize: 14
                    }
                  },

                  leaves: {
                    label: {
                      normal: {
                        position: "bottom",
                        verticalAlign: "right",
                        align: "right",
                        rotate: -90
                      }
                    }
                  },

                  animationDurationUpdate: 750
                }
              ]
            });
          }.bind(this),
          9000
        );
      } else if (this.strategy == "default" && this.rate == 1) {
        setTimeout(
          function() {
            this.list = [
              {
                name: "testcase1",
                strategy: "default",
                task: [
                {
                    name: "busybox1",
                    status: "success",
                },
                {
                    name: "busybox2",
                    status: "success",
                },
                {
                    name: "busybox3",
                    status: "fail",
                },
            ]
                
              },
              {
                name: "testcase2",
                strategy: "default",
                task: [
                {
                    name: "busybox1",
                    status: "success",
                },
                {
                    name: "busybox2",
                    status: "success",
                },
                {
                    name: "busybox3",
                    status: "fail",
                },
            ]
                
              },
              {
                name: "testcase3",
                strategy: "default",
                task: [
                {
                    name: "busybox1",
                    status: "success",
                },
                {
                    name: "busybox2",
                    status: "success",
                },
                {
                    name: "busybox3",
                    status: "fail",
                },
            ]
                
              }
            ];
          }.bind(this),
          9500
        );
        setTimeout(
          function() {
            this.testData1.children = children;
            this.drawLine1();
          }.bind(this),
          3000
        );

        setTimeout(
          function() {
            this.$message({
              message: "卸载环境！",
              type: "success"
            });
          }.bind(this),
          3500
        );

        setTimeout(
          function() {
            this.$message({
              message: "卸载环境！",
              type: "success"
            });
          }.bind(this),
          7000
        );

        setTimeout(
          function() {
            this.testData2.children = children1;
            let myChart2 = this.$echarts.init(
              document.getElementById("myChart2")
            );
            myChart2.setOption({
              tooltip: {
                trigger: "item",
                triggerOn: "mousemove"
              },
              series: [
                {
                  type: "tree",

                  data: [this.testData2],

                  left: "2%",
                  right: "2%",
                  top: "25%",
                  bottom: "30%",

                  symbol: "circle",
                  symbolSize: 15,
                  itemStyle: {
                    color: "black",
                    borderWidth: 0
                  },

                  orient: "vertical",

                  expandAndCollapse: true,

                  label: {
                    normal: {
                      position: "top",
                      verticalAlign: "middle",
                      align: "right",
                      fontSize: 14
                    }
                  },

                  leaves: {
                    label: {
                      normal: {
                        position: "bottom",
                        verticalAlign: "right",
                        align: "right",
                        rotate: -90
                      }
                    }
                  },

                  animationDurationUpdate: 750
                }
              ]
            });
          }.bind(this),
          6000
        );
        setTimeout(
          function() {
            this.testData3.children = children2;
            let myChart3 = this.$echarts.init(
              document.getElementById("myChart3")
            );
            myChart3.setOption({
              tooltip: {
                trigger: "item",
                triggerOn: "mousemove"
              },
              series: [
                {
                  type: "tree",

                  data: [this.testData3],

                  left: "2%",
                  right: "2%",
                  top: "25%",
                  bottom: "30%",

                  symbol: "circle",
                  symbolSize: 15,
                  itemStyle: {
                    color: "black",
                    borderWidth: 0
                  },

                  orient: "vertical",

                  expandAndCollapse: true,

                  label: {
                    normal: {
                      position: "top",
                      verticalAlign: "middle",
                      align: "right",
                      fontSize: 14
                    }
                  },

                  leaves: {
                    label: {
                      normal: {
                        position: "bottom",
                        verticalAlign: "right",
                        align: "right",
                        rotate: -90
                      }
                    }
                  },

                  animationDurationUpdate: 750
                }
              ]
            });
          }.bind(this),
          9000
        );
      } else if (this.rate > 1) {
        setTimeout(
          function() {
            this.list = [
              {
                name: "testcase1",
                strategy: "priority",
                task: [
                {
                    name: "busybox1",
                    status: "success",
                },
                {
                    name: "busybox2",
                    status: "success",
                },
                {
                    name: "busybox3",
                    status: "fail",
                },
            ]
              },
              {
                name: "testcase2",
                strategy: "priority",
                task: [
                {
                    name: "busybox1",
                    status: "success",
                },
                {
                    name: "busybox2",
                    status: "success",
                },
                {
                    name: "busybox3",
                    status: "fail",
                },
            ]
              },
              {
                name: "testcase3",
                strategy: "priority",
                task: [
                {
                    name: "busybox1",
                    status: "success",
                },
                {
                    name: "busybox2",
                    status: "success",
                },
                {
                    name: "busybox3",
                    status: "fail",
                },
            ]
              }
            ];
          }.bind(this),
          9500
        );
        setTimeout(
          function() {
            this.testData1.children = children3;
            this.drawLine1();
          }.bind(this),
          3000
        );

        setTimeout(
          function() {
            this.$message({
              message: "卸载环境！",
              type: "success"
            });
          }.bind(this),
          3500
        );

        setTimeout(
          function() {
            this.$message({
              message: "卸载环境！",
              type: "success"
            });
          }.bind(this),
          7000
        );

        setTimeout(
          function() {
            this.testData2.children = children3;
            let myChart2 = this.$echarts.init(
              document.getElementById("myChart2")
            );
            myChart2.setOption({
              tooltip: {
                trigger: "item",
                triggerOn: "mousemove"
              },
              series: [
                {
                  type: "tree",

                  data: [this.testData2],

                  left: "2%",
                  right: "2%",
                  top: "25%",
                  bottom: "30%",

                  symbol: "circle",
                  symbolSize: 15,
                  itemStyle: {
                    color: "black",
                    borderWidth: 0
                  },

                  orient: "vertical",

                  expandAndCollapse: true,

                  label: {
                    normal: {
                      position: "top",
                      verticalAlign: "middle",
                      align: "right",
                      fontSize: 14
                    }
                  },

                  leaves: {
                    label: {
                      normal: {
                        position: "bottom",
                        verticalAlign: "right",
                        align: "right",
                        rotate: -90
                      }
                    }
                  },

                  animationDurationUpdate: 750
                }
              ]
            });
          }.bind(this),
          6000
        );
        setTimeout(
          function() {
            this.testData3.children = children3;
            let myChart3 = this.$echarts.init(
              document.getElementById("myChart3")
            );
            myChart3.setOption({
              tooltip: {
                trigger: "item",
                triggerOn: "mousemove"
              },
              series: [
                {
                  type: "tree",

                  data: [this.testData3],

                  left: "2%",
                  right: "2%",
                  top: "25%",
                  bottom: "30%",

                  symbol: "circle",
                  symbolSize: 15,
                  itemStyle: {
                    color: "black",
                    borderWidth: 0
                  },

                  orient: "vertical",

                  expandAndCollapse: true,

                  label: {
                    normal: {
                      position: "top",
                      verticalAlign: "middle",
                      align: "right",
                      fontSize: 14
                    }
                  },

                  leaves: {
                    label: {
                      normal: {
                        position: "bottom",
                        verticalAlign: "right",
                        align: "right",
                        rotate: -90
                      }
                    }
                  },

                  animationDurationUpdate: 750
                }
              ]
            });
          }.bind(this),
          9000
        );
        //this.drawLine()
      }
    },
    drawLine1() {
      // 基于准备好的dom，初始化echarts实例
      let myChart1 = this.$echarts.init(document.getElementById("myChart1"));

      // 绘制图
      myChart1.setOption({
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove"
        },
        series: [
          {
            type: "tree",

            data: [this.testData1],

            left: "2%",
            right: "2%",
            top: "25%",
            bottom: "30%",

            symbol: "circle",
            symbolSize: 15,
            itemStyle: {
              color: "black",
              borderWidth: 0
            },

            orient: "vertical",

            expandAndCollapse: true,

            label: {
              normal: {
                position: "top",
                verticalAlign: "middle",
                align: "right",
                fontSize: 14
              }
            },

            leaves: {
              label: {
                normal: {
                  position: "bottom",
                  verticalAlign: "right",
                  align: "right",
                  rotate: -90
                }
              }
            },

            animationDurationUpdate: 750
          }
        ]
      });
    }
  }
};
</script>

<style scoped>
.link {
  color: red;
}
a:hover {
  text-decoration: underline;
}
input {
  height: 35px;
}
.el-card__header {
  padding: 5px 5px;
}
</style>