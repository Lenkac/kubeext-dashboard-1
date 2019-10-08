<template>
  <div class="app-container">
    <div class="filter-container">
        <div style="width:1000px;">
        请选择调度策略：<el-select v-model="modelType" style="margin-right:20px;" @change="getVal" >
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        超分比例：<el-input v-model="rate" :placeholder=1 style="width:50px;margin-right:20px;"></el-input>
      <el-button  class="filter-item" type="primary" style="margin-top:9px;"  @click="fetchData">
        执行
      </el-button>
        </div>
      <div style="width:550px;float:left">
    <el-table :data="list" style="width: 500px;padding-top: 15px;">
    <el-table-column label="用例名称" width="100px">
      <template slot-scope="scope">
        {{ scope.row.name }}
      </template>
    </el-table-column>
    <el-table-column label="调度策略" width="100px">
      <template slot-scope="scope">
        {{ scope.row.strategy }}
      </template>
    </el-table-column>
    <el-table-column label="busbox1" width="100px" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.status1 | statusFilter">
          {{ row.status1 }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="busbox2" width="100px" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.status2 | statusFilter">
          {{ row.status2 }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="busbox3" width="100px" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.status3 | statusFilter">
          {{ row.status3 }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>  
      </div>
   <div id="myChart1" :style="{width: '200px', height: '250px',float:'left'}"></div>
   <div id="myChart2" :style="{width: '200px', height: '250px',float:'left'}"></div>
   <div id="myChart3" :style="{width: '200px', height: '250px',float:'left'}"></div>

    </div>
  </div>   
</template>

<script>
import { getEchartsData,getPriorityData} from '@/api/taskData'
import { getListAllData, getColumns, getPodActions, getFilterForm, getLittleDataSource, getListQuery, getRules, getTemp, getIp,getJsonData , createSthFromTemplate} from '@/api/commonData'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mapGetters } from 'vuex'
import { transactionList } from '@/api/remote-search'
let echarts = require('echarts')
var children = [
        {
            name: "busybox1",   
            collapsed: true, 
            itemStyle:{
                color:'#33cc33',
                borderWidth:0
            }
        },
        {
            name: "busybox2",   
            collapsed: true, 
            itemStyle:{
                color:'#33cc33',
                borderWidth:0
            }
        },
        {
            name: "busybox3",  
            collapsed: true, 
            itemStyle:{
                color:'#ff3300',
                borderWidth:0
            }
        },        
    ]  

    var children1 = [
        {
            name: "busybox1",   
            collapsed: true, 
            itemStyle:{
                color:'#33cc33',
                borderWidth:0
            }
        },
        {
            name: "busybox2",   
            collapsed: true, 
            itemStyle:{
                color:'#ff3300',
                borderWidth:0
            }
        },
        {
            name: "busybox3",  
            collapsed: true, 
            itemStyle:{
                color:'#33cc33',
                borderWidth:0
            }
        },        
    ]  

    var children2 = [
        {
            name: "busybox1",   
            collapsed: true, 
            itemStyle:{
                color:'#ff3300',
                borderWidth:0
            }
        },
        {
            name: "busybox2",   
            collapsed: true, 
            itemStyle:{
                color:'#33cc33',
                borderWidth:0
            }
        },
        {
            name: "busybox3",  
            collapsed: true, 
            itemStyle:{
                color:'#33cc33',
                borderWidth:0
            }
        },        
    ]  

    var children3 = [
        {
            name: "busybox1",   
            collapsed: true, 
            itemStyle:{
                color:'#33cc33',
                borderWidth:0
            }
        },
        {
            name: "busybox2",   
            collapsed: true, 
            itemStyle:{
                color:'#33cc33',
                borderWidth:0
            }
        },
        {
            name: "busybox3",  
            collapsed: true, 
            itemStyle:{
                color:'#33cc33',
                borderWidth:0
            }
        },        
    ]  


export default {
  name: 'testcase',
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        fail: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
        echartsData: {},
        createPodJson:[],
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
      tableKey: 0,
      list: null,
      listLoading: true,
      importanceOptions: [1, 2, 3],
      statusOptions: ['published', 'draft', 'deleted'],
      total: 0,
      rules: {
      },
      temp: {
      },
      textMap: {
        update: '更新数据',
        create: '创建新记录'
      },
      viewer: 'pods',
      value: '',
      ip: "",
      dialogTableVisible: false,
      modelType: '',
      options: [
        { value: 'default', label: '默认' },
        { value: 'priority', label: '优先级' },
        { value: 'affinity', label: '亲和性' },
        { value: 'anti-affinity', label: '反亲和性' }
      ],
      kind: "",
      rate:1
    }
  },
  mounted() {
      getEchartsData().then(response => {
          this.echartsData = response.data
          console.log(response.data)
          
      })
   
  },
  created() {
    this.ip = getIp(this.viewer,this.name) 
    getPriorityData().then(response => {
      this.createPodJson = response.data
    })   
   
  },
  methods: {
    toRawJson(val){
      var str = JSON.stringify(val)
      str = str.replace(/ +/g,"")
      str = str.replace(/\\n/g,"")
      if(str[0] == "\"") {
        str = str.substring(1,str.length-1)
      }     
      str = str.replace(/\\/g,"")
      return str;
    },
      getVal(val) {
          this.kind = val
      },
      fetchData() {
          if(this.kind == 'priority' && this.rate == 1) {
              this.list = [{"name": "testcase1",
             "strategy": 'default',
             "status1": 'success',
             "status2": 'success',
             "status3": 'fail',
      },{"name":"testcase2",
            "strategy": 'default',
             "status1": 'success',
             "status2": 'success',
             "status3": 'fail',
      },{"name":"testcase3",
            "strategy": 'default',
             "status1": 'success',
             "status2": 'success',
             "status3": 'fail',
      }]
      this.testData1.children = children
      this.testData2.children = children
      this.testData3.children = children
      this.drawLine()
      for(var i = 0; i < 3;i++) {
        for(var j = 0; j < 3;j++) {
          if(this.createPodJson[i].json[j].metadata.name == "busybox1" ||this.createPodJson[i].json[j].metadata.name == "busybox2") {
            var str = this.toRawJson(this.createPodJson[i].json[j])
            createSthFromTemplate({ip: this.ip, json: str,kind: "Pod"})
        }  
        }
              
      }
          }else if (this.kind == 'default' && this.rate == 1) {
              this.list = [{"name": "testcase1",
             "strategy": 'priority',
             "status1": 'success',
             "status2": 'success',
             "status3": 'fail',
      },{"name":"testcase2",
            "strategy": 'priority',
             "status1": 'success',
             "status2": 'fail',
             "status3": 'success',
      },{"name":"testcase3",
            "strategy": 'priority',
             "status1": 'fail',
             "status2": 'success',
             "status3": 'success',
      }]
      this.testData1.children = children
      this.testData2.children = children1
      this.testData3.children = children2
      this.drawLine()
      for(var i = 0; i < 3;i++) {
        for(var j = 0; j<2;j++) {
          var str = this.toRawJson(this.createPodJson[i].json[j])
          createSthFromTemplate({ip: this.ip, json: str,kind: "Pod"})
        }        
      }
      
          }else if(this.rate > 1){
              this.list = [{"name": "testcase1",
             "strategy": 'priority',
             "status1": 'success',
             "status2": 'success',
             "status3": 'success',
      },{"name":"testcase2",
            "strategy": 'priority',
             "status1": 'success',
             "status2": 'success',
             "status3": 'success',
      },{"name":"testcase3",
            "strategy": 'priority',
             "status1": 'success',
             "status2": 'success',
             "status3": 'success',
      }]
      this.testData2.children = children3
      this.testData3.children = children3
      this.testData1.children = children3
      this.drawLine()
          }
    },
    drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart1 = this.$echarts.init(document.getElementById('myChart1'))
        let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
        let myChart3 = this.$echarts.init(document.getElementById('myChart3'))

        // 绘制图表
        myChart1.setOption({
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series:[
            {
                type: 'tree',

                data: [this.testData1],

                left: '2%',
                right: '2%',
                top: '25%',
                bottom: '30%',

                symbol: 'circle',
                symbolSize: 15,
                itemStyle: {
                    color: 'black',
                    borderWidth:0
                },

                orient: 'vertical',

                expandAndCollapse: true,

                label: {
                    normal: {
                        position: 'top',
                        verticalAlign: 'middle',
                        align: 'right',
                        fontSize: 14
                    }
                },

                leaves: {
                    label: {
                        normal: {
                            position: 'bottom',
                            verticalAlign: 'right',
                            align: 'right',
                            rotate: -90,
                        }
                    }
                },

                animationDurationUpdate: 750,
            }
        ]
    });
    myChart2.setOption({
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series:[
            {
                type: 'tree',

                data: [this.testData2],

                left: '2%',
                right: '2%',
                top: '25%',
                bottom: '30%',

                symbol: 'circle',
                symbolSize: 15,
                itemStyle: {
                    color: 'black',
                    borderWidth:0
                },

                orient: 'vertical',

                expandAndCollapse: true,

                label: {
                    normal: {
                        position: 'top',
                        verticalAlign: 'middle',
                        align: 'right',
                        fontSize: 14
                    }
                },

                leaves: {
                    label: {
                        normal: {
                            position: 'bottom',
                            verticalAlign: 'right',
                            align: 'right',
                            rotate: -90,
                        }
                    }
                },

                animationDurationUpdate: 750
            }
        ]
    });
    myChart3.setOption({
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series:[
            {
                type: 'tree',

                data: [this.testData3],

                left: '2%',
                right: '2%',
                top: '25%',
                bottom: '30%',

                symbol: 'circle',
                symbolSize: 15,
                itemStyle: {
                    color: 'black',
                    borderWidth:0
                },

                orient: 'vertical',

                expandAndCollapse: true,

                label: {
                    normal: {
                        position: 'top',
                        verticalAlign: 'middle',
                        align: 'right',
                        fontSize: 14
                    }
                },

                leaves: {
                    label: {
                        normal: {
                            position: 'bottom',
                            verticalAlign: 'right',
                            align: 'right',
                            rotate: -90,
                        }
                    }
                },

                animationDurationUpdate: 750
            }
        ]
    });
    }
  }
  
    
}
</script>

<style scoped>
.link{
  color: red;
}
a:hover{
  text-decoration: underline;
}
input {
  height: 35px;
}
</style>