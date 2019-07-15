<template>
  <div class="components-container">
    <el-row :gutter="20" style="margin:30px;">
      <el-col :span="7">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>当前模型选择：
              <p style="color:red;display:inline;font-size:18px;"> <strong>{{ schedulingType }}</strong></p>
            </span>
          </div>
          <p style="font-size:12px;">此处配置项用于设置Kubernetes scheduler使用的具体模型，当前支持队列和MCMF两种调度模型</p>
          <el-button type="primary" style="float:right;margin:20px;" @click.native="clickA">模型选择</el-button>
        </el-card>
      </el-col>
    </el-row>
    <!-- <aside>
      <a href="javascript:void(0)" target="_blank">队列模型</a>
    </aside>
    <div class="board">
      <Kanban :key="1" :list="list1" :group="group" class="kanban todo" header-text="任务情况" />
      <Kanban :key="2" :list="list2" :group="group" class="kanban working" header-text="机器情况" />
      <Kanban :key="3" :list="list3" :group="group" class="kanban done" header-text="任务部署情况" />
    </div>
    <aside>
      <a href="javascript:void(0)" target="_blank">最小费用最大流（MCMF）模型</a>
    </aside>
    <canvas id="test-canvas" style="width:100%;height:300px"></canvas> -->
    <el-dialog v-el-drag-dialog :visible.sync="dialogTableVisible" title="调度模型" @dragDialog="handleDrag">
      <el-select ref="select" v-model="modelType" style="margin-top:0px;margin-bottom:20px;" placeholder="请选择调度模型">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" style="float:right;margin-top:0px;height:5%;display:inline;margin-right:20px;margin-bottom:20px;" @click.native="clickB">确认配置</el-button>
      <div class="card-editor-container">
        <json-editor ref="jsonEditor" v-model="value" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
// import Kanban from '@/components/Kanban'
import JsonEditor from '@/components/JsonEditor'

const jsonData = '[{"items":[{"market_type":"forexdata","symbol":"XAUUSD"},{"market_type":"forexdata","symbol":"UKOIL"},{"market_type":"forexdata","symbol":"CORN"}],"name":""}]'

export default {
  name: 'CountToDemo',
  directives: { elDragDialog },
  components: {
    // Kanban,
    JsonEditor
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
        { value: '队列模型', label: '队列模型' },
        { value: '最小费用最大流模型', label: '最小费用最大流模型' }
      ],
      modelType: '',
      gridData: [{
        date: '2016-05-02',
        name: 'John Smith',
        address: 'No.1518,  Jinshajiang Road, Putuo District'
      }, {
        date: '2016-05-04',
        name: 'John Smith',
        address: 'No.1518,  Jinshajiang Road, Putuo District'
      }, {
        date: '2016-05-01',
        name: 'John Smith',
        address: 'No.1518,  Jinshajiang Road, Putuo District'
      }, {
        date: '2016-05-03',
        name: 'John Smith',
        address: 'No.1518,  Jinshajiang Road, Putuo District'
      }],
      value: JSON.parse(jsonData)
    }
  },
  mounted() {
    // var can = document.getElementById('test-canvas')
    // var ctx = can.getContext('2d')
    // ctx.clearRect(0, 0, 200, 200)
    // ctx.fillStyle = '#dddddd'
    // ctx.fillRect(10, 10, 130, 130)
    // var path = new Path2D()
    // path.arc(75, 75, 50, 0, Math.PI * 2, true)
    // path.moveTo(110, 75)
    // path.arc(75, 75, 35, 0, Math.PI, false)
    // path.moveTo(65, 65)
    // path.arc(60, 65, 5, 0, Math.PI * 2, true)
    // path.moveTo(95, 65)
    // path.arc(90, 65, 5, 0, Math.PI * 2, true)
    // ctx.strokeStyle = '#0000ff'
    // ctx.stroke(path)

    this.$store.dispatch('taskData/getAllTaskData').then((resolve, reject) => {
      console.log('resolve:', resolve)
      this.list1 = resolve['data']
    }).catch((resolve, reject) => {
      console.log('reject:', reject)
    })
  },
  methods: {
    clickA() {
      this.dialogTableVisible = true
    },
    clickB() {
      this.dialogTableVisible = false
      this.schedulingType = this.modelType
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      this.$refs.select.blur()
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

