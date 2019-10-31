<template>
  <div class="components-container">
    <el-row :gutter="20" style="margin:30px;">
      <el-col :span="7" v-for="(item,index) in value" :key="item.name" style="margin-bottom:30px">
        <el-card class="box-card" :style="height" >
          <div slot="header" class="clearfix">
            <span>
              <p style="display:inline;font-size:18px;"> <strong>{{ value[index].name }}</strong></p>
            </span>
          </div>
          <p style="font-size:12px;">{{item.desc}}</p>
          <el-button type="primary" style="float:right;margin:20px;" @click.native="clickA(index)">查看/修改</el-button>
        </el-card>
      </el-col>
    </el-row>
    
    <el-dialog v-el-drag-dialog :visible.sync="dialogTableVisible" :title="this.title"  @dragDialog="handleDrag">
          
            <div class="card-editor-container">
              <!-- <json-editor ref="EditableJson" v-model="value" /> -->
            <EditableJson v-model="json" />
            </div>
            <div style="width:100%;height:50px;">
          <el-button type="primary" style="float:right;margin-top:20px;height:40px;display:inline;" @click.native="clickB">确认</el-button>
          <!-- <el-button type="primary" style="float:right;margin-top:20px;height:40px;display:inline;margin-right:0px;" >取消</el-button> -->

          </div>
        </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
// import Kanban from '@/components/Kanban'
import EditableJson from '@/components/EditableJson'
import {getJsonData, updateJsonData} from '@/api/commonData'


export default {
  name: 'Template',
  directives: { elDragDialog },
  components: {
    EditableJson
  },
  data() {
    return {
      schedulingType: '未选择',
      dialogTableVisible: false,
      options: [
        { value: '', label: '' }
      ],
      modelType: '',
      value: [],
      json:{},
      kind: "Container",
      lifecycle_kind: "lifecycle",
      lifecycle_operator: "container",
      height:"height: 200px"
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
    getJsonData({kind: this.lifecycle_kind ,operator: this.lifecycle_operator}).then(response => {
      this.value = response.data;
      console.log(this.value)
    })
  
  },

  methods: {
    clickA(index) {
      this.dialogTableVisible = true
      this.json = JSON.parse(this.value[index].json)
      this.title = this.value[index].name
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

