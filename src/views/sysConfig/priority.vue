<template>
  <div class="components-container">
    <el-row :gutter="20" style="margin:30px;">
      <el-col :span="7" v-for="(item,index) in value.slice(0,3)" :key="item.title" style="margin-bottom:30px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>
              <p style="display:inline;font-size:18px;"> <strong>{{ value[index].title }}</strong></p>
            </span>
          </div>
          <p style="font-size:12px;">此处配置项用于操作{{item.title}}</p>
          <el-button type="primary" style="float:right;margin:20px;" @click.native="clickA(index)">编辑配置</el-button>
        </el-card>
      </el-col>
    </el-row>
    
    <el-dialog v-el-drag-dialog :visible.sync="dialogTableVisible" :title="json.kind" @dragDialog="handleDrag">
          <el-select ref="select" v-model="modelType" style="margin-top:0px;margin-bottom:20px;" placeholder="请选择调度策略" @change="refreshData">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"  />
          </el-select>
          <el-button type="primary" style="float:right;margin-top:0px;height:5%;display:inline;margin-right:20px;margin-bottom:20px;" @click.native="clickB">确认配置</el-button>
            <el-table
      :key="tableKey"
      v-loading="listLoading"
      border
      fit
      highlight-current-row
      :data="taskList"     
      style="width: 670px;"
    >
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
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
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
    <br>
            <div class="card-editor-container">
              <!-- <json-editor ref="EditableJson" v-model="value" /> -->
            <EditableJson v-model="json" />
            </div>
        </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
// import Kanban from '@/components/Kanban'
import EditableJson from '@/components/EditableJson'
import {getIp,getJsonData,saveContianerConfig } from '@/api/commonData'
import { getPriorityData} from '@/api/taskData'
const defaultData = [[{name:"busybox1",type:"pod",ip:"null",priority:"null",order:1},
        {name:"busybox2",type:"pod",ip:"null",priority:"null",order:2},
        {name:"busybox3",type:"pod",ip:"null",priority:"null",order:3}],
        [{name:"busybox1",type:"pod",ip:"null",priority:"null",order:1},
        {name:"busybox2",type:"pod",ip:"null",priority:"null",order:3},
        {name:"busybox3",type:"pod",ip:"null",priority:"null",order:2}],
        [{name:"busybox1",type:"pod",ip:"null",priority:"null",order:3},
        {name:"busybox2",type:"pod",ip:"null",priority:"null",order:2},
        {name:"busybox3",type:"pod",ip:"null",priority:"null",order:1}]]

const priorityData = [[{name:"busybox1",type:"pod",ip:"null",priority:"1",order:1},
        {name:"busybox2",type:"pod",ip:"null",priority:"2",order:2},
        {name:"busybox3",type:"pod",ip:"null",priority:"3",order:3}],
        [{name:"busybox1",type:"pod",ip:"null",priority:"1",order:1},
        {name:"busybox2",type:"pod",ip:"null",priority:"2",order:3},
        {name:"busybox3",type:"pod",ip:"null",priority:"3",order:2}],
        [{name:"busybox1",type:"pod",ip:"null",priority:"1",order:3},
        {name:"busybox2",type:"pod",ip:"null",priority:"2",order:2},
        {name:"busybox3",type:"pod",ip:"null",priority:"3",order:1}]]


export default {
  name: 'Template',
  directives: { elDragDialog },
  components: {
    // Kanban,
    EditableJson
  },
  data() {
    return {
      schedulingType: '未选择',
      group: 'mission',
      list1: [],
      list2: [],
      list3: [],
      dialogTableVisible: false,
      options: [
        { value: 'default', label: '默认' },
        { value: 'priority', label: '优先级' },
        { value: 'affinity', label: '亲和性' },
        { value: 'anti-affinity', label: '反亲和性' }
      ],
      modelType: '',
      value: [],
      // tasks:[{"key":1,"name":"创建pod"},{"key":2,"name":"创建deployment"}],
      viewerName: "containers",
      json:[],
      kind: "",
      index:0,
      taskList:[{name:"busybox1",type:"pod",ip:"133.133.135.35",priority:2}]

    }
  },
  
  mounted() {
    this.$store.dispatch('taskData/getAllTaskData').then((resolve, reject) => {
      console.log('resolve:', resolve)
      this.list1 = resolve['data']
    }).catch((resolve, reject) => {
      console.log('reject:', reject)
    })
  },
  created() {
    this.ip = getIp(this.viewerName,this.name)
    // getJsonData({viewerName: "templates"}).then(response => {
    //   this.value = response.data;
    //   console.log(this.value)
    // })
    getPriorityData().then(response => {
      this.value = response.data
    })
    this.taskList = [{name:"busybox1",type:"pod",ip:"null",priority:"null",order:1},
        {name:"busybox2",type:"pod",ip:"null",priority:"null",order:2},
        {name:"busybox3",type:"pod",ip:"null",priority:"null",order:3}]
  
  },

  methods: {
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
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      this.$refs.select.blur()
    },
    toRawJson(val){
      var str = JSON.stringify(val)
      str = str.replace(/ +/g,"")
      str = str.replace(/\\n/g,"")
      str = str.substring(1,str.length-1)
      str = str.replace(/\\/g,"")
      return str;
    }
  }
}
</script>

<style lang="scss">

.board {
  margin-left: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}
.kanban {
  &.todo {
    .board-column-header {
      background: #4A9FF9;
    }
  }
  &.working {
    .board-column-header {
      background: #f9944a;
    }
  }
  &.done {
    .board-column-header {
      background: #2ac06d;
    }
  }
}

.card-editor-container{
  position: relative;
  width: 100%;
  height: 70%;
}
</style>

